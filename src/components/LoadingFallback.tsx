const LoadingFallback = () => (
  <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background">
    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-tertiary">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
      Loading
    </div>
  </div>
);

export default LoadingFallback;
