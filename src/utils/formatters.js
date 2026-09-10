export function formatNumber(value, decimals = 1) {
  if (value == null) return '—';
  return Number(value).toFixed(decimals);
}

export function formatPercent(value, decimals = 0) {
  if (value == null) return '—';
  return `${Number(value).toFixed(decimals)}%`;
}

export function formatTimestamp(date) {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export function formatDateTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

export function formatRelativeTime(date) {
  if (!date) return '—';
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

export function gaussianRandom(mean = 0, stdev = 1) {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z * stdev + mean;
}

export function generateTimeSeriesData(hours, pointsPerHour, baseFn, noiseFn) {
  const data = [];
  const now = Date.now();
  const totalPoints = hours * pointsPerHour;
  for (let i = 0; i < totalPoints; i++) {
    const t = i / totalPoints;
    const timestamp = now - (totalPoints - i) * (3600000 / pointsPerHour);
    data.push({
      time: timestamp,
      timeLabel: formatTimestamp(timestamp),
      value: baseFn(t) + noiseFn(t),
    });
  }
  return data;
}
