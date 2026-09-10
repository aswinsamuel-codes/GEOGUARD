import { motion } from 'framer-motion';
import AnimatedNumber from '../common/AnimatedNumber';
import { getRiskLevel } from '../../utils/constants';

export default function KPICard({ title, value, suffix = '', prefix = '', icon: Icon, decimals = 0, trend, riskScore, delay = 0 }) {
  const level = riskScore != null ? getRiskLevel(riskScore) : null;
  const trendColor = trend > 0 ? 'text-risk-critical' : trend < 0 ? 'text-risk-safe' : 'text-gray-500';
  const trendArrow = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="kpi-card group"
    >
      {/* Accent glow */}
      {level && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
          style={{ background: `linear-gradient(90deg, ${level.color}60, transparent)` }}
        />
      )}

      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-white/[0.04]">
            <Icon size={16} className="text-gray-500" />
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 mt-1">
        <span className="text-2xl sm:text-3xl font-bold text-white leading-none"
              style={level ? { color: level.color } : {}}>
          {typeof value === 'number' ? (
            <AnimatedNumber value={value} decimals={decimals} prefix={prefix} suffix="" />
          ) : (
            <span>{prefix}{value}{suffix}</span>
          )}
        </span>
        {suffix && <span className="text-sm text-gray-400 mb-0.5">{suffix}</span>}
      </div>

      {trend != null && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <span>{trendArrow}</span>
          <span>{Math.abs(trend)}%</span>
          <span className="text-gray-500 ml-1">vs 1h ago</span>
        </div>
      )}
    </motion.div>
  );
}
