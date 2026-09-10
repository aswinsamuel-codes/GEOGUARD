import { useApp } from '../context/AppContext';
import KPICard from '../components/cards/KPICard';
import RiskGauge from '../components/cards/RiskGauge';
import MineMap from '../components/map/MineMap';
import SensorPanel from '../components/sensors/SensorPanel';
import PredictionPanel from '../components/predictions/PredictionPanel';
import PIMChart from '../components/charts/PIMChart';
import AlertPanel from '../components/alerts/AlertPanel';
import IncidentReplay from '../components/incidents/IncidentReplay';
import { Gauge, ShieldAlert, Bell, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const {
    riskScore,
    riskLevel,
    activeAlerts,
    aiPrediction,
    demoState,
    riskContributions,
    currentMine,
  } = useApp();

  const criticalHighAlertsCount = activeAlerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length;

  return (
    <div className="space-y-4 lg:space-y-5 pb-16 lg:pb-0">
      {/* Demo banner */}
      {demoState.active && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="text-sm text-accent-cyan font-medium">{demoState.desc}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard title="Overall Mine Risk" value={riskScore} suffix="/ 100" icon={Gauge} riskScore={riskScore} delay={0} />
        <KPICard title="Current Status" value={riskLevel.label} icon={ShieldAlert} riskScore={riskScore} delay={0.05} />
        <KPICard title="Active Alerts" value={criticalHighAlertsCount} decimals={0} icon={Bell} riskScore={criticalHighAlertsCount > 0 ? riskScore : 15} delay={0.1} />
        <KPICard title="Predicted Deformation" value={aiPrediction} suffix="mm / 24h" prefix="+" icon={TrendingUp} decimals={1} riskScore={riskScore} delay={0.15} />
      </div>

      {/* Map + Gauge + Sensors Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
        <div className="lg:col-span-7">
          <MineMap height="420px" />
        </div>
        <div className="lg:col-span-5 space-y-3 lg:space-y-4">
          <RiskGauge score={riskScore} factors={riskContributions} />
          <SensorPanel />
        </div>
      </div>

      {/* Prediction + PIM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <PredictionPanel />
        <PIMChart />
      </div>

      {/* Alerts + Incident */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <AlertPanel maxItems={4} />
        <IncidentReplay />
      </div>
    </div>
  );
}

