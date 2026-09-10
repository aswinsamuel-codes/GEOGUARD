const now = Date.now();
const hour = 3600000;

export const MOCK_ALERTS = [
  {
    id: 'ALT-001', severity: 'CRITICAL', zone: 'Z-05', zoneName: 'Zone E — Old Workings',
    time: now - 0.5 * hour, riskScore: 85,
    reason: 'Deformation velocity increased by 34%. AI predicts threshold crossing within 18 hours. PIM deviation +21%.',
    prediction: 'Subsidence likely to exceed 35mm within 18h',
    confidence: 88,
    action: 'Restrict access to Zone E immediately. Deploy emergency monitoring team. Alert mine rescue services.',
    factors: [
      { factor: 'Deformation velocity increased', active: true },
      { factor: 'Moisture level elevated (82%)', active: true },
      { factor: 'PIM deviation exceeded threshold', active: true },
      { factor: 'Abnormal sensor tilt detected', active: true },
      { factor: 'AI forecast indicates acceleration', active: true },
    ],
  },
  {
    id: 'ALT-002', severity: 'HIGH', zone: 'Z-04', zoneName: 'Zone D — East Extension',
    time: now - 2 * hour, riskScore: 72,
    reason: 'Sustained deformation increase over 12 hours. Moisture readings above baseline by 18%.',
    prediction: 'Risk may escalate to CRITICAL within 24h if trend continues',
    confidence: 79,
    action: 'Increase monitoring frequency. Prepare contingency evacuation plan for Zone D workers.',
    factors: [
      { factor: 'Deformation velocity increasing', active: true },
      { factor: 'Moisture level rising', active: true },
      { factor: 'PIM deviation within tolerance', active: false },
      { factor: 'Sensor tilt gradual change', active: true },
      { factor: 'AI forecast shows upward trend', active: true },
    ],
  },
  {
    id: 'ALT-003', severity: 'HIGH', zone: 'Z-03', zoneName: 'Zone C — South Gallery',
    time: now - 6 * hour, riskScore: 62,
    reason: 'PIM model deviation detected at +15.4%. Observed deformation exceeds predicted values.',
    prediction: 'Anomalous behaviour may indicate accelerating subsidence',
    confidence: 74,
    action: 'Review PIM parameters. Cross-check with InSAR data. Consider additional sensor deployment.',
    factors: [
      { factor: 'PIM deviation above threshold', active: true },
      { factor: 'Deformation rate increasing', active: true },
      { factor: 'Moisture stable but elevated', active: false },
      { factor: 'Sensor readings consistent', active: false },
      { factor: 'AI model confidence moderate', active: true },
    ],
  },
  {
    id: 'ALT-004', severity: 'ADVISORY', zone: 'Z-06', zoneName: 'Zone F — Deep Seam',
    time: now - 12 * hour, riskScore: 45,
    reason: 'Moisture levels increased following rainfall. Minor deformation velocity change detected.',
    prediction: 'Situation stable but warrants monitoring',
    confidence: 82,
    action: 'Continue standard monitoring. Review after 12 hours.',
    factors: [
      { factor: 'Moisture increase post-rainfall', active: true },
      { factor: 'Minor velocity change', active: true },
      { factor: 'PIM within normal range', active: false },
      { factor: 'Sensors nominal', active: false },
      { factor: 'AI forecast stable', active: false },
    ],
  },
  {
    id: 'ALT-005', severity: 'ADVISORY', zone: 'Z-02', zoneName: 'Zone B — Central Corridor',
    time: now - 18 * hour, riskScore: 38,
    reason: 'Sensor ESP32-04 reporting intermittent signal. Data gaps detected in telemetry.',
    prediction: 'No subsidence risk if sensor issue resolved',
    confidence: 90,
    action: 'Dispatch maintenance team to check ESP32-04. Verify antenna and power supply.',
    factors: [
      { factor: 'Sensor signal degraded', active: true },
      { factor: 'Data continuity at risk', active: true },
      { factor: 'Deformation stable', active: false },
      { factor: 'All other sensors normal', active: false },
      { factor: 'No anomaly in AI model', active: false },
    ],
  },
  {
    id: 'ALT-006', severity: 'CRITICAL', zone: 'Z-05', zoneName: 'Zone E — Old Workings',
    time: now - 24 * hour, riskScore: 82,
    reason: 'Multiple sensors detecting coordinated tilt changes. Ground acceleration detected.',
    prediction: 'Rapid subsidence event possible within 6-12h',
    confidence: 91,
    action: 'Evacuate Zone E. Activate emergency response protocol. Notify district mining authority.',
    factors: [
      { factor: 'Multiple sensors alarming', active: true },
      { factor: 'Ground acceleration detected', active: true },
      { factor: 'PIM model exceeded', active: true },
      { factor: 'Moisture at saturation', active: true },
      { factor: 'AI prediction: imminent event', active: true },
    ],
  },
];

export function generateIncidentTimeline() {
  const baseTime = Date.now() - 24 * hour;
  const steps = [];
  for (let h = 0; h <= 24; h++) {
    const time = baseTime + h * hour;
    const progress = h / 24;
    const riskScore = Math.round(15 + progress * progress * 70);
    const deformation = Math.round((4 + progress * progress * 28) * 10) / 10;
    const moisture = Math.round(30 + progress * 52);
    const tilt = Math.round((0.3 + progress * progress * 5) * 10) / 10;

    steps.push({
      time,
      hour: h,
      label: `T-${24 - h}h`,
      riskScore: Math.min(riskScore, 92),
      deformation,
      moisture: Math.min(moisture, 88),
      tilt,
      alert: riskScore > 50 ? (riskScore > 75 ? 'CRITICAL' : 'HIGH') : riskScore > 30 ? 'ADVISORY' : null,
      prediction: deformation + Math.round(progress * 12 * 10) / 10,
    });
  }
  return steps;
}
