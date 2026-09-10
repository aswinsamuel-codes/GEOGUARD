import { useMemo, memo } from 'react';
import { useApp } from '../context/AppContext';
import GlassPanel from '../components/common/GlassPanel';
import { generateHistoricalDeformation } from '../data/mockPredictions';
import { formatNumber } from '../utils/formatters';
import { DATA_LABEL } from '../utils/constants';
import { BarChart3, TrendingUp, AlertTriangle, Droplets } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function AnalyticsPage() {
  const {
    getAllZones,
    activeAlerts,
    riskScore,
    riskLevel,
    observedDeformation,
    pimPrediction,
    aiPrediction,
    moisture,
  } = useApp();

  const zones = getAllZones();

  const currentAvgDeformation = useMemo(() => {
    if (zones.length === 0) return observedDeformation;
    return zones.reduce((s, z) => s + (z.deformation ?? 0), 0) / zones.length;
  }, [zones, observedDeformation]);

  const currentAvgMoisture = useMemo(() => {
    if (zones.length === 0) return moisture;
    return zones.reduce((s, z) => s + (z.moisture ?? 0), 0) / zones.length;
  }, [zones, moisture]);

  const maxZoneRisk = useMemo(() => {
    if (zones.length === 0) return riskScore;
    return Math.max(...zones.map(z => z.riskScore ?? z.risk ?? 0));
  }, [zones, riskScore]);

  const deformationHistory = useMemo(() => {
    const raw = generateHistoricalDeformation(168);
    const filtered = raw.filter((_, i) => i % 6 === 0).map((d, i) => ({
      ...d,
      day: `Day ${Math.floor(i / 4) + 1}`,
    }));
    // Override current/last point with exact live application state
    if (filtered.length > 0) {
      filtered[filtered.length - 1] = {
        ...filtered[filtered.length - 1],
        actual: Number(observedDeformation.toFixed(1)),
        pim: Number(pimPrediction.toFixed(1)),
        ai: Number(aiPrediction.toFixed(1)),
      };
    }
    return filtered;
  }, [observedDeformation, pimPrediction, aiPrediction]);

  const zoneComparison = useMemo(() =>
    zones.map(z => ({
      name: z.id,
      risk: z.riskScore ?? z.risk ?? 0,
      deformation: Number((z.deformation ?? 0).toFixed(1)),
      moisture: Math.round(z.moisture ?? 0),
    })),
  [zones]);

  const alertsByType = useMemo(() => [
    { name: 'CRITICAL', value: activeAlerts.filter(a => a.severity === 'CRITICAL').length, color: '#ef4444' },
    { name: 'HIGH', value: activeAlerts.filter(a => a.severity === 'HIGH').length, color: '#f97316' },
    { name: 'ADVISORY', value: activeAlerts.filter(a => a.severity === 'ADVISORY').length, color: '#eab308' },
  ], [activeAlerts]);

  const riskHistory = useMemo(() => {
    const hist = Array.from({ length: 30 }, (_, i) => ({
      day: `${i + 1}`,
      risk: Math.round(15 + Math.sin(i * 0.3) * 8 + Math.random() * 4),
    }));
    // Override the latest/current point with live risk score
    if (hist.length > 0) {
      hist[hist.length - 1].risk = riskScore;
    }
    return hist;
  }, [riskScore]);

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">Historical trends, zone comparison, and risk analytics</p>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-mine-950/80 border border-white/10 text-[10px] text-gray-400 font-mono">
          {DATA_LABEL}
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <GlassPanel padding="p-3">
          <div className="flex items-center gap-2 mb-1"><TrendingUp size={14} className="text-accent-cyan" /><span className="text-[10px] text-gray-500 uppercase">Avg Deformation</span></div>
          <div className="text-xl font-bold text-white">{formatNumber(currentAvgDeformation)} mm</div>
        </GlassPanel>
        <GlassPanel padding="p-3">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle size={14} className="text-risk-high" /><span className="text-[10px] text-gray-500 uppercase">Max Mine Risk</span></div>
          <div className="text-xl font-bold" style={{ color: riskLevel.color }}>
            {maxZoneRisk} / 100
          </div>
        </GlassPanel>
        <GlassPanel padding="p-3">
          <div className="flex items-center gap-2 mb-1"><Droplets size={14} className="text-risk-safe" /><span className="text-[10px] text-gray-500 uppercase">Avg Moisture</span></div>
          <div className="text-xl font-bold text-white">{formatNumber(currentAvgMoisture, 0)}%</div>
        </GlassPanel>
        <GlassPanel padding="p-3">
          <div className="flex items-center gap-2 mb-1"><BarChart3 size={14} className="text-accent-purple" /><span className="text-[10px] text-gray-500 uppercase">Total Alerts</span></div>
          <div className="text-xl font-bold text-white">{activeAlerts.length}</div>
        </GlassPanel>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Deformation Trend */}
        <GlassPanel padding="p-4">
          <h3 className="section-title mb-3">Deformation History (7 Days)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deformationHistory} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} width={35} />
                <Tooltip contentStyle={{ backgroundColor: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2} dot={false} name="Observed" />
                <Line type="monotone" dataKey="pim" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="PIM" />
                <Line type="monotone" dataKey="ai" stroke="#f97316" strokeWidth={1.5} dot={false} name="AI" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        {/* Zone Comparison */}
        <GlassPanel padding="p-4">
          <h3 className="section-title mb-3">Zone Risk Comparison</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneComparison} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} width={30} />
                <Tooltip contentStyle={{ backgroundColor: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="risk" name="Risk Score" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.7} />
                <Bar dataKey="deformation" name="Deformation (mm)" fill="#06b6d4" radius={[4, 4, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        {/* Risk Score History */}
        <GlassPanel padding="p-4">
          <h3 className="section-title mb-3">Risk Score Trend (30 Days)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskHistory} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6b7280' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} width={30} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="risk" stroke="#eab308" strokeWidth={2} dot={false} name="Risk Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        {/* Alert Distribution */}
        <GlassPanel padding="p-4">
          <h3 className="section-title mb-3">Alert Distribution</h3>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={alertsByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {alertsByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

export default memo(AnalyticsPage);

