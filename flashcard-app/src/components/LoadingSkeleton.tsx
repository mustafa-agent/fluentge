export default function LoadingSkeleton() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 bg-white/10 rounded-xl w-2/3 mx-auto mb-6"></div>
      
      {/* Cards skeleton */}
      <div className="space-y-4">
        <div className="h-48 bg-white/10 rounded-2xl"></div>
        <div className="flex gap-3">
          <div className="h-12 bg-white/10 rounded-xl flex-1"></div>
          <div className="h-12 bg-white/10 rounded-xl flex-1"></div>
        </div>
        <div className="h-12 bg-white/10 rounded-xl w-full"></div>
        <div className="h-12 bg-white/10 rounded-xl w-3/4 mx-auto"></div>
      </div>

      {/* Progress bar skeleton */}
      <div className="mt-8 h-3 bg-white/10 rounded-full w-full"></div>
    </div>
  );
}
