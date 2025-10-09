import { EsaPost } from '@/types/esa';

const CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

export type ArticleMetadata = {
  title: string;
  excerpt: string;
  tags: string[];
  category: string;
  updated_at: string;
};

export function getCacheKey(workspace: string, postId: number): string {
  return `esa_article_${workspace}_${postId}`;
}

export function getMetadataCacheKey(workspace: string, postId: number): string {
  return `esa_metadata_${workspace}_${postId}`;
}

export async function getCachedArticle(
  kv: KVNamespace,
  workspace: string,
  postId: number
): Promise<EsaPost | null> {
  const key = getCacheKey(workspace, postId);
  const cached = await kv.get(key, 'json');
  return cached as EsaPost | null;
}

export async function getCachedArticleMetadata(
  kv: KVNamespace,
  workspace: string,
  postId: number
): Promise<ArticleMetadata | null> {
  const key = getMetadataCacheKey(workspace, postId);
  const cached = await kv.get(key, 'json');
  return cached as ArticleMetadata | null;
}

export async function setCachedArticle(
  kv: KVNamespace,
  workspace: string,
  postId: number,
  article: EsaPost
): Promise<void> {
  const key = getCacheKey(workspace, postId);
  await kv.put(key, JSON.stringify(article), {
    expirationTtl: CACHE_TTL
  });
}

export async function setCachedArticleMetadata(
  kv: KVNamespace,
  workspace: string,
  postId: number,
  article: EsaPost
): Promise<void> {
  const key = getMetadataCacheKey(workspace, postId);
  const metadata: ArticleMetadata = {
    title: article.name,
    excerpt: article.body_md.slice(0, 200),
    tags: article.tags ?? [],
    category: article.category,
    updated_at: article.updated_at
  };

  await kv.put(key, JSON.stringify(metadata), {
    expirationTtl: CACHE_TTL
  });
}

export async function invalidateCache(
  kv: KVNamespace,
  workspace: string,
  postId: number
): Promise<void> {
  const articleKey = getCacheKey(workspace, postId);
  const metadataKey = getMetadataCacheKey(workspace, postId);
  await kv.delete(articleKey);
  await kv.delete(metadataKey);
}

export async function deleteCachedArticle(
  kv: KVNamespace,
  workspace: string,
  postId: number
): Promise<void> {
  const articleKey = getCacheKey(workspace, postId);
  const metadataKey = getMetadataCacheKey(workspace, postId);
  await kv.delete(articleKey);
  await kv.delete(metadataKey);
}
