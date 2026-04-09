export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0A0F', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="h-48 shimmer" style={{ background: '#0F0F18' }} />
      <div className="p-4 space-y-3" style={{ background: '#0A0A0F' }}>
        <div className="h-3 w-14 rounded-full shimmer" />
        <div className="h-4 w-3/4 rounded-full shimmer" />
        <div className="h-3 w-1/2 rounded-full shimmer" />
        <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="h-6 w-20 rounded-full shimmer" />
          <div className="h-9 w-24 rounded-pill shimmer" />
        </div>
      </div>
    </div>
  );
}