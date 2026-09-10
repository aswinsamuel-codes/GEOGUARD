import { useState, useMemo, memo } from 'react';
import { useApp } from '../context/AppContext';
import { SENSORS } from '../data/mockSensorData';
import { formatRelativeTime } from '../utils/formatters';
import { DATA_LABEL } from '../utils/constants';
import GlassPanel from '../components/common/GlassPanel';
import { Radio, BatteryMedium, Signal, Wifi, Search, Activity, Gauge, Droplets, Compass } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function SensorDetailChart({ sensorId }) {
  const data = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      t: `${i}m`,
      tilt: Number((0.2 + Math.sin(i * 0.3) * 0.4 + Math.random() * 0.1).toFixed(2)),
      vibration: Number((0.05 + Math.sin(i * 0.5) * 0.08 + Math.random() * 0.03).toFixed(2)),
    })),
  [sensorId]);

  return (
    <div className="h-32 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="t" tick={{ fontSize: 9, fill: '#6b7280' }} interval={9} />
          <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} width={25} />
          <Tooltip contentStyle={{ backgroundColor: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
          <defs>
            <linearGradient id="tiltGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} /><stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="tilt" stroke="#f97316" strokeWidth={1.5} fill="url(#tiltGrad)" dot={false} name="Tilt (°)" />
          <Area type="monotone" dataKey="vibration" stroke="#06b6d4" strokeWidth={1} fill="transparent" dot={false} name="Vibration (g)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function SensorCard({ sensor, live, expanded, onToggle }) {
  const isOffline = (live?.status || sensor.status) === 'OFFLINE';
  const isWeak = (live?.status || sensor.status) === 'WEAK';
  const statusColor = isOffline ? '#ef4444' : isWeak ? '#eab308' : '#22c55e';

  const ax = isOffline ? '0.000' : (live?.ax ?? 0.012);
  const ay = isOffline ? '0.000' : (live?.ay ?? -0.008);
  const az = isOffline ? '0.000' : (live?.az ?? 9.812);
  const tilt = live?.tilt ?? sensor.tilt ?? 0.1;
  const vibration = isOffline ? '0.00' : (live?.vibration ?? 0.05);
  const moisture = live?.moisture ?? sensor.moisture ?? 25;
  const battery = Math.round(live?.battery ?? sensor.battery ?? 90);
  const signal = isOffline ? 0 : Math.round(live?.signal ?? sensor.signal ?? 85);
  const packetLoss = isOffline ? 100 : (live?.packetLoss ?? sensor.packetLoss ?? 0.1);
  const lastComm = live?.lastComm ?? sensor.lastComm ?? Date.now();

  return (
    <GlassPanel padding="p-3" className="cursor-pointer hover:bg-mine-800/60 transition-colors" onClick={onToggle}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
          <span className="text-sm font-mono font-semibold text-white">{sensor.id}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ color: statusColor, backgroundColor: statusColor + '15', border: `1px solid ${statusColor}30` }}>
          {live?.status || sensor.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
        <div className="flex items-center gap-1 text-gray-400"><Radio size={10} /> Zone: <span className="text-gray-300">{sensor.zone}</span></div>
        <div className="flex items-center gap-1 text-gray-400"><BatteryMedium size={10} /> Battery: <span className="text-gray-300">{battery}%</span></div>
        <div className="flex items-center gap-1 text-gray-400"><Signal size={10} /> Signal: <span className={isOffline ? 'text-risk-critical' : 'text-gray-300'}>{signal}%</span></div>
        <div className="flex items-center gap-1 text-gray-400"><Wifi size={10} /> Last: <span className={isOffline ? 'text-risk-critical' : 'text-gray-300'}>{isOffline ? 'Stale' : formatRelativeTime(lastComm)}</span></div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
            <span>Full Telemetry</span>
            {isOffline && <span className="text-risk-critical text-[9px] font-bold">⚠️ OFFLINE (NO SIGNAL)</span>}
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[11px] text-center">
            <div className="bg-white/[0.03] p-1.5 rounded">
              <span className="text-[9px] text-gray-500 block">X ACCEL</span>
              <span className="font-mono text-white">{ax} g</span>
            </div>
            <div className="bg-white/[0.03] p-1.5 rounded">
              <span className="text-[9px] text-gray-500 block">Y ACCEL</span>
              <span className="font-mono text-white">{ay} g</span>
            </div>
            <div className="bg-white/[0.03] p-1.5 rounded">
              <span className="text-[9px] text-gray-500 block">Z ACCEL</span>
              <span className="font-mono text-white">{az} g</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.03]">
              <span className="text-gray-400 flex items-center gap-1"><Compass size={11} /> Tilt</span>
              <span className="font-mono text-accent-cyan">{tilt}°</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.03]">
              <span className="text-gray-400 flex items-center gap-1"><Activity size={11} /> Vibration</span>
              <span className="font-mono text-accent-purple">{vibration} g</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.03]">
              <span className="text-gray-400 flex items-center gap-1"><Droplets size={11} /> Moisture</span>
              <span className="font-mono text-risk-safe">{moisture}%</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.03]">
              <span className="text-gray-400 flex items-center gap-1"><Gauge size={11} /> Packet Loss</span>
              <span className={`font-mono ${packetLoss > 10 ? 'text-risk-critical font-bold' : 'text-gray-300'}`}>{packetLoss}%</span>
            </div>
          </div>

          {!isOffline && <SensorDetailChart sensorId={sensor.id} />}
        </div>
      )}
    </GlassPanel>
  );
}

function LiveSensorsPage() {
  const { sensors } = useApp();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState('ESP32-04');

  const sensorList = useMemo(() => SENSORS, []);

  const filtered = useMemo(() => {
    return sensorList.filter(s => {
      const live = sensors[s.id] || s;
      if (filter !== 'ALL' && live.status !== filter) return false;
      if (search && !s.id.toLowerCase().includes(search.toLowerCase()) && !s.zone.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filter, search, sensors, sensorList]);

  const counts = useMemo(() => ({
    ALL: sensorList.length,
    ONLINE: sensorList.filter(s => (sensors[s.id]?.status || s.status) === 'ONLINE').length,
    WEAK: sensorList.filter(s => (sensors[s.id]?.status || s.status) === 'WEAK').length,
    OFFLINE: sensorList.filter(s => (sensors[s.id]?.status || s.status) === 'OFFLINE').length,
  }), [sensors, sensorList]);

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-white">Live Sensors</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time ESP32 + MPU6050 sensor node diagnostics</p>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-mine-950/80 border border-white/10 text-[10px] text-gray-400 font-mono">
          {DATA_LABEL}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {['ALL', 'ONLINE', 'WEAK', 'OFFLINE'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-white/[0.1] text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {f} ({counts[f]})
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search sensors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent-cyan/30 w-40"
          />
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map(sensor => (
          <SensorCard
            key={sensor.id}
            sensor={sensor}
            live={sensors[sensor.id]}
            expanded={expandedId === sensor.id}
            onToggle={() => setExpandedId(expandedId === sensor.id ? null : sensor.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(LiveSensorsPage);

