import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import GlassPanel from '../common/GlassPanel';
import StatusBadge from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { getRiskLevel } from '../../utils/constants';
import { Sliders, RotateCcw, TrendingUp, AlertTriangle } from 'lucide-react';
import AnimatedNumber from '../common/AnimatedNumber';

const SCENARIO_PARAMS = [
  { key: 'rainfall', label: 'Rainfall Intensity', unit: '%', min: -50, max: 100, step: 5, default: 0, factor: 0.35 },
  { key: 'moisture', label: 'Soil Moisture Level', unit: '%', min: -30, max: 50, step: 5, default: 0, factor: 0.45 },
  { key: 'velocity', label: 'Deformation Velocity', unit: '%', min: -20, max: 80, step: 5, default: 0, factor: 0.65 },
  { key: 'movement', label: 'Sensor Movement (Tilt)', unit: '%', min: -20, max: 60, step: 5, default: 0, factor: 0.40 },
  { key: 'mining', label: 'Extraction Activity Rate', unit: '%', min: -50, max: 50, step: 5, default: 0, factor: 0.30 },
];

function WhatIfSimulator() {
  const { selectedZone, zones, riskScore } = useApp();
  const zone = zones && typeof zones !== 'function' ? zones[selectedZone] : null;
  const baseRisk = zone?.riskScore ?? riskScore ?? 15;

  const [params, setParams] = useState(
    Object.fromEntries(SCENARIO_PARAMS.map(p => [p.key, p.default]))
  );

  const simResult = useMemo(() => {
    let delta = 0;
    const factorImpacts = [];

    SCENARIO_PARAMS.forEach(p => {
      const impact = (params[p.key] / 100) * p.factor * (baseRisk > 0 ? baseRisk : 20);
      delta += impact;
      if (params[p.key] !== 0) {
        factorImpacts.push({
          label: p.label,
          paramValue: params[p.key],
          unit: p.unit,
          impact: Math.round(impact),
        });
      }
    });

    const newScore = Math.round(Math.max(0, Math.min(100, baseRisk + delta)));
    const deltaScore = newScore - baseRisk;
    const oldLevel = getRiskLevel(baseRisk);
    const newLevel = getRiskLevel(newScore);

    // Sort major factors responsible for change
    factorImpacts.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    return {
      oldScore: baseRisk,
      newScore,
      deltaScore,
      oldLevel,
      newLevel,
      changed: oldLevel.key !== newLevel.key,
      factorImpacts,
    };
  }, [params, baseRisk]);

  const handleReset = () => {
    setParams(Object.fromEntries(SCENARIO_PARAMS.map(p => [p.key, p.default])));
  };

  const hasChanges = Object.values(params).some(v => v !== 0);

  return (
    <GlassPanel padding="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title flex items-center gap-2">
          <Sliders size={14} className="text-accent-purple" />
          What-If Risk Scenario Simulator
        </h3>
        {hasChanges && (
          <button onClick={handleReset} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-5">
        {SCENARIO_PARAMS.map(p => (
          <div key={p.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-400">{p.label}</span>
              <span className={`text-[11px] font-mono ${params[p.key] > 0 ? 'text-risk-high' : params[p.key] < 0 ? 'text-risk-safe' : 'text-gray-500'}`}>
                {params[p.key] > 0 ? '+' : ''}{params[p.key]}{p.unit}
              </span>
            </div>
            <input
              type="range"
              min={p.min}
              max={p.max}
              step={p.step}
              value={params[p.key]}
              onChange={(e) => setParams(prev => ({ ...prev, [p.key]: Number(e.target.value) }))}
              className="w-full h-1 bg-white/[0.08] rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-cyan
                [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            />
          </div>
        ))}
      </div>

      {/* Prominent Scenario Result Header */}
      <motion.div
        className={`p-4 rounded-xl border ${
          simResult.changed
            ? 'bg-gradient-to-r from-risk-critical/15 via-mine-900 to-mine-950 border-risk-critical/40'
            : 'bg-white/[0.03] border-white/[0.08]'
        }`}
        animate={{ scale: simResult.changed ? [1, 1.01, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid grid-cols-4 gap-2 text-center divide-x divide-white/10">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">CURRENT RISK</div>
            <div className="text-2xl font-bold mt-1" style={{ color: simResult.oldLevel.color }}>
              <AnimatedNumber value={simResult.oldScore} decimals={0} />
            </div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase">{simResult.oldLevel.label}</div>
          </div>

          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">SCENARIO RISK</div>
            <div className="text-2xl font-bold mt-1" style={{ color: simResult.newLevel.color }}>
              <AnimatedNumber value={simResult.newScore} decimals={0} />
            </div>
            <div className="text-[10px] font-semibold uppercase" style={{ color: simResult.newLevel.color }}>
              {simResult.newLevel.label}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">RISK DELTA</div>
            <div className={`text-2xl font-bold mt-1 ${simResult.deltaScore > 0 ? 'text-risk-critical' : simResult.deltaScore < 0 ? 'text-risk-safe' : 'text-gray-400'}`}>
              {simResult.deltaScore > 0 ? `+${simResult.deltaScore}` : simResult.deltaScore}
            </div>
            <div className="text-[10px] text-gray-500">POINTS</div>
          </div>

          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">LEVEL TRANSITION</div>
            <div className="text-xs font-bold text-white mt-2 flex items-center justify-center gap-1">
              <span>{simResult.oldLevel.label}</span>
              <TrendingUp size={12} className={simResult.deltaScore >= 0 ? 'text-risk-critical' : 'text-risk-safe'} />
              <span style={{ color: simResult.newLevel.color }}>{simResult.newLevel.label}</span>
            </div>
          </div>
        </div>

        {/* Major Contributing Factors */}
        {simResult.factorImpacts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <AlertTriangle size={11} className="text-accent-cyan" /> Major Drivers of Scenario Change
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {simResult.factorImpacts.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded bg-white/[0.03]">
                  <span className="text-gray-300">{f.label} ({f.paramValue > 0 ? '+' : ''}{f.paramValue}{f.unit})</span>
                  <span className={`font-mono font-semibold ${f.impact > 0 ? 'text-risk-critical' : 'text-risk-safe'}`}>
                    {f.impact > 0 ? `+${f.impact}` : f.impact} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </GlassPanel>
  );
}

export default memo(WhatIfSimulator);

