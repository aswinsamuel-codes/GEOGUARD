export const SENSORS = [
  { id: 'ESP32-01', zone: 'Z-01', position: [23.7478, 86.4125], status: 'ONLINE', battery: 94, signal: 88, packetLoss: 0.2, lastComm: Date.now() - 3000 },
  { id: 'ESP32-02', zone: 'Z-01', position: [23.7476, 86.4135], status: 'ONLINE', battery: 87, signal: 82, packetLoss: 0.5, lastComm: Date.now() - 5000 },
  { id: 'ESP32-03', zone: 'Z-02', position: [23.7468, 86.4125], status: 'ONLINE', battery: 91, signal: 90, packetLoss: 0.3, lastComm: Date.now() - 2000 },
  { id: 'ESP32-04', zone: 'Z-02', position: [23.7466, 86.4138], status: 'ONLINE', battery: 78, signal: 75, packetLoss: 1.2, lastComm: Date.now() - 8000 },
  { id: 'ESP32-05', zone: 'Z-03', position: [23.7458, 86.4122], status: 'ONLINE', battery: 82, signal: 79, packetLoss: 0.8, lastComm: Date.now() - 4000 },
  { id: 'ESP32-06', zone: 'Z-03', position: [23.7456, 86.4140], status: 'WEAK', battery: 45, signal: 42, packetLoss: 5.3, lastComm: Date.now() - 30000 },
  { id: 'ESP32-07', zone: 'Z-04', position: [23.7478, 86.4165], status: 'ONLINE', battery: 88, signal: 85, packetLoss: 0.6, lastComm: Date.now() - 3500 },
  { id: 'ESP32-08', zone: 'Z-04', position: [23.7476, 86.4178], status: 'ONLINE', battery: 72, signal: 68, packetLoss: 1.8, lastComm: Date.now() - 12000 },
  { id: 'ESP32-09', zone: 'Z-05', position: [23.7468, 86.4165], status: 'ONLINE', battery: 65, signal: 60, packetLoss: 2.5, lastComm: Date.now() - 6000 },
  { id: 'ESP32-10', zone: 'Z-05', position: [23.7466, 86.4180], status: 'WEAK', battery: 38, signal: 35, packetLoss: 8.1, lastComm: Date.now() - 45000 },
  { id: 'ESP32-11', zone: 'Z-06', position: [23.7444, 86.4125], status: 'ONLINE', battery: 96, signal: 92, packetLoss: 0.1, lastComm: Date.now() - 2500 },
  { id: 'ESP32-12', zone: 'Z-06', position: [23.7442, 86.4138], status: 'OFFLINE', battery: 5, signal: 0, packetLoss: 100, lastComm: Date.now() - 3600000 },
];

export function generateSensorReadings(sensor) {
  const base = {
    'Z-01': { ax: 0.02, ay: 0.01, az: 9.81, tilt: 0.4, vibration: 0.05, moisture: 32 },
    'Z-02': { ax: 0.05, ay: 0.03, az: 9.80, tilt: 1.2, vibration: 0.12, moisture: 48 },
    'Z-03': { ax: 0.12, ay: 0.08, az: 9.78, tilt: 2.8, vibration: 0.28, moisture: 62 },
    'Z-04': { ax: 0.18, ay: 0.14, az: 9.76, tilt: 3.6, vibration: 0.35, moisture: 71 },
    'Z-05': { ax: 0.25, ay: 0.20, az: 9.73, tilt: 5.1, vibration: 0.52, moisture: 82 },
    'Z-06': { ax: 0.08, ay: 0.05, az: 9.79, tilt: 1.8, vibration: 0.18, moisture: 55 },
  };
  const b = base[sensor.zone] || base['Z-01'];
  return {
    sensorId: sensor.id,
    timestamp: Date.now(),
    mpu6050: {
      ax: b.ax, ay: b.ay, az: b.az,
      tilt: b.tilt, vibration: b.vibration,
    },
    moisture: { value: b.moisture, trend: b.moisture > 60 ? 'rising' : 'stable' },
    esp32: {
      battery: sensor.battery,
      signal: sensor.signal,
      status: sensor.status,
      lastPacket: sensor.lastComm,
    },
  };
}
