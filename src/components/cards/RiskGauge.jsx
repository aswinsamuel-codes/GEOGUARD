import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getRiskLevel, RISK_FACTORS } from '../../utils/constants';
import AnimatedNumber from '../common/AnimatedNumber';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function RiskGauge({ score, factors = {}, size = 200 }) {
  const [expanded, setExpanded] = useState(false);
  const level = getRiskLevel(score);

  const circumference = 2 * Math.PI * 40;
  const progress = (score / 100) * 0.75;
  const dashOffset = circumference * (1 - progress);

  const breakdown = useMemo(() => {
    if (Array.isArray(factors) && factors.length > 0) {
      return factors.map(f => ({
        key: f.key,
        label: f.label,
        percentage: f.percentage || 15,
        contribution: f.contribution || 0,
        rawValue: f.rawValue || '',
      }));
    }
    return RISK_FACTORS.map(rf => ({
      ...rf,
      contribution: Math.round((factors[rf.key] ?? score * rf.weight / 0.35) * rf.weight),
      rawValue: '',
    }));
  }, [factors, score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-title">Geo-Risk Score</h3>
        <span className="text-[10px] text-gray-500 font-mono">COMPOSITE INDEX</span>
      </div>

      {/* Gauge SVG */}
      <div className="flex justify-center py-2">
        <div className="relative" style={{ width: size, height: size * 0.65 }}>
          <svg viewBox="0 0 100 65" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 55 A 40 40 0 1 1 90 55"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Colored segments */}
            <path d="M 10 55 A 40 40 0 1 1 90 55" fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${circumference * 0.75}`}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="33%" stopColor="#eab308" />
                <stop offset="66%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="text-3xl sm:text-4xl font-black leading-none" style={{ color: level.color }}>
              <AnimatedNumber value={score} decimals={0} />
            </span>
            <span className="text-[11px] text-gray-400 mt-1">/ 100</span>
            <span
              className="mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${level.color}18`,
                color: level.color,
                border: `1px solid ${level.color}30`,
              }}
            >
              {level.label}
            </span>
          </div>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors py-1"
      >
        Risk Breakdown {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Breakdown */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-2 space-y-2 overflow-hidden"
        >
          {breakdown.map(rf => (
            <div key={rf.key} className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400 w-36 truncate">{rf.label}</span>
              <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rf.percentage}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: level.color + '80' }}
                />
              </div>
              <span className="text-[11px] text-gray-500 w-8 text-right">{rf.percentage}%</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
