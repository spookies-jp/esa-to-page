export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded skeleton"></div>
              <div className="h-8 w-32 bg-muted rounded skeleton"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 w-40 bg-muted rounded skeleton"></div>
              <div className="h-8 w-24 bg-muted rounded skeleton"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 bg-muted rounded skeleton"></div>
                <div className="h-6 w-32 bg-muted rounded skeleton"></div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="h-4 w-24 bg-muted rounded mb-2 skeleton"></div>
                  <div className="h-10 w-full bg-muted rounded-lg skeleton"></div>
                </div>
                <div>
                  <div className="h-4 w-16 bg-muted rounded mb-2 skeleton"></div>
                  <div className="h-10 w-full bg-muted rounded-lg skeleton"></div>
                </div>
                <div className="h-10 w-full bg-muted rounded-lg skeleton"></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-sm border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-muted rounded skeleton"></div>
                    <div className="h-6 w-32 bg-muted rounded skeleton"></div>
                  </div>
                  <div className="h-4 w-12 bg-muted rounded skeleton"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="h-5 w-32 bg-muted rounded skeleton"></div>
                      <div className="h-5 w-40 bg-muted rounded skeleton"></div>
                      <div className="h-5 w-24 bg-muted rounded skeleton"></div>
                      <div className="w-8 h-8 bg-muted rounded skeleton"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}