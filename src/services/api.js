import { MINE_INFO } from '../data/mockMineData';
import { ZONES } from '../data/mockMineData';
import { SENSORS } from '../data/mockSensorData';
import { MOCK_ALERTS } from '../data/mockAlerts';
import { generateHistoricalDeformation, generatePredictionForecast } from '../data/mockPredictions';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async getMineInfo() {
    await delay(200);
    return MINE_INFO;
  },

  async getZones() {
    await delay(150);
    return ZONES;
  },

  async getSensors() {
    await delay(150);
    return SENSORS;
  },

  async getAlerts() {
    await delay(200);
    return MOCK_ALERTS;
  },

  async getHistoricalDeformation(zoneId, hours = 168) {
    await delay(300);
    return generateHistoricalDeformation(hours);
  },

  async getPredictionForecast(zoneId) {
    await delay(250);
    const zone = ZONES.find(z => z.id === zoneId);
    return generatePredictionForecast(zone?.deformation || 18.7);
  },
};

export default api;
