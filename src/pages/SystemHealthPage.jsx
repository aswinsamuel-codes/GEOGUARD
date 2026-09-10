import { useMemo, memo } from 'react';
import { useApp } from '../context/AppContext';
import { SENSORS } from '../data/mockSensorData';
import { formatRelativeTime, formatNumber } from '../utils/formatters';
import GlassPanel from '../components/common/GlassPanel';
import { HeartPulse, BatteryMedium, Signal, Wifi, WifiOff, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

function SystemHealthPage() {
  const { sensors } = useApp();

  const sensorList = useMemo(() =>
    SENSORS.map(s => ({
      ...s,
      ...(sensors[s.id] || {}),
    })),
  [sensors]);

  const stats = useMemo(() => ({
    online: sensorList.filter(s => s.status === 'ONLINE').length,
    weak: sensorList.filter(s => s.status === 'WEAK').length,
    offline: sensorList.filter(s => s.status === 'OFFLINE').length,
    avgBattery: Math.round(sensorList.reduce((s, a) => s + a.battery, 0) / sensorList.length),
    avgSignal: Math.round(sensorList.filter(s => s.status !== 'OFFLINE').reduce((s, a) => s + a.signal, 0) / sensorList.filter(s => s.status !== 'OFFLINE').length),
  }), [sensorList]);

  const faults = useMemo(() => {
    const issues = [];
    sensorList.forEach(s => {
      if (s.status === 'OFFLINE') issues.push({ sensor: s.id, type: 'OFFLINE', desc: 'Device not responding', severity: 'critical' });
      else if (s.battery < 20) issues.push({ sensor: s.id, type: 'LOW BATTERY', desc: `Battery at ${Math.round(s.battery)}%`, severity: 'warning' });
      else if (s.signal < 40) issues.push({ sensor: s.id, type: 'WEAK SIGNAL', desc: `Signal strength ${Math.round(s.signal)}%`, severity: 'warning' });
      if (s.packetLoss > 5) issues.push({ sensor: s.id, type: 'PACKET LOSS', desc: `${s.packetLoss}% packet loss`, severity: 'warning' });
    });
    return issues;
  }, [sensorList]);

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <div>
        <h1 className="text-xl font-bold text-white">System Health</h1>
        <p className="text-xs text-gray-500 mt-0.5">Sensor network status, diagnostics, and fault detection</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <GlassPanel padding="p-3" className="text-center">
          <CheckCircle2 size={18} className="text-risk-safe mx-auto mb-1" />
          <div className="text-xl font-bold text-risk-safe">{stats.online}</div>
          <div className="text-[10px] text-gray-500 uppercase">Online</div>
        </GlassPanel>
        <GlassPanel padding="p-3" className="text-center">
          <Signal size={18} className="text-risk-advisory mx-auto mb-1" />
          <div className="text-xl font-bold text-risk-advisory">{stats.weak}</div>
          <div className="text-[10px] text-gray-500 uppercase">Weak</div>
        </GlassPanel>
        <GlassPanel padding="p-3" className="text-center">
          <WifiOff size={18} className="text-risk-critical mx-auto mb-1" />
          <div className="text-xl font-bold text-risk-critical">{stats.offline}</div>
          <div className="text-[10px] text-gray-500 uppercase">Offline</div>
        </GlassPanel>
        <GlassPanel padding="p-3" className="text-center">
          <BatteryMedium size={18} className="text-accent-cyan mx-auto mb-1" />
          <div className="text-xl font-bold text-white">{stats.avgBattery}%</div>
          <div className="text-[10px] text-gray-500 uppercase">Avg Battery</div>
        </GlassPanel>
        <GlassPanel padding="p-3" className="text-center">
          <Signal size={18} className="text-accent-blue mx-auto mb-1" />
          <div className="text-xl font-bold text-white">{stats.avgSignal}%</div>
          <div className="text-[10px] text-gray-500 uppercase">Avg Signal</div>
        </GlassPanel>
      </div>

      {/* Faults */}
      {faults.length > 0 && (
        <GlassPanel padding="p-4">
          <h3 className="section-title flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-risk-high" />
            Detected Issues ({faults.length})
          </h3>
          <div className="space-y-2">
            {faults.map((f, i) => (
              <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${f.severity === 'critical' ? 'bg-risk-critical/10 border border-risk-critical/20' : 'bg-risk-advisory/10 border border-risk-advisory/20'}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={12} className={f.severity === 'critical' ? 'text-risk-critical' : 'text-risk-advisory'} />
                  <span className="text-xs font-mono text-white">{f.sensor}</span>
                  <span className="text-[10px] text-gray-400">— {f.type}</span>
                </div>
                <span className="text-[11px] text-gray-400">{f.desc}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Sensor Grid */}
      <GlassPanel padding="p-4">
        <h3 className="section-title mb-3">All Sensors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 text-left border-b border-white/[0.06]">
                <th className="pb-2 font-medium">Sensor</th>
                <th className="pb-2 font-medium">Zone</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Battery</th>
                <th className="pb-2 font-medium">Signal</th>
                <th className="pb-2 font-medium">Packet Loss</th>
                <th className="pb-2 font-medium">Last Comm</th>
              </tr>
            </thead>
            <tbody>
              {sensorList.map(s => {
                const statusColor = s.status === 'ONLINE' ? '#22c55e' : s.status === 'WEAK' ? '#eab308' : '#ef4444';
                return (
                  <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="py-2 font-mono text-white">{s.id}</td>
                    <td className="py-2 text-gray-400">{s.zone}</td>
                    <td className="py-2">
                      <span className="flex items-center gap-1.5" style={{ color: statusColor }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.battery}%`, backgroundColor: s.battery > 50 ? '#22c55e' : s.battery > 20 ? '#eab308' : '#ef4444' }} />
                        </div>
                        <span className="text-gray-400">{Math.round(s.battery)}%</span>
                      </div>
                    </td>
                    <td className="py-2 text-gray-400">{Math.round(s.signal)}%</td>
                    <td className="py-2 text-gray-400">{s.packetLoss}%</td>
                    <td className="py-2 text-gray-500">{formatRelativeTime(s.lastComm)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}

export default memo(SystemHealthPage);
