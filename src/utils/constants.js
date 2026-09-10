export const RISK_LEVELS = {
  SAFE: { key: 'SAFE', label: 'SAFE', min: 0, max: 30, color: '#22c55e', bg: 'bg-risk-safe', text: 'text-risk-safe', badge: 'risk-safe' },
  ADVISORY: { key: 'ADVISORY', label: 'ADVISORY', min: 31, max: 50, color: '#eab308', bg: 'bg-risk-advisory', text: 'text-risk-advisory', badge: 'risk-advisory' },
  HIGH: { key: 'HIGH', label: 'HIGH', min: 51, max: 75, color: '#f97316', bg: 'bg-risk-high', text: 'text-risk-high', badge: 'risk-high' },
  CRITICAL: { key: 'CRITICAL', label: 'CRITICAL', min: 76, max: 100, color: '#ef4444', bg: 'bg-risk-critical', text: 'text-risk-critical', badge: 'risk-critical' },
};

export function getRiskLevel(score) {
  if (score <= 30) return RISK_LEVELS.SAFE;
  if (score <= 50) return RISK_LEVELS.ADVISORY;
  if (score <= 75) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.CRITICAL;
}

export const SENSOR_STATUS = {
  ONLINE: { label: 'Online', color: '#22c55e', dot: 'bg-risk-safe' },
  WEAK: { label: 'Weak Signal', color: '#eab308', dot: 'bg-risk-advisory' },
  OFFLINE: { label: 'Offline', color: '#ef4444', dot: 'bg-risk-critical' },
};

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: '/' },
  { key: 'mine-map', label: 'Mine Map', path: '/mine-map' },
  { key: 'digital-twin', label: 'Digital Twin', path: '/digital-twin' },
  { key: 'live-sensors', label: 'Live Sensors', path: '/live-sensors' },
  { key: 'predictions', label: 'Predictions', path: '/predictions' },
  { key: 'alerts', label: 'Alerts', path: '/alerts' },
  { key: 'analytics', label: 'Analytics', path: '/analytics' },
  { key: 'system-health', label: 'System Health', path: '/system-health' },
];

export const UPDATE_INTERVAL_MS = 3000;

export const MINE_NAME = 'GEOGUARD DEMO MINE';
export const MINE_SUBTITLE = 'Jharia Coalfield, Jharkhand, India';
export const DATA_LABEL = 'SYNTHETIC / DEMO DATA';

export const MAP_CENTER = [23.7450, 86.4150];
export const MAP_ZOOM = 15;

export const CHART_COLORS = {
  actual: '#06b6d4',
  predicted: '#8b5cf6',
  pim: '#3b82f6',
  observed: '#06b6d4',
  ai: '#f97316',
  moisture: '#22c55e',
  deformation: '#ef4444',
  risk: '#eab308',
};

export const RISK_FACTORS = [
  { key: 'ground_deformation', label: 'Ground Deformation', weight: 0.35 },
  { key: 'deformation_velocity', label: 'Deformation Velocity', weight: 0.20 },
  { key: 'moisture', label: 'Moisture', weight: 0.15 },
  { key: 'sensor_movement', label: 'Sensor Movement', weight: 0.10 },
  { key: 'pim_deviation', label: 'PIM Deviation', weight: 0.10 },
  { key: 'ai_forecast', label: 'AI Forecast', weight: 0.10 },
];
