export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-black/[0.06] shadow-sm">
      <div className="px-5 pt-5 pb-3 space-y-3">
        <div className="w-14 h-14 rounded-2xl shimmer" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 w-14 rounded-full shimmer" />
        </div>
        <div className="h-3 w-16 rounded-full shimmer" />
        <div className="h-4 w-3/4 rounded-full shimmer" />
        <div className="h-3 w-1/2 rounded-full shimmer" />
        <div className="h-3 w-24 rounded-full shimmer" />
      </div>
      <div className="px-5 pb-5 flex items-end justify-between gap-3">
        <div className="space-y-1.5">
          <div className="h-5 w-20 rounded-full shimmer" />
          <div className="h-3 w-14 rounded-full shimmer" />
        </div>
        <div className="h-8 w-20 rounded-pill shimmer" />
      </div>
    </div>
  );
}