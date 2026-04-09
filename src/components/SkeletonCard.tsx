export default function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="h-44 shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded-full shimmer" />
        <div className="h-4 w-3/4 rounded-full shimmer" />
        <div className="h-3 w-1/2 rounded-full shimmer" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 w-20 rounded-full shimmer" />
          <div className="h-9 w-24 rounded-pill shimmer" />
        </div>
      </div>
    </div>
  );
}
