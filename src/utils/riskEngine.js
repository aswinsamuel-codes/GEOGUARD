import { RISK_FACTORS, getRiskLevel } from './constants';
import { clamp } from './formatters';

export function calculateRiskScore(factors) {
  let score = 0;
  RISK_FACTORS.forEach(rf => {
    const val = factors[rf.key] ?? 0;
    score += val * rf.weight;
  });
  return clamp(Math.round(score), 0, 100);
}

export function calculateRiskBreakdown(factors) {
  return RISK_FACTORS.map(rf => {
    const val = factors[rf.key] ?? 0;
    const contribution = Math.round(val * rf.weight);
    return { ...rf, value: val, contribution, percentage: Math.round(rf.weight * 100) };
  });
}

export function calculatePhysicsDeviation(pimValue, observedValue) {
  if (!pimValue || pimValue === 0) return { deviation: 0, isAnomaly: false };
  const deviation = ((observedValue - pimValue) / pimValue) * 100;
  return {
    deviation: Math.round(deviation * 10) / 10,
    isAnomaly: Math.abs(deviation) > 10,
  };
}

export function calculateAuthoritativeRisk({
  deformation = 0,
  velocity = 0,
  moisture = 0,
  tilt = 0,
  pimDeviation = 0,
  aiPrediction = 0,
}) {
  const defScore = clamp((deformation / 35) * 100, 0, 100);
  const velScore = clamp((velocity / 4) * 100, 0, 100);
  const moistScore = clamp(moisture, 0, 100);
  const tiltScore = clamp((tilt / 8) * 100, 0, 100);
  const pimScore = clamp(pimDeviation * 3.5, 0, 100);
  const aiDiff = aiPrediction > deformation ? ((aiPrediction - deformation) / Math.max(deformation, 1)) * 150 : 15;
  const aiScore = clamp(aiDiff + defScore * 0.4, 0, 100);

  const factors = [
    { key: 'ground_deformation', label: 'Ground Deformation', weight: 0.35, valScore: defScore, rawValue: `${deformation.toFixed(1)} mm` },
    { key: 'deformation_velocity', label: 'Deformation Velocity', weight: 0.20, valScore: velScore, rawValue: `${velocity.toFixed(2)} mm/d` },
    { key: 'moisture', label: 'Moisture', weight: 0.15, valScore: moistScore, rawValue: `${moisture.toFixed(0)}%` },
    { key: 'sensor_movement', label: 'Sensor Movement (Tilt)', weight: 0.10, valScore: tiltScore, rawValue: `${tilt.toFixed(2)}°` },
    { key: 'pim_deviation', label: 'PIM Deviation', weight: 0.10, valScore: pimScore, rawValue: `${pimDeviation.toFixed(1)}%` },
    { key: 'ai_forecast', label: 'AI Forecast', weight: 0.10, valScore: aiScore, rawValue: `${aiPrediction.toFixed(1)} mm` },
  ];

  let totalRaw = 0;
  const contributions = factors.map(f => {
    const contrib = f.valScore * f.weight;
    totalRaw += contrib;
    return {
      ...f,
      contribution: Math.round(contrib),
      percentage: Math.round(f.weight * 100),
    };
  });

  const score = clamp(Math.round(totalRaw), 0, 100);
  const level = getRiskLevel(score);

  return {
    score,
    level,
    contributions,
  };
}

export function simulateWhatIfRisk(currentFactors, changes) {
  const modified = { ...currentFactors };
  Object.keys(changes).forEach(key => {
    if (modified[key] !== undefined) {
      modified[key] = clamp(modified[key] * (1 + changes[key] / 100), 0, 100);
    }
  });
  const newScore = calculateRiskScore(modified);
  const oldScore = calculateRiskScore(currentFactors);
  const oldLevel = getRiskLevel(oldScore);
  const newLevel = getRiskLevel(newScore);
  return {
    oldScore,
    newScore,
    oldLevel,
    newLevel,
    changed: oldLevel.key !== newLevel.key,
    factors: modified,
  };
}

