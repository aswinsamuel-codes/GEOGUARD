import { useMemo, memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import GlassPanel from '../common/GlassPanel';
import { useApp } from '../../context/AppContext';
import { generateHistoricalDeformation } from '../../data/mockPredictions';
import { formatNumber } from '../../utils/formatters';
import { GitCompare, AlertTriangle } from 'lucide-react';

function PIMChart() {
  const { selectedZone, zones } = useApp();
  const zone = zones && typeof zones !== 'function' ? zones[selectedZone] : null;

  const pimValue = zone?.pimPredicted ?? 16.2;
  const observed = zone?.deformation ?? 18.7;
  const aiValue = zone?.aiPredicted ?? 21.4;
  const deviation = pimValue > 0 ? ((observed - pimValue) / pimValue * 100) : 0;
  const isAnomaly = Math.abs(deviation) > 10;

  const chartData = useMemo(() => {
    const raw = generateHistoricalDeformation(48);
    return raw.filter((_, i) => i % 2 === 0).map(d => ({
      ...d,
      timeLabel: `${Math.round(d.hour / 2)}h`,
    }));
  }, []);

  return (
    <GlassPanel padding="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-title flex items-center gap-2">
          <GitCompare size={14} className="text-accent-blue" />
          PIM vs Observed vs AI
        </h3>
        {isAnomaly && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-risk-critical/15 text-risk-critical text-[10px] font-semibold">
            <AlertTriangle size={10} /> ANOMALY
          </span>
        )}
      </div>

      {/* Values */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/[0.03] rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 uppercase">PIM</div>
          <div className="text-lg font-bold text-accent-blue">{formatNumber(pimValue)} <span className="text-xs text-gray-500">mm</span></div>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 uppercase">Observed</div>
          <div className="text-lg font-bold text-accent-cyan">{formatNumber(observed)} <span className="text-xs text-gray-500">mm</span></div>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 uppercase">AI</div>
          <div className="text-lg font-bold text-risk-high">{formatNumber(aiValue)} <span className="text-xs text-gray-500">mm</span></div>
        </div>
      </div>

      {/* Deviation */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-lg mb-3 ${isAnomaly ? 'bg-risk-critical/10 border border-risk-critical/20' : 'bg-white/[0.03]'}`}>
        <span className="text-xs text-gray-400">Physics Deviation</span>
        <span className={`text-sm font-bold ${isAnomaly ? 'text-risk-critical' : 'text-risk-safe'}`}>
          {deviation > 0 ? '+' : ''}{formatNumber(deviation)}%
        </span>
      </div>

      {/* Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="timeLabel" tick={{ fontSize: 9, fill: '#6b7280' }} interval={5} />
            <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} width={30} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
            />
            <Line type="monotone" dataKey="pim" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="PIM" />
            <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} dot={false} name="Observed" />
            <Line type="monotone" dataKey="ai" stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="AI" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-2 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 rounded" /> PIM</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-cyan-500 rounded" /> Observed</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-500 rounded" /> AI</span>
      </div>
    </GlassPanel>
  );
}

export default memo(PIMChart);
