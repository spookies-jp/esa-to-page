export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <header className="mb-12">
          <div className="h-10 md:h-14 bg-muted rounded-lg mb-6 skeleton max-w-3xl"></div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-muted rounded-full skeleton"></div>
              <div className="h-4 w-32 bg-muted rounded skeleton"></div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-muted rounded skeleton"></div>
              <div className="h-4 w-24 bg-muted rounded skeleton"></div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-20 bg-muted rounded-full skeleton"></div>
            ))}
          </div>
        </header>

        <div className="bg-card rounded-xl p-6 md:p-10 shadow-sm border border-border mb-8">
          <div className="prose prose-lg max-w-none">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mb-6">
                <div className="h-6 bg-muted rounded mb-3 skeleton"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded skeleton"></div>
                  <div className="h-4 bg-muted rounded skeleton" style={{width: '95%'}}></div>
                  <div className="h-4 bg-muted rounded skeleton" style={{width: '90%'}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}