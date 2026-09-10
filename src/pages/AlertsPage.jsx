import { useState, useMemo, memo } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCard } from '../components/alerts/AlertPanel';
import GlassPanel from '../components/common/GlassPanel';
import { AlertTriangle, Filter } from 'lucide-react';

function AlertsPage() {
  const { alerts } = useApp();
  const [viewTab, setViewTab] = useState('ACTIVE');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filtered = useMemo(() => {
    let list = alerts;
    if (viewTab === 'ACTIVE') {
      list = alerts.filter(a => a.time > Date.now() - 3600000);
    } else if (viewTab === 'HISTORICAL') {
      list = alerts.filter(a => a.time <= Date.now() - 3600000);
    }
    if (severityFilter !== 'ALL') {
      list = list.filter(a => a.severity === severityFilter);
    }
    return list;
  }, [alerts, viewTab, severityFilter]);

  const counts = useMemo(() => ({
    ALL: alerts.length,
    CRITICAL: alerts.filter(a => a.severity === 'CRITICAL').length,
    HIGH: alerts.filter(a => a.severity === 'HIGH').length,
    ADVISORY: alerts.filter(a => a.severity === 'ADVISORY').length,
  }), [alerts]);

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-white">Alert History & Logs</h1>
          <p className="text-xs text-gray-500 mt-0.5">Complete early warning alert log with explainable AI analysis</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-lg border border-white/[0.06]">
          <button
            onClick={() => setViewTab('ACTIVE')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewTab === 'ACTIVE' ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' : 'text-gray-400 hover:text-white'}`}
          >
            Active Alerts ({alerts.filter(a => a.time > Date.now() - 3600000).length})
          </button>
          <button
            onClick={() => setViewTab('ALL')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewTab === 'ALL' ? 'bg-white/[0.1] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            All Logs ({alerts.length})
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Logs', count: counts.ALL, color: '#9ca3af' },
          { label: 'Critical', count: counts.CRITICAL, color: '#ef4444' },
          { label: 'High', count: counts.HIGH, color: '#f97316' },
          { label: 'Advisory', count: counts.ADVISORY, color: '#eab308' },
        ].map(item => (
          <GlassPanel key={item.label} padding="p-3" className="text-center">
            <div className="text-2xl font-bold" style={{ color: item.color }}>{item.count}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</div>
          </GlassPanel>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-gray-500" />
        {['ALL', 'CRITICAL', 'HIGH', 'ADVISORY'].map(f => (
          <button
            key={f}
            onClick={() => setSeverityFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              severityFilter === f ? 'bg-white/[0.1] text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-2">
        {filtered.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
        {filtered.length === 0 && (
          <GlassPanel padding="p-8" className="text-center">
            <AlertTriangle size={24} className="text-risk-safe mx-auto mb-2 opacity-60" />
            <div className="text-sm font-semibold text-white">System Operating Normally</div>
            <div className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              No elevated risk alerts active. All mine zones are currently within SAFE operational thresholds. Click "Run Demo" in top bar to simulate risk escalation.
            </div>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}

export default memo(AlertsPage);
