'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RefreshButtonProps {
  slug: string;
  className?: string;
}

export default function RefreshButton({ slug, className = '' }: RefreshButtonProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/articles/refresh/${slug}`, {
        method: 'POST',
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error('Failed to refresh cache');
      }
    } catch (error) {
      console.error('Error refreshing cache:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${className}`}
      title="記事の内容を最新に更新"
    >
      <svg 
        className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
      <span className="hidden sm:inline">{isRefreshing ? '更新中...' : 'キャッシュを更新'}</span>
    </button>
  );
}