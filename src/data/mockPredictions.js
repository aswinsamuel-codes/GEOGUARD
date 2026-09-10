import { gaussianRandom } from '../utils/formatters';

export function generateHistoricalDeformation(hours = 168) {
  const data = [];
  const now = Date.now();
  const msPerHour = 3600000;
  let baseActual = 5.0;
  let basePIM = 5.2;
  let baseAI = 5.1;

  for (let i = 0; i < hours; i++) {
    const t = i / hours;
    const trend = t * t * 25;
    const diurnal = Math.sin((i / 24) * 2 * Math.PI) * 0.5;

    baseActual = trend + diurnal + gaussianRandom(0, 0.3);
    basePIM = trend * 0.92 + gaussianRandom(0, 0.2);
    baseAI = trend * 1.05 + diurnal * 0.8 + gaussianRandom(0, 0.25);

    data.push({
      time: now - (hours - i) * msPerHour,
      hour: i,
      actual: Math.max(0, Math.round(baseActual * 100) / 100),
      pim: Math.max(0, Math.round(basePIM * 100) / 100),
      ai: Math.max(0, Math.round(baseAI * 100) / 100),
    });
  }
  return data;
}

export function generatePredictionForecast(currentDeformation = 2.5) {
  const current = Math.max(0, currentDeformation);
  const v6 = Number((current + Math.max(0.3, current * 0.08)).toFixed(1));
  const v12 = Number((v6 + Math.max(0.4, current * 0.12)).toFixed(1));
  const v24 = Number((v12 + Math.max(0.6, current * 0.18)).toFixed(1));
  const v48 = Number((v24 + Math.max(0.9, current * 0.25)).toFixed(1));

  return [
    { label: 'Current', hours: 0, value: Number(current.toFixed(1)), confidence: 100 },
    { label: '6h', hours: 6, value: v6, confidence: 92 },
    { label: '12h', hours: 12, value: v12, confidence: 85 },
    { label: '24h', hours: 24, value: v24, confidence: 76 },
    { label: '48h', hours: 48, value: v48, confidence: 62 },
  ];
}

export function generateForecastChart(currentDeformation = 18.7) {
  const data = [];
  const now = Date.now();
  const msPerHour = 3600000;

  for (let h = -48; h <= 48; h++) {
    const time = now + h * msPerHour;
    const t = (h + 48) / 96;
    if (h <= 0) {
      const trend = currentDeformation * ((h + 48) / 48);
      data.push({
        time,
        hour: h,
        actual: Math.round((trend + gaussianRandom(0, 0.3)) * 100) / 100,
        predicted: null,
        label: `${h}h`,
      });
    } else {
      const forecast = currentDeformation + h * 0.35 + gaussianRandom(0, 0.5);
      data.push({
        time,
        hour: h,
        actual: null,
        predicted: Math.round(forecast * 100) / 100,
        label: `+${h}h`,
      });
    }
  }
  return data;
}
