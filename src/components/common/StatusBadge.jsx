import { getRiskLevel } from '../../utils/constants';

export default function StatusBadge({ score, size = 'sm' }) {
  const level = getRiskLevel(score);
  const sizes = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-5 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wider ${sizes[size]}`}
      style={{
        backgroundColor: `${level.color}18`,
        color: level.color,
        border: `1px solid ${level.color}40`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-2"
        style={{ backgroundColor: level.color, boxShadow: `0 0 6px ${level.color}` }}
      />
      {level.label}
    </span>
  );
}
