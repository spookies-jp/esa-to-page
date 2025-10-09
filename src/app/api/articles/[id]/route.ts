import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { requireAuth } from '@/lib/auth';
import { updateArticle, deleteArticle, getArticleById } from '@/lib/db';
import { invalidateCache, invalidateArticleListCache } from '@/lib/cache';
import { UpdateArticleInput } from '@/types/article';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { env } = getCloudflareContext();
  
  try {
    await requireAuth();
    
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const body: UpdateArticleInput = await request.json();
    
    if (body.slug && !/^[a-z0-9\-]+$/.test(body.slug)) {
      return NextResponse.json(
        { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }
    
    const existingArticle = await getArticleById(env.DB, id);
    if (existingArticle) {
      await invalidateCache(env.KV, existingArticle.workspace, existingArticle.esa_post_id);
    }

    const article = await updateArticle(env.DB, id, body);

    // Invalidate article list cache
    await invalidateArticleListCache(env.KV);

    return NextResponse.json({ success: true, article });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (error.message === 'Article not found') {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      if (error.message.includes('UNIQUE constraint failed')) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { env } = getCloudflareContext();
  
  try {
    await requireAuth();
    
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const article = await getArticleById(env.DB, id);
    if (article) {
      await invalidateCache(env.KV, article.workspace, article.esa_post_id);
    }

    await deleteArticle(env.DB, id);

    // Invalidate article list cache
    await invalidateArticleListCache(env.KV);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}