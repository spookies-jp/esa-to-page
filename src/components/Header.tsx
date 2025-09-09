'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Icons } from './Icons';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) return;
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolled(window.scrollY > 10);
      scrollTimeoutRef.current = undefined;
    }, 50); // Throttle to 50ms
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 border-b border-border' 
        : 'bg-background border-b border-border'
    }`}>
      <nav className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <svg className="w-8 h-8 text-primary transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">
                esa Articles
              </span>
            </Link>

            {!isAdmin && (
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  ホーム
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!isAdmin && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                管理画面
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="メニューを開く"
            >
              {isMobileMenuOpen ? Icons.close : Icons.menu}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-slide-up">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/" 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent ${
                  pathname === '/' ? 'text-primary bg-accent' : 'text-muted-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ホーム
              </Link>
              {!isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  管理画面
                </Link>
              )}
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}