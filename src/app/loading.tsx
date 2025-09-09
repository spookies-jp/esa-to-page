export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <header className="mb-12 md:mb-16 text-center">
          <div className="h-12 md:h-14 bg-muted rounded-lg mx-auto max-w-md mb-4 skeleton"></div>
          <div className="h-6 md:h-8 bg-muted rounded-lg mx-auto max-w-2xl skeleton"></div>
        </header>

        <main>
          <div className="grid gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-8 md:p-10">
                  <div className="h-8 md:h-10 bg-muted rounded-lg mb-4 skeleton"></div>
                  <div className="h-5 bg-muted rounded-lg mb-6 max-w-sm skeleton"></div>
                  
                  <div className="flex gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-lg skeleton"></div>
                      <div className="h-4 w-32 bg-muted rounded skeleton"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-lg skeleton"></div>
                      <div className="h-4 w-24 bg-muted rounded skeleton"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-muted rounded skeleton"></div>
                    <div className="w-12 h-12 bg-muted rounded-full skeleton"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}