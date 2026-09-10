export default function SkeletonLoader({ className = '', lines = 3 }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-white/[0.06] rounded"
          style={{ width: `${60 + Math.random() * 40}%` }}
        />
      ))}
    </div>
  );
}
