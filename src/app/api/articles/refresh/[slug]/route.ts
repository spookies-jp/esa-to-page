import { NextRequest } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getArticleBySlug } from '@/lib/db';
import { deleteCachedArticle, setCachedArticle, setCachedArticleMetadata, invalidateArticleListCache } from '@/lib/cache';
import { createEsaApiClient } from '@/lib/esa-api';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const { env } = getCloudflareContext();

  // Check if we have necessary environment variables
  if (!env.DB || !env.KV || !env.ESA_ACCESS_TOKEN) {
    return Response.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    // Get article from database
    const article = await getArticleBySlug(env.DB, slug);
    if (!article) {
      return Response.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Delete existing cache
    await deleteCachedArticle(env.KV, slug);

    // Fetch fresh data from esa
    const client = createEsaApiClient(env.ESA_ACCESS_TOKEN, article.workspace);
    const esaPost = await client.getPost(article.esa_post_id);

    // Cache the fresh data
    await setCachedArticle(env.KV, slug, esaPost);
    await setCachedArticleMetadata(env.KV, slug, esaPost, article.workspace, article.esa_post_id);

    // Invalidate article list cache
    await invalidateArticleListCache(env.KV);

    return Response.json({
      success: true,
      message: 'Cache refreshed successfully'
    });
  } catch (error) {
    console.error('Error refreshing cache:', error);
    return Response.json(
      { error: 'Failed to refresh cache' },
      { status: 500 }
    );
  }
}