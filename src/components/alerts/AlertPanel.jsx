import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getRiskLevel } from '../../utils/constants';
import { formatRelativeTime, formatNumber } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import GlassPanel from '../common/GlassPanel';
import { AlertTriangle, Clock, MapPin, ChevronDown, ChevronUp, CheckCircle2, XCircle, Shield } from 'lucide-react';

function ExplainableAI({ contributions = [], confidence = 88 }) {
  const displayContributions = contributions.length > 0 ? contributions : [
    { label: 'Ground Deformation', contribution: 12, rawValue: '18.5 mm' },
    { label: 'Deformation Velocity', contribution: 8, rawValue: '2.1 mm/d' },
    { label: 'Moisture', contribution: 6, rawValue: '65%' },
    { label: 'Sensor Movement (Tilt)', contribution: 4, rawValue: '1.2°' },
    { label: 'PIM Deviation', contribution: 4, rawValue: '14.5%' },
    { label: 'AI Forecast', contribution: 5, rawValue: '22.0 mm' },
  ];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="pt-3 mt-3 border-t border-white/[0.06]">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>WHY THIS ALERT? (Risk Factor Breakdown)</span>
          <span className="text-accent-cyan font-mono text-[9px]">EXPLAINABLE AI</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {displayContributions.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-1.5 rounded bg-white/[0.03] text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                {c.contribution > 8 ? (
                  <CheckCircle2 size={12} className="text-risk-critical flex-shrink-0" />
                ) : (
                  <Shield size={12} className="text-gray-500 flex-shrink-0" />
                )}
                <span className="text-gray-300 truncate text-[11px]">{c.label}</span>
              </div>
              <span className="font-mono text-[11px] text-gray-200 font-semibold ml-2">
                +{c.contribution} pts {c.rawValue ? `(${c.rawValue})` : ''}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-[10px] text-gray-500">Model Confidence:</span>
          <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden max-w-[140px]">
            <div className="h-full bg-accent-cyan rounded-full" style={{ width: `${confidence}%` }} />
          </div>
          <span className="text-[10px] text-accent-cyan font-semibold">{confidence}%</span>
        </div>
      </div>
    </motion.div>
  );
}

function AlertCard({ alert }) {
  const [expanded, setExpanded] = useState(false);
  const level = getRiskLevel(alert.riskScore);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel-dense p-3 hover:bg-mine-800/80 transition-colors cursor-pointer"
      style={{ borderLeft: `3px solid ${level.color}` }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" style={{ color: level.color }} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge score={alert.riskScore} size="xs" />
              <span className="text-xs font-semibold text-white">{alert.zoneName}</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{alert.reason}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-gray-500 flex items-center gap-1">
            <Clock size={10} />{formatRelativeTime(alert.time)}
          </span>
          {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.03]">
                <Shield size={13} className="text-accent-cyan mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Recommended Action</div>
                  <div className="text-xs text-gray-200 mt-0.5">{alert.action}</div>
                </div>
              </div>
              <div className="text-[11px] text-gray-400">
                <span className="text-gray-500">Prediction:</span> {alert.prediction}
              </div>
            </div>
            <ExplainableAI contributions={alert.contributions} confidence={alert.confidence} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AlertPanel({ maxItems = 5 }) {
  const { alerts } = useApp();
  const displayed = alerts.slice(0, maxItems);

  return (
    <GlassPanel padding="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-title flex items-center gap-2">
          <AlertTriangle size={14} className="text-risk-high" />
          Early Warning
        </h3>
        <span className="text-[10px] text-gray-500">{alerts.length} total</span>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {displayed.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </GlassPanel>
  );
}

export { AlertCard, ExplainableAI };
export default memo(AlertPanel);
