import { useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Rectangle, Circle, CircleMarker, Popup } from 'react-leaflet';
import { useApp } from '../../context/AppContext';
import { MINE_BOUNDARY, PANELS } from '../../data/mockMineData';
import { SENSORS } from '../../data/mockSensorData';
import { MAP_CENTER, MAP_ZOOM, getRiskLevel, DATA_LABEL } from '../../utils/constants';
import { formatNumber } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';
import 'leaflet/dist/leaflet.css';

function ZoneOverlays() {
  const { getAllZones, selectZone } = useApp();
  const zones = getAllZones();

  return (
    <>
      {zones.map(zone => {
        const level = getRiskLevel(zone.riskScore ?? zone.risk ?? 0);
        const def = zone.deformation || 0;
        // Deformation field radius scales with deformation (in meters approx)
        const defRadius = Math.max(30, Math.min(180, def * 4));

        return (
          <g key={zone.id}>
            {/* Risk Zone Rectangle Boundary */}
            <Rectangle
              bounds={zone.bounds}
              pathOptions={{
                color: level.color,
                fillColor: level.color,
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '5 5',
              }}
              eventHandlers={{ click: () => selectZone(zone.id) }}
            >
              <Popup maxWidth={300}>
                <div className="space-y-2 min-w-[220px]">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">{zone.name}</span>
                    <StatusBadge score={zone.riskScore ?? zone.risk} size="xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div><span className="text-gray-400">Zone ID:</span> <span className="text-white">{zone.id}</span></div>
                    <div><span className="text-gray-400">Risk Score:</span> <span className="text-white">{zone.riskScore ?? zone.risk}/100</span></div>
                    <div><span className="text-gray-400">Deformation:</span> <span className="text-white">{formatNumber(zone.deformation)} mm</span></div>
                    <div><span className="text-gray-400">Velocity:</span> <span className="text-white">{formatNumber(zone.velocity)} mm/d</span></div>
                    <div><span className="text-gray-400">Moisture:</span> <span className="text-white">{formatNumber(zone.moisture, 0)}%</span></div>
                    <div><span className="text-gray-400">Tilt:</span> <span className="text-white">{formatNumber(zone.tilt)}°</span></div>
                  </div>
                  <div className="pt-1 border-t border-white/10">
                    <div className="text-[10px] text-gray-400">24h AI Forecast</div>
                    <div className="text-xs text-white">+{formatNumber(zone.aiPredicted || (zone.deformation * 1.15))} mm</div>
                  </div>
                </div>
              </Popup>
            </Rectangle>

            {/* Deformation Intensity Heat Field (Visually Distinct Radial Ring) */}
            <Circle
              center={zone.center}
              radius={defRadius}
              pathOptions={{
                color: level.color,
                fillColor: level.color,
                fillOpacity: Math.min(0.4, 0.1 + (def / 80)),
                weight: 1,
              }}
            />
          </g>
        );
      })}
    </>
  );
}

function SensorMarkers() {
  const { sensors } = useApp();

  return (
    <>
      {SENSORS.map(sensor => {
        const live = sensors[sensor.id] || sensor;
        const color = live.status === 'ONLINE' ? '#22c55e' : live.status === 'WEAK' ? '#eab308' : '#ef4444';
        return (
          <CircleMarker
            key={sensor.id}
            center={sensor.position}
            radius={5}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 1.5 }}
          >
            <Popup>
              <div className="text-xs space-y-1 min-w-[150px]">
                <div className="font-semibold text-white">{sensor.id}</div>
                <div className="text-gray-400">Zone: {sensor.zone}</div>
                <div style={{ color }}>● {live.status}</div>
                <div className="text-gray-400">Battery: {Math.round(live.battery)}%</div>
                <div className="text-gray-400">Signal: {Math.round(live.signal)}%</div>
                <div className="text-gray-400">Tilt: {live.tilt}°</div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

export default function MineMap({ height = '400px', className = '' }) {
  return (
    <div className={`glass-panel overflow-hidden relative ${className}`} style={{ height }}>
      {/* Synthetic data badge */}
      <div className="absolute top-3 right-3 z-[1000] px-2.5 py-1 rounded-md bg-mine-950/80 backdrop-blur-md border border-white/10 text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
        {DATA_LABEL}
      </div>

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Mine boundary */}
        <Polygon
          positions={MINE_BOUNDARY}
          pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.03, weight: 2, dashArray: '8 4' }}
        />

        {/* Panels */}
        {PANELS.map(panel => (
          <Rectangle
            key={panel.id}
            bounds={panel.bounds}
            pathOptions={{
              color: panel.status === 'active' ? '#3b82f680' : '#ffffff20',
              fillColor: panel.status === 'active' ? '#3b82f6' : '#ffffff',
              fillOpacity: 0.04,
              weight: 1,
            }}
          >
            <Popup>
              <div className="text-xs text-white">
                <div className="font-semibold">{panel.name}</div>
                <div className="text-gray-400">Depth: {panel.depth}m | Status: {panel.status}</div>
              </div>
            </Popup>
          </Rectangle>
        ))}

        <ZoneOverlays />
        <SensorMarkers />
      </MapContainer>
    </div>
  );
}

