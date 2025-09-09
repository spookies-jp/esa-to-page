import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getSession } from '@/lib/auth';
import { getAllArticles } from '@/lib/db';
import ArticleForm from './components/ArticleForm';
import ArticleList from './components/ArticleList';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }

  const { env } = getCloudflareContext();
  
  if (session.workspace !== env.ESA_WORKSPACE) {
    redirect('/admin/login?error=unauthorized_workspace');
  }

  // In development, show message
  if (!env.DB) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-card-foreground">
                開発環境エラー
              </h1>
            </div>
            <p className="text-muted-foreground">
              開発環境ではデータベースに接続できません。
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              プレビューモード（<code className="bg-secondary px-2 py-1 rounded text-secondary-foreground font-mono text-xs">pnpm run preview</code>）を使用してください
            </p>
          </div>
        </div>
      </div>
    );
  }

  const articles = await getAllArticles(env.DB);

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h1 className="text-2xl font-bold text-card-foreground">記事管理</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session.user?.email || 'Unknown User'}
              </span>
              <form action="/api/auth/logout" method="POST" className="inline">
                <button
                  type="submit"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <h2 className="text-lg font-semibold text-card-foreground">
                  新規記事登録
                </h2>
              </div>
              <ArticleForm />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-sm border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h2 className="text-lg font-semibold text-card-foreground">
                      公開中の記事
                    </h2>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {articles.length} 件
                  </span>
                </div>
              </div>
              <div className="p-6">
                <ArticleList articles={articles} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}