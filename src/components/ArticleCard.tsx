import Link from 'next/link';
import { PublishedArticle } from '@/types/article';

export default function ArticleCard({ article }: { article: PublishedArticle }) {
  // Extract title from slug (capitalize and replace hyphens)
  const title = article.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <article className="group">
      <Link href={`/${article.slug}`} className="block">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-200 hover-lift">
          <h2 className="text-xl md:text-2xl font-bold text-card-foreground mb-3 line-clamp-2">
            {title}
          </h2>
          
          <p className="text-muted-foreground mb-4 text-sm line-clamp-1">
            {article.slug}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <time dateTime={article.created_at}>
                {new Date(article.created_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
              
              {article.updated_at !== article.created_at && (
                <span>
                  更新: {new Date(article.updated_at).toLocaleDateString('ja-JP', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
            
            <span className="text-primary font-medium flex items-center gap-1">
              読む
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}