import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 認証チェック - 管理者のみ実行可能
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // リクエストボディから再検証するパスを取得
    const body = await request.json() as { path?: string; type?: 'page' | 'layout' };
    const { path, type = 'page' } = body;

    if (!path) {
      return Response.json({ error: 'Path is required' }, { status: 400 });
    }

    // パスの再検証
    if (type === 'layout') {
      // レイアウトの再検証（すべての子ページも再検証される）
      revalidatePath(path, 'layout');
    } else {
      // 特定のページのみ再検証
      revalidatePath(path, 'page');
    }

    console.log(`Revalidated path: ${path} (type: ${type})`);

    return Response.json({ 
      success: true, 
      message: `Successfully revalidated ${path}`,
      revalidated: true 
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return Response.json(
      { error: 'Failed to revalidate', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// 特定の記事を再検証するヘルパーエンドポイント
export async function PUT(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as { slug?: string };
    const { slug } = body;

    if (!slug) {
      return Response.json({ error: 'Slug is required' }, { status: 400 });
    }

    // 記事ページの再検証
    revalidatePath(`/${slug}`, 'page');
    // ホームページも再検証（記事一覧が更新される可能性があるため）
    revalidatePath('/', 'page');

    console.log(`Revalidated article: ${slug}`);

    return Response.json({
      success: true,
      message: `Successfully revalidated article: ${slug}`,
      revalidated: {
        article: `/${slug}`,
        home: '/'
      }
    });
  } catch (error) {
    console.error('Article revalidation error:', error);
    return Response.json(
      { error: 'Failed to revalidate article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}