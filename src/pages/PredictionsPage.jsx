import PredictionPanel from '../components/predictions/PredictionPanel';
import PIMChart from '../components/charts/PIMChart';
import WhatIfSimulator from '../components/predictions/WhatIfSimulator';
import { useApp } from '../context/AppContext';
import GlassPanel from '../components/common/GlassPanel';
import StatusBadge from '../components/common/StatusBadge';

export default function PredictionsPage() {
  const { getAllZones, selectedZone, selectZone } = useApp();
  const zones = getAllZones();

  return (
    <div className="space-y-4 pb-16 lg:pb-0">
      <div>
        <h1 className="text-xl font-bold text-white">AI Predictions</h1>
        <p className="text-xs text-gray-500 mt-0.5">CNN-LSTM deformation forecasting and physics model comparison</p>
      </div>

      {/* Zone selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {zones.map(z => (
          <button
            key={z.id}
            onClick={() => selectZone(z.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              z.id === selectedZone ? 'bg-white/[0.1] text-white border border-white/[0.1]' : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {z.id} <StatusBadge score={z.riskScore ?? z.risk} size="xs" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PredictionPanel />
        <PIMChart />
      </div>

      <WhatIfSimulator />
    </div>
  );
}
