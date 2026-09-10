import MineMap from '../components/map/MineMap';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/common/StatusBadge';
import { formatNumber } from '../utils/formatters';
import GlassPanel from '../components/common/GlassPanel';
import { getRiskLevel } from '../utils/constants';

export default function MineMapPage() {
  const { getAllZones, selectedZone, selectZone } = useApp();
  const zones = getAllZones();
  const selected = zones.find(z => z.id === selectedZone);

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Mine Risk Map</h1>
          <p className="text-xs text-gray-500 mt-0.5">Interactive mine boundary, risk zones, and sensor network</p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          {['SAFE', 'ADVISORY', 'HIGH', 'CRITICAL'].map(level => {
            const l = getRiskLevel(level === 'SAFE' ? 10 : level === 'ADVISORY' ? 40 : level === 'HIGH' ? 60 : 90);
            return (
              <span key={level} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.color + '40', border: `1px solid ${l.color}` }} />
                {level}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9">
          <MineMap height="calc(100vh - 180px)" />
        </div>
        <div className="lg:col-span-3 space-y-3">
          <GlassPanel padding="p-3">
            <h3 className="section-title mb-2">Zones</h3>
            <div className="space-y-1.5">
              {zones.map(z => (
                <div
                  key={z.id}
                  onClick={() => selectZone(z.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                    z.id === selectedZone ? 'bg-white/[0.08] border border-white/[0.1]' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-gray-300">{z.id}</span>
                  <StatusBadge score={z.riskScore ?? z.risk} size="xs" />
                </div>
              ))}
            </div>
          </GlassPanel>

          {selected && (
            <GlassPanel padding="p-3">
              <h3 className="section-title mb-2">{selected.name}</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Risk Score</span><span className="text-white font-semibold">{selected.riskScore ?? selected.risk}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Deformation</span><span className="text-white">{formatNumber(selected.deformation)} mm</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Velocity</span><span className="text-white">{formatNumber(selected.velocity)} mm/d</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Moisture</span><span className="text-white">{formatNumber(selected.moisture, 0)}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tilt</span><span className="text-white">{formatNumber(selected.tilt)}°</span></div>
              </div>
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  );
}
