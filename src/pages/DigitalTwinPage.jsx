import { Suspense, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import { useApp } from '../context/AppContext';
import { getRiskLevel, DATA_LABEL } from '../utils/constants';
import GlassPanel from '../components/common/GlassPanel';
import SkeletonLoader from '../components/common/SkeletonLoader';
import * as THREE from 'three';

function TerrainSurface({ zones, isPrediction }) {
  const meshRef = useRef();
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 16, 80, 64);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      let displacement = 0;
      zones.forEach(zone => {
        const zx = (zone.center[1] - 86.415) * 1000;
        const zz = (zone.center[0] - 23.745) * 1000;
        const dist = Math.sqrt((x - zx) ** 2 + (z - zz) ** 2);
        const baseDef = zone.deformation || 2.5;
        const targetDef = isPrediction ? (zone.aiPredicted || baseDef * 1.3) : baseDef;
        const radius = isPrediction ? 4.5 : 3.2;
        if (dist < radius) {
          const factor = Math.min(1.5, targetDef / 20);
          displacement -= factor * 1.0 * Math.cos((dist / radius) * Math.PI * 0.5);
        }
      });
      pos.setZ(i, displacement + Math.sin(x * 0.5) * 0.04 + Math.cos(z * 0.3) * 0.03);
    }
    geo.computeVertexNormals();
    return geo;
  }, [zones, isPrediction]);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} geometry={geometry}>
      <meshStandardMaterial
        color={isPrediction ? "#332244" : "#2d3d5c"}
        wireframe={false}
        side={THREE.DoubleSide}
        roughness={0.7}
        metalness={0.2}
      />
    </mesh>
  );
}

function MiningPanel({ position, size, depth, label, status }) {
  const color = status === 'active' ? '#3b82f680' : status === 'completed' ? '#22c55e40' : '#ffffff20';
  return (
    <group position={position}>
      <mesh position={[0, -depth * 0.01, 0]}>
        <boxGeometry args={[size[0], 0.1, size[1]]} />
        <meshStandardMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <lineSegments position={[0, -depth * 0.01, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size[0], 0.1, size[1])]} />
        <lineBasicMaterial color="#6b728080" />
      </lineSegments>
      <Html position={[0, -depth * 0.01 + 0.3, 0]} center>
        <div className="text-[9px] text-gray-400 whitespace-nowrap bg-mine-950/80 px-1 rounded border border-white/10">{label} ({depth}m)</div>
      </Html>
    </group>
  );
}

function SensorNode({ position, status, id }) {
  const color = status === 'ONLINE' ? '#22c55e' : status === 'WEAK' ? '#eab308' : '#ef4444';
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.03 + 0.3;
    }
  });
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      <Html position={[0, 0.6, 0]} center>
        <div className="text-[8px] text-gray-300 font-mono whitespace-nowrap bg-mine-950/80 px-1 rounded">{id}</div>
      </Html>
    </group>
  );
}

function RiskZoneOverlay({ zone, isPrediction }) {
  const level = getRiskLevel(zone.riskScore ?? zone.risk ?? 0);
  const x = (zone.center[1] - 86.415) * 1000;
  const z = (zone.center[0] - 23.745) * 1000;
  const radius = isPrediction ? 3.8 : 2.5;
  const opacity = isPrediction ? Math.min(0.5, (zone.riskScore ?? 0) / 140) : Math.min(0.3, (zone.riskScore ?? 0) / 200);

  return (
    <group position={[x, 0.02, -z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshBasicMaterial color={isPrediction ? '#8b5cf6' : level.color} transparent opacity={opacity} side={THREE.DoubleSide} />
      </mesh>
      {isPrediction && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.9, radius, 32]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function Scene({ zones, viewMode, sensors }) {
  const isPrediction = viewMode === 'prediction';

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 5]} intensity={0.8} />
      <pointLight position={[-5, 8, -5]} intensity={0.4} color={isPrediction ? '#a855f7' : '#06b6d4'} />

      {/* Surface Layer */}
      <TerrainSurface zones={zones} isPrediction={isPrediction} />

      {/* Risk Zones Overlays */}
      {zones.map(zone => (
        <RiskZoneOverlay key={zone.id} zone={zone} isPrediction={isPrediction} />
      ))}

      {/* Sensor Nodes */}
      {sensors.map(s => {
        const x = (s.position[1] - 86.415) * 1000;
        const z = -(s.position[0] - 23.745) * 1000;
        return <SensorNode key={s.id} position={[x, 0.3, z]} status={s.status} id={s.id} />;
      })}

      {/* Underground Mining Panels */}
      <MiningPanel position={[-1, 0, 1]} size={[3, 2]} depth={220} label="Panel P-01" status="active" />
      <MiningPanel position={[-1, 0, -1]} size={[3, 2]} depth={235} label="Panel P-02" status="active" />
      <MiningPanel position={[-1, 0, -3]} size={[3, 2]} depth={250} label="Panel P-03" status="active" />
      <MiningPanel position={[3, 0, 1]} size={[3, 2]} depth={240} label="Panel P-04" status="active" />
      <MiningPanel position={[3, 0, -1]} size={[3, 2]} depth={255} label="Panel P-05" status="completed" />

      <Grid args={[30, 30]} position={[0, -0.01, 0]} cellSize={1} cellColor="#ffffff08" sectionSize={5} sectionColor="#ffffff10" />
      <OrbitControls makeDefault maxDistance={25} minDistance={5} maxPolarAngle={Math.PI / 2.2} />
    </>
  );
}

export default function DigitalTwinPage() {
  const [viewMode, setViewMode] = useState('current');
  const { getAllZones, sensors } = useApp();
  const zones = getAllZones();
  const sensorList = useMemo(() => Object.values(sensors), [sensors]);

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">3D Digital Twin</h1>
          <p className="text-xs text-gray-500 mt-0.5">Interactive surface, underground panels, and sensor spatial model</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('current')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === 'current' ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' : 'text-gray-400 hover:text-white bg-white/[0.04]'}`}
          >
            Current Deformation
          </button>
          <button
            onClick={() => setViewMode('prediction')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === 'prediction' ? 'bg-accent-purple/20 text-purple-400 border border-purple-400/30' : 'text-gray-400 hover:text-white bg-white/[0.04]'}`}
          >
            24h Projected Expansion
          </button>
        </div>
      </div>

      <GlassPanel padding="p-0" className="overflow-hidden relative" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        {/* Top Disclaimer Badge */}
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-mine-950/80 backdrop-blur-md border border-white/10 text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
          {DATA_LABEL}
        </div>

        <Suspense fallback={<div className="flex items-center justify-center h-full"><SkeletonLoader lines={5} /></div>}>
          <Canvas camera={{ position: [12, 10, 12], fov: 50 }} gl={{ antialias: true }} dpr={[1, 2]}>
            <color attach="background" args={['#0a0e17']} />
            <fog attach="fog" args={['#0a0e17', 20, 40]} />
            <Scene zones={zones} viewMode={viewMode} sensors={sensorList} />
          </Canvas>
        </Suspense>

        {/* Legend overlay */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3 px-3 py-2 rounded-lg bg-mine-950/80 backdrop-blur-md border border-white/[0.06] text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-safe" /> Safe Zone</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-advisory" /> Advisory Zone</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-high" /> High Zone</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-critical" /> Critical Zone</span>
        </div>

        {viewMode === 'prediction' && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-[11px] text-purple-300 font-medium animate-pulse">
            ⏱ 24h Projected Deformation Expansion View
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

