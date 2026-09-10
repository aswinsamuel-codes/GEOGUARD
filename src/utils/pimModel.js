export function calculatePIM(params) {
  const {
    miningWidth = 200,
    miningLength = 300,
    seamThickness = 3.0,
    miningDepth = 250,
    subsidenceFactor = 0.9,
    mainInfluenceAngle = 65,
    inflectionPointOffset = 0.1,
    time = 1.0,
  } = params;

  const maxSubsidence = subsidenceFactor * seamThickness * 1000;
  const influenceRadius = miningDepth / Math.tan((mainInfluenceAngle * Math.PI) / 180);
  const timeDecay = 1 - Math.exp(-3 * time);
  const widthFactor = miningWidth / (2 * influenceRadius);
  const lengthFactor = miningLength / (2 * influenceRadius);
  const erf = (x) => {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    const t = 1.0 / (1.0 + p * Math.abs(x));
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  };
  const currentSubsidence = maxSubsidence * erf(widthFactor) * erf(lengthFactor) * timeDecay;
  return {
    maxSubsidence: Math.round(maxSubsidence * 100) / 100,
    currentSubsidence: Math.round(currentSubsidence * 100) / 100,
    influenceRadius: Math.round(influenceRadius * 10) / 10,
    completionRatio: Math.round(timeDecay * 100),
  };
}

export function generatePIMProfile(numPoints = 50, params = {}) {
  const profile = [];
  const { miningWidth = 200, miningDepth = 250 } = params;
  const influenceRadius = miningDepth / Math.tan((65 * Math.PI) / 180);
  const span = miningWidth / 2 + influenceRadius * 1.5;

  for (let i = 0; i < numPoints; i++) {
    const x = -span + (2 * span * i) / (numPoints - 1);
    const normalizedX = x / influenceRadius;
    const erf_val = (xv) => {
      const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
      const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
      const sign = xv < 0 ? -1 : 1;
      const t = 1.0 / (1.0 + p * Math.abs(xv));
      const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-xv * xv);
      return sign * y;
    };
    const subsidence = 0.9 * 3.0 * 1000 * 0.5 * (1 + erf_val(normalizedX * 1.5)) * 0.5;
    profile.push({ distance: Math.round(x), subsidence: Math.round(subsidence * 100) / 100 });
  }
  return profile;
}
