import { memo, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SENSORS } from '../../data/mockSensorData';
import { formatNumber, formatRelativeTime } from '../../utils/formatters';
import GlassPanel from '../common/GlassPanel';
import { Activity, Droplets, Cpu, Signal, BatteryMedium, Wifi } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function MiniSparkline({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={30}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#spark-${color.replace('#','')})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ReadingRow({ label, value, unit, color = '#e5e7eb', sparkData }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px] text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        {sparkData && <div className="w-16"><MiniSparkline data={sparkData} color={color} /></div>}
        <span className="text-xs font-mono text-white min-w-[48px] text-right">
          {value} <span className="text-gray-500">{unit}</span>
        </span>
      </div>
    </div>
  );
}

function SensorPanel() {
  const { selectedZone, zones, sensors } = useApp();
  const zone = zones ? zones[selectedZone] : null;

  const zoneSensors = useMemo(() => {
    return SENSORS.filter(s => s.zone === selectedZone).map(s => ({
      ...s,
      ...(sensors[s.id] || {}),
    }));
  }, [selectedZone, sensors]);

  const sparkData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      v: (zone?.deformation || 10) + Math.sin(i * 0.5) * 2 + Math.random() * 1,
    }));
  }, [zone?.deformation]);

  const moistureSparkData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      v: (zone?.moisture || 40) + Math.sin(i * 0.3) * 5 + Math.random() * 3,
    }));
  }, [zone?.moisture]);

  if (!zone) return <GlassPanel className="text-center text-gray-500 text-sm">Select a zone</GlassPanel>;

  return (
    <GlassPanel padding="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-title flex items-center gap-2">
          <Radio size={14} className="text-accent-cyan" />
          Live Sensors — {zone.name || selectedZone}
        </h3>
        <span className="text-[10px] text-gray-500 font-mono">{zoneSensors.length} DEVICES</span>
      </div>

      {/* MPU6050 */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Activity size={11} /> MPU6050 Accelerometer
        </div>
        <div className="space-y-0">
          <ReadingRow label="X Acceleration" value={formatNumber(zone.tilt * 0.05, 3)} unit="g" color="#06b6d4" />
          <ReadingRow label="Y Acceleration" value={formatNumber(zone.tilt * 0.03, 3)} unit="g" color="#3b82f6" />
          <ReadingRow label="Z Acceleration" value={formatNumber(9.81 - zone.tilt * 0.01, 2)} unit="g" color="#8b5cf6" />
          <ReadingRow label="Tilt" value={formatNumber(zone.tilt)} unit="°" color="#f97316" sparkData={sparkData} />
          <ReadingRow label="Vibration" value={formatNumber(zone.vibration || zone.tilt * 0.15, 2)} unit="mm/s" color="#ef4444" />
        </div>
      </div>

      {/* Moisture */}
      <div className="mb-3">
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Droplets size={11} /> Moisture Sensor
        </div>
        <ReadingRow label="Moisture" value={formatNumber(zone.moisture, 0)} unit="%" color="#22c55e" sparkData={moistureSparkData} />
        <ReadingRow label="Trend" value={zone.moisture > 60 ? 'Rising' : 'Stable'} unit="" color={zone.moisture > 60 ? '#f97316' : '#22c55e'} />
      </div>

      {/* ESP32 Status */}
      <div>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Cpu size={11} /> ESP32 Nodes
        </div>
        {zoneSensors.map(s => {
          const statusColor = s.status === 'ONLINE' ? '#22c55e' : s.status === 'WEAK' ? '#eab308' : '#ef4444';
          return (
            <div key={s.id} className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                <span className="text-xs font-mono text-gray-300">{s.id}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><BatteryMedium size={11} />{Math.round(s.battery)}%</span>
                <span className="flex items-center gap-1"><Signal size={11} />{Math.round(s.signal)}%</span>
                <span className="flex items-center gap-1" style={{ color: statusColor }}><Wifi size={11} />{s.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

const Radio = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
  </svg>
);

export default memo(SensorPanel);
