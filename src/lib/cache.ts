import { EsaPost } from '@/types/esa';

const CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds
const ARTICLE_LIST_CACHE_TTL = 60 * 60; // 1 hour for article list

export type ArticleMetadata = {
  title: string;
  excerpt: string;
  tags: string[];
  category: string;
  updated_at: string;
  workspace: string;
  postId: number;
};

export type ArticleListItem = {
  id: number;
  slug: string;
  esa_post_id: number;
  workspace: string;
  esa_url: string;
  created_at: string;
  updated_at: string;
  title?: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
  article_updated_at?: string;
};

export function getCacheKey(slug: string): string {
  return `esa_article_${slug}`;
}

export function getMetadataCacheKey(slug: string): string {
  return `esa_metadata_${slug}`;
}

export async function getCachedArticle(
  kv: KVNamespace,
  slug: string
): Promise<EsaPost | null> {
  const key = getCacheKey(slug);
  const cached = await kv.get(key, 'json');
  return cached as EsaPost | null;
}

export async function getCachedArticleMetadata(
  kv: KVNamespace,
  slug: string
): Promise<ArticleMetadata | null> {
  const key = getMetadataCacheKey(slug);
  const cached = await kv.get(key, 'json');
  return cached as ArticleMetadata | null;
}

export async function setCachedArticle(
  kv: KVNamespace,
  slug: string,
  article: EsaPost
): Promise<void> {
  const key = getCacheKey(slug);
  await kv.put(key, JSON.stringify(article), {
    expirationTtl: CACHE_TTL
  });
}

export async function setCachedArticleMetadata(
  kv: KVNamespace,
  slug: string,
  article: EsaPost,
  workspace: string,
  postId: number
): Promise<void> {
  const key = getMetadataCacheKey(slug);
  const metadata: ArticleMetadata = {
    title: article.name,
    excerpt: article.body_md.slice(0, 200),
    tags: article.tags ?? [],
    category: article.category,
    updated_at: article.updated_at,
    workspace,
    postId
  };

  await kv.put(key, JSON.stringify(metadata), {
    expirationTtl: CACHE_TTL
  });
}

export async function invalidateCache(
  kv: KVNamespace,
  slug: string
): Promise<void> {
  const articleKey = getCacheKey(slug);
  const metadataKey = getMetadataCacheKey(slug);
  await kv.delete(articleKey);
  await kv.delete(metadataKey);
}

export async function deleteCachedArticle(
  kv: KVNamespace,
  slug: string
): Promise<void> {
  const articleKey = getCacheKey(slug);
  const metadataKey = getMetadataCacheKey(slug);
  await kv.delete(articleKey);
  await kv.delete(metadataKey);
}

// Article list caching
const ARTICLE_LIST_CACHE_KEY = 'article_list_with_metadata';

export async function getCachedArticleList(
  kv: KVNamespace
): Promise<ArticleListItem[] | null> {
  const cached = await kv.get(ARTICLE_LIST_CACHE_KEY, 'json');
  return cached as ArticleListItem[] | null;
}

export async function setCachedArticleList(
  kv: KVNamespace,
  articles: ArticleListItem[]
): Promise<void> {
  await kv.put(ARTICLE_LIST_CACHE_KEY, JSON.stringify(articles), {
    expirationTtl: ARTICLE_LIST_CACHE_TTL
  });
}

export async function invalidateArticleListCache(
  kv: KVNamespace
): Promise<void> {
  await kv.delete(ARTICLE_LIST_CACHE_KEY);
}

