import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { requireAuth } from '@/lib/auth';
import { createArticle, getAllArticles } from '@/lib/db';
import { invalidateArticleListCache } from '@/lib/cache';
import { CreateArticleInput } from '@/types/article';

export async function GET() {
  const { env } = getCloudflareContext();
  
  try {
    await requireAuth();
    const articles = await getAllArticles(env.DB);
    return NextResponse.json({ articles });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  
  try {
    await requireAuth();
    
    const body: CreateArticleInput = await request.json();
    
    if (!body.esaUrl || !body.slug) {
      return NextResponse.json(
        { error: 'esaUrl and slug are required' },
        { status: 400 }
      );
    }
    
    if (!/^[a-z0-9\-]+$/.test(body.slug)) {
      return NextResponse.json(
        { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }
    
    const article = await createArticle(env.DB, body);

    // Invalidate article list cache
    await invalidateArticleListCache(env.KV);

    return NextResponse.json({ success: true, article });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (error.message.includes('UNIQUE constraint failed')) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}