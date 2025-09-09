import { EsaPost } from '@/types/esa';

const CACHE_TTL = 6 * 60 * 60; // 6 hours in seconds

export function getCacheKey(workspace: string, postId: number): string {
  return `esa_article_${workspace}_${postId}`;
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

export async function invalidateCache(
  kv: KVNamespace,
  workspace: string,
  postId: number
): Promise<void> {
  const key = getCacheKey(workspace, postId);
  await kv.delete(key);
}

export async function deleteCachedArticle(
  kv: KVNamespace,
  workspace: string,
  postId: number
): Promise<void> {
  const key = getCacheKey(workspace, postId);
  await kv.delete(key);
}