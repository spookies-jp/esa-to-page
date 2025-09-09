import { EsaPost } from '@/types/esa';
import Image from 'next/image';
import Header from './Header';
import Footer from './Footer';
import CodeFontLoader from './CodeFontLoader';

interface ArticleRendererProps {
  article: EsaPost;
}

export default function ArticleRenderer({ article }: ArticleRendererProps) {
  // Check if article contains code blocks
  const hasCodeBlocks = article.body_html.includes('<code') || article.body_html.includes('<pre');
  
  return (
    <>
      {hasCodeBlocks && <CodeFontLoader />}
      <Header />
      <div className="flex-1 bg-background">
      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {article.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            {article.user && (
              <div className="flex items-center gap-2">
                {article.user.icon && (
                  <Image
                    src={article.user.icon}
                    alt={article.user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-border"
                  />
                )}
                <span className="font-medium">{article.user.name || 'Unknown'}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={article.created_at}>
                {new Date(article.created_at).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            {article.updated_at !== article.created_at && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <time dateTime={article.updated_at}>
                  {new Date(article.updated_at).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            )}
          </div>
          {article.category && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {article.category}
              </span>
            </div>
          )}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1.5 text-xs font-medium text-secondary-foreground bg-secondary rounded-full border border-border hover:bg-accent transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>
          <div className="bg-card rounded-xl p-6 md:p-10 shadow-sm border border-border mb-8">
            <div className="article-content" dangerouslySetInnerHTML={{ __html: article.body_html }} />
          </div>
        <footer className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">Powered by esa to page</p>
        </footer>
      </article>
      </div>
      <Footer showAdminLink={false} />
    </>
  );
}