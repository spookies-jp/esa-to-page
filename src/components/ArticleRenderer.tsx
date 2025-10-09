'use client';

import { useEffect, useRef } from 'react';
import { EsaPost } from '@/types/esa';
import Image from 'next/image';
import Header from './Header';
import Footer from './Footer';
import CodeFontLoader from './CodeFontLoader';

interface ArticleRendererProps {
  article: EsaPost;
}

// CSS scoping with proper bracket matching
function scopeCSS(css: string, scope: string): string {
  // Replace :root with scope
  css = css.replace(/:root(?=\s*\{)/g, scope);

  const addScopeToSelector = (selector: string): string => {
    return selector
      .split(',')
      .map((sel) => {
        sel = sel.trim();
        if (!sel) return '';
        if (sel.includes(scope)) return sel;
        if (/^(from|to|\d+%|100%)$/.test(sel)) return sel;
        return `${scope} ${sel}`;
      })
      .filter(Boolean)
      .join(', ');
  };

  const processCSS = (input: string, depth = 0): string => {
    let result = '';
    let i = 0;
    let selector = '';

    while (i < input.length) {
      const char = input[i];

      if (char === '{') {
        const currentSelector = selector.trim();
        selector = '';

        // Find matching closing brace
        let braceCount = 1;
        let j = i + 1;
        let content = '';

        while (j < input.length && braceCount > 0) {
          if (input[j] === '{') braceCount++;
          else if (input[j] === '}') braceCount--;

          if (braceCount > 0) {
            content += input[j];
          }
          j++;
        }

        // Check what kind of rule this is
        if (currentSelector.startsWith('@keyframes') || currentSelector.startsWith('@font-face')) {
          // Don't scope these
          result += `${currentSelector} { ${content} }`;
        } else if (currentSelector.startsWith('@media') || currentSelector.startsWith('@supports')) {
          // Recursively process content
          const processedContent = processCSS(content, depth + 1);
          result += `${currentSelector} { ${processedContent} }`;
        } else if (currentSelector.startsWith('@')) {
          // Other @-rules, keep as-is
          result += `${currentSelector} { ${content} }`;
        } else {
          // Regular selector - scope it
          const scopedSelector = addScopeToSelector(currentSelector);
          result += `${scopedSelector} { ${content} }`;
        }

        i = j;
        continue;
      }

      selector += char;
      i++;
    }

    // Add any remaining content
    if (selector.trim()) {
      result += selector;
    }

    return result;
  };

  return processCSS(css);
}

export default function ArticleRenderer({ article }: ArticleRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const addedStylesRef = useRef<HTMLStyleElement[]>([]);
  const addedScriptsRef = useRef<HTMLScriptElement[]>([]);

  // Check if article contains code blocks
  const hasCodeBlocks = article.body_html.includes('<code') || article.body_html.includes('<pre');

  useEffect(() => {
    if (!contentRef.current) return;

    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = article.body_html;

    // Extract and handle style tags
    const styleTags = tempDiv.querySelectorAll('style');
    styleTags.forEach((styleTag) => {
      const originalCSS = styleTag.textContent || '';
      const scopedCSS = scopeCSS(originalCSS, '.article-content');

      const newStyle = document.createElement('style');
      newStyle.textContent = scopedCSS;
      if (styleTag.id) newStyle.id = styleTag.id;

      // Debug: log the scoped CSS
      console.log('Original CSS length:', originalCSS.length);
      console.log('Scoped CSS length:', scopedCSS.length);
      console.log('First 500 chars of scoped CSS:', scopedCSS.substring(0, 500));

      document.head.appendChild(newStyle);
      addedStylesRef.current.push(newStyle);
      styleTag.remove();
    });

    // Extract and handle script tags
    const scriptTags = tempDiv.querySelectorAll('script');
    const scriptsToExecute: Array<{ src?: string; content?: string; attributes: Record<string, string> }> = [];

    scriptTags.forEach((scriptTag) => {
      const scriptInfo: { src?: string; content?: string; attributes: Record<string, string> } = {
        attributes: {}
      };

      // Copy attributes
      Array.from(scriptTag.attributes).forEach((attr) => {
        scriptInfo.attributes[attr.name] = attr.value;
      });

      if (scriptTag.src) {
        scriptInfo.src = scriptTag.src;
      } else {
        scriptInfo.content = scriptTag.textContent || '';
      }

      scriptsToExecute.push(scriptInfo);
      scriptTag.remove();
    });

    // Set the remaining HTML content
    contentRef.current.innerHTML = tempDiv.innerHTML;

    // Execute scripts sequentially
    scriptsToExecute.forEach((scriptInfo) => {
      const newScript = document.createElement('script');

      // Set attributes
      Object.entries(scriptInfo.attributes).forEach(([key, value]) => {
        newScript.setAttribute(key, value);
      });

      if (scriptInfo.src) {
        newScript.src = scriptInfo.src;
      } else if (scriptInfo.content) {
        newScript.textContent = scriptInfo.content;
      }

      document.body.appendChild(newScript);
      addedScriptsRef.current.push(newScript);
    });

    // Cleanup function to remove added styles and scripts
    return () => {
      // Remove style tags added by this component
      addedStylesRef.current.forEach((style) => {
        style.remove();
      });
      addedStylesRef.current = [];

      // Remove script tags added by this component
      addedScriptsRef.current.forEach((script) => {
        script.remove();
      });
      addedScriptsRef.current = [];
    };
  }, [article.body_html]);

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
            <div className="article-content" ref={contentRef} />
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