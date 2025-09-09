import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getAllArticles } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Icons } from '@/components/Icons';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { env } = getCloudflareContext();
  
  // In development, we can't access D1, so return empty array
  if (!env.DB) {
    return (
      <>
        <Header />
        <div className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            <header className="mb-12 md:mb-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight animate-fade-in">
                esa Articles
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
                esaから公開されている記事の一覧です
              </p>
            </header>
          <main>
            <div className="bg-card rounded-xl shadow-lg border border-border p-8 md:p-12 text-center">
              <div className="max-w-md mx-auto">
                {Icons.monitor}
                <p className="text-muted-foreground text-lg">
                  開発環境ではデータベースに接続できません
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  プレビューモード（<code className="bg-secondary px-2 py-1 rounded text-secondary-foreground font-mono text-xs">pnpm run preview</code>）を使用してください
                </p>
              </div>
            </div>
          </main>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  const articles = await getAllArticles(env.DB);

  return (
    <>
      <Header />
      <div className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          <header className="mb-12 md:mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight animate-fade-in">
              esa Articles
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.1s'}}>
              esaから公開されている記事の一覧です
            </p>
          </header>

        <main>
          {articles.length === 0 ? (
            <div className="bg-card rounded-xl shadow-lg border border-border p-8 md:p-12 text-center">
              <div className="max-w-md mx-auto">
                {Icons.book}
                <p className="text-muted-foreground text-lg">
                  まだ公開されている記事はありません
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </main>

        </div>
      </div>
      <Footer />
    </>
  );
}