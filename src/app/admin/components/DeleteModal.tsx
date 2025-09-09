'use client';

import { PublishedArticle } from '@/types/article';

interface DeleteModalProps {
  article: PublishedArticle;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ article, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-fade-in">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-xl bg-card text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg animate-slide-in">
            <div className="bg-card px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    記事を削除しますか？
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      「<span className="font-medium text-card-foreground">{article.slug}</span>」を削除しようとしています。
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      この操作は取り消せません。よろしいですか？
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90 sm:ml-3 sm:w-auto transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                削除する
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="mt-3 inline-flex w-full justify-center items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-accent sm:mt-0 sm:w-auto transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}