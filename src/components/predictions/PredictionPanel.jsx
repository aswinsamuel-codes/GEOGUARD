import { useMemo, memo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import GlassPanel from '../common/GlassPanel';
import { generateForecastChart, generatePredictionForecast } from '../../data/mockPredictions';
import { useApp } from '../../context/AppContext';
import { DATA_LABEL } from '../../utils/constants';
import { BrainCircuit } from 'lucide-react';
import AnimatedNumber from '../common/AnimatedNumber';

function PredictionPanel() {
  const { selectedZone, zones, deformation } = useApp();
  const zone = zones && typeof zones !== 'function' ? zones[selectedZone] : null;
  const currentDef = zone?.deformation ?? deformation ?? 2.5;

  const chartData = useMemo(() => generateForecastChart(currentDef), [currentDef]);
  const forecasts = useMemo(() => generatePredictionForecast(currentDef), [currentDef]);

  return (
    <GlassPanel padding="p-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="section-title flex items-center gap-2">
          <BrainCircuit size={14} className="text-accent-purple" />
          CNN-LSTM Prediction
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-accent-purple/15 text-purple-300 border border-purple-500/30 font-mono font-semibold">
            SIMULATED CNN-LSTM OUTPUT
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-gray-400 font-mono">
            {DATA_LABEL}
          </span>
        </div>
      </div>

      {/* Forecast cards */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {forecasts.map((f, i) => (
          <div key={f.label} className={`text-center p-2 rounded-lg ${i === 0 ? 'bg-accent-cyan/10 border border-accent-cyan/20' : 'bg-white/[0.03]'}`}>
            <div className="text-[10px] text-gray-500 uppercase">{f.label}</div>
            <div className="text-sm font-bold text-white mt-0.5">
              <AnimatedNumber value={f.value} decimals={1} />
            </div>
            <div className="text-[10px] text-gray-500">mm</div>
            {f.confidence < 100 && (
              <div className={`text-[9px] mt-0.5 ${f.confidence > 80 ? 'text-risk-safe' : f.confidence > 60 ? 'text-risk-advisory' : 'text-risk-high'}`}>
                {f.confidence}% conf
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} interval={11} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} width={35} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <ReferenceLine x="0h" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" label={{ value: 'NOW', position: 'top', fill: '#9ca3af', fontSize: 10 }} />
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} fill="url(#actualGrad)" dot={false} name="Actual" connectNulls={false} />
            <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} fill="url(#predGrad)" dot={false} name="Predicted" strokeDasharray="6 3" connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-2 text-[11px]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-accent-cyan rounded" /> Actual</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-purple-500 rounded" style={{ borderTop: '2px dashed #8b5cf6' }} /> AI Predicted</span>
        <span className="text-gray-500 ml-auto">Updated every 3s</span>
      </div>
    </GlassPanel>
  );
}

export default memo(PredictionPanel);

