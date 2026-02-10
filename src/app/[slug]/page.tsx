import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getArticleBySlug, getArticleByWorkspaceAndPostId } from '@/lib/db';
import { getCachedArticle, setCachedArticle, setCachedArticleMetadata, getCachedArticleMetadata } from '@/lib/cache';
import { createEsaApiClient } from '@/lib/esa-api';
import ArticleRenderer from '@/components/ArticleRenderer';

// httpsのみに統一し、未使用キャプチャグループを削除
const ESA_POST_URL_PATTERN = 'https://([^.\\/]+)\\.esa\\.io/posts/(\\d+)';

const rewriteEsaLinksToPublishedSlug = async (
  html: string,
  db: D1Database
): Promise<string> => {
  // 毎回新しいRegExpインスタンスを作成（gフラグの状態保持問題を回避）
  const regex = new RegExp(ESA_POST_URL_PATTERN, 'g');
  const matches = Array.from(html.matchAll(regex));
  if (matches.length === 0) return html;

  const uniqueKeys = new Map<string, { workspace: string; postId: number }>();
  matches.forEach((match) => {
    const workspace = match[1];
    const postId = Number(match[2]);
    if (!workspace || Number.isNaN(postId)) return;

    // workspaceパラメータの入力検証（英数字とハイフンのみ許可）
    if (!/^[a-zA-Z0-9-]+$/.test(workspace)) return;

    const key = `${workspace}:${postId}`;
    if (!uniqueKeys.has(key)) {
      uniqueKeys.set(key, { workspace, postId });
    }
  });

  const entries = await Promise.all(
    Array.from(uniqueKeys.values()).map(async ({ workspace, postId }) => {
      const article = await getArticleByWorkspaceAndPostId(db, workspace, postId);
      return article ? [`${workspace}:${postId}`, article.slug] as const : null;
    })
  );

  const slugMap = new Map<string, string>();
  entries.forEach((entry) => {
    if (entry) slugMap.set(entry[0], entry[1]);
  });

  if (slugMap.size === 0) return html;

  // ESA post subpathsを保持（files/等のパスを壊さない）
  return html.replace(regex, (fullMatch, workspace, postId) => {
    const key = `${workspace}:${postId}`;
    const slug = slugMap.get(key);
    if (!slug) return fullMatch;

    try {
      const url = new URL(fullMatch);
      // pathname全体を保持（/posts/123/files/456 等）
      const pathname = url.pathname.replace(`/posts/${postId}`, `/${slug}`);
      return `${pathname}${url.search}${url.hash}`;
    } catch {
      return `/${slug}`;
    }
  });
};

const getArticleData = cache(async (slug: string) => {
  const { env } = await getCloudflareContext({ async: true });

  if (!env.DB || !env.KV) {
    throw new Error('Missing database or KV binding');
  }

  // Cache-first approach: Try to get article content from cache
  let esaPost = await getCachedArticle(env.KV, slug);

  if (esaPost) {
    // Article content cache hit - apply link rewriting at read time
    const rewrittenHtml = await rewriteEsaLinksToPublishedSlug(esaPost.body_html, env.DB);
    return {
        article: { slug, esa_post_id: 0, workspace: '', esa_url: '', id: 0, created_at: '', updated_at: '' },
        esaPost: {
          ...esaPost,
          body_html: rewrittenHtml
        },
    };
  }

  // Cache miss: fetch article metadata from DB
  const article = await getArticleBySlug(env.DB, slug);

  if (!article) {
    return {
      article: null,
      esaPost: null,
    };
  }

  // Fetch from esa API
  try {
    const client = createEsaApiClient(env.ESA_ACCESS_TOKEN, article.workspace);
    esaPost = await client.getPost(article.esa_post_id);

    // Log the fetched data for debugging
    console.log('Fetched esa post:', {
      number: esaPost.number,
      name: esaPost.name,
      hasUser: !!esaPost.user,
      userIcon: esaPost.user?.icon,
    });

    // Save original HTML to cache (without link rewriting)
    await setCachedArticle(env.KV, slug, esaPost);
    await setCachedArticleMetadata(env.KV, slug, esaPost, article.workspace, article.esa_post_id);

    // Apply link rewriting at read time
    const rewrittenHtml = await rewriteEsaLinksToPublishedSlug(esaPost.body_html, env.DB);
    return {
      article,
      esaPost: {
        ...esaPost,
        body_html: rewrittenHtml
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'Resource not found') {
      return {
        article,
        esaPost: null,
      };
    }
    throw error;
  }
});

// Cloudflare Workers requires force-dynamic for edge runtime
// Rely on KV cache (24h TTL) for performance
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { env } = await getCloudflareContext({ async: true });
  const { slug } = await params;
  
  // In development, show error message
  if (!env.DB || !env.KV) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-2xl font-bold text-card-foreground mb-4">開発環境エラー</h1>
            <p className="text-muted-foreground mb-2">
              開発環境ではデータベースに接続できません
            </p>
            <p className="text-sm text-muted-foreground">
              プレビューモード（<code className="bg-secondary px-2 py-1 rounded text-secondary-foreground font-mono text-xs">pnpm run preview</code>）を使用してください
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const { article, esaPost } = await getArticleData(slug);

  if (!article || !esaPost) {
    notFound();
  }

  return <ArticleRenderer article={esaPost} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const { env } = await getCloudflareContext({ async: true });

    if (!env.DB || !env.KV) {
      return {
        title: slug,
      };
    }

    // Cache-first: Try to get metadata from cache (no DB access needed!)
    const metadata = await getCachedArticleMetadata(env.KV, slug);

    if (metadata) {
      return {
        title: metadata.title,
        description: metadata.excerpt,
      };
    }

    // Cache miss: Fall back to DB
    const article = await getArticleBySlug(env.DB, slug);

    if (!article) {
      return {
        title: 'Not Found',
      };
    }

    return {
      title: article.slug,
    };
  } catch {
    return {
      title: slug,
    };
  }
}
