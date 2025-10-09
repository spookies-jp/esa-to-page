import { cache } from 'react';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getArticleBySlug } from '@/lib/db';
import { getCachedArticle, setCachedArticle, setCachedArticleMetadata } from '@/lib/cache';
import { createEsaApiClient } from '@/lib/esa-api';
import ArticleRenderer from '@/components/ArticleRenderer';

const getArticleData = cache(async (slug: string) => {
  const { env } = getCloudflareContext();

  if (!env.DB || !env.KV) {
    throw new Error('Missing database or KV binding');
  }

  const article = await getArticleBySlug(env.DB, slug);
  if (!article) {
    return {
      article: null,
      esaPost: null,
    };
  }

  let esaPost = await getCachedArticle(env.KV, article.workspace, article.esa_post_id);

  if (!esaPost) {
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

      await setCachedArticle(env.KV, article.workspace, article.esa_post_id, esaPost);
      await setCachedArticleMetadata(env.KV, article.workspace, article.esa_post_id, esaPost);
    } catch (error) {
      if (error instanceof Error && error.message === 'Resource not found') {
        return {
          article,
          esaPost: null,
        };
      }
      throw error;
    }
  }

  return {
    article,
    esaPost,
  };
});

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { env } = getCloudflareContext();
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
    const { article, esaPost } = await getArticleData(slug);

    if (!article) {
      return {
        title: 'Not Found',
      };
    }

    if (!esaPost) {
      return {
        title: article.slug,
      };
    }

    return {
      title: esaPost.name,
      description: esaPost.body_md.slice(0, 160) + '...',
    };
  } catch {
    return {
      title: slug,
    };
  }
}
