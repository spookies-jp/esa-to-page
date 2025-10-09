import Link from 'next/link';
import { PublishedArticle } from '@/types/article';

export default function ArticleCard({ article }: { article: PublishedArticle }) {
  // Extract title from slug (capitalize and replace hyphens) for fallback when metadata is missing
  const fallbackTitle = article.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const displayTitle = article.title?.trim() || fallbackTitle;
  const excerpt = article.excerpt?.trim();
  const tags = (article.tags ?? [])
    .map(tag => tag.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <article className="group">
      <Link href={`/${article.slug}`} className="block">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-200 hover-lift">
          <h2 className="text-xl md:text-2xl font-bold text-card-foreground mb-3 line-clamp-2">
            {displayTitle}
          </h2>
          {excerpt && (
            <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
              {excerpt}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1.5 text-xs font-medium text-secondary-foreground bg-secondary rounded-full border border-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
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
