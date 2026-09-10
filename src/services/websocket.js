import { ZONES } from '../data/mockMineData';
import { SENSORS } from '../data/mockSensorData';
import { gaussianRandom, clamp } from '../utils/formatters';
import { calculateAuthoritativeRisk } from '../utils/riskEngine';

class MockWebSocketService {
  constructor() {
    this.subscribers = new Map();
    this.interval = null;
    this.demoTimeout = null;
    this.state = this._initState();
    this.connected = false;
    this.demoMode = false;
    this.demoStep = 0;
    this.demoCallbacks = [];
  }

  _initState() {
    const zoneState = {};
    ZONES.forEach(z => {
      const pimPredicted = z.deformation * 0.92;
      const aiPredicted = z.deformation * 1.08;
      const pimDev = pimPredicted > 0 ? Math.abs((z.deformation - pimPredicted) / pimPredicted) * 100 : 0;
      const riskCalc = calculateAuthoritativeRisk({
        deformation: z.deformation,
        velocity: z.velocity,
        moisture: z.moisture,
        tilt: z.tilt,
        pimDeviation: pimDev,
        aiPrediction: aiPredicted,
      });

      zoneState[z.id] = {
        ...z,
        riskScore: riskCalc.score,
        riskLevel: riskCalc.level.key,
        riskContributions: riskCalc.contributions,
        deformation: z.deformation,
        velocity: z.velocity,
        moisture: z.moisture,
        tilt: z.tilt,
        vibration: z.tilt * 0.15,
        pimPredicted,
        aiPredicted,
      };
    });

    const sensorState = {};
    SENSORS.forEach(s => {
      const isOffline = s.status === 'OFFLINE';
      sensorState[s.id] = {
        ...s,
        battery: s.battery,
        signal: isOffline ? 0 : s.signal,
        status: s.status,
        lastComm: s.lastComm,
        packetLoss: isOffline ? 100 : (s.packetLoss || 0.1),
        ax: isOffline ? '0.000' : (Math.random() * 0.04 - 0.02).toFixed(3),
        ay: isOffline ? '0.000' : (Math.random() * 0.04 - 0.02).toFixed(3),
        az: isOffline ? '0.000' : (9.81 + Math.random() * 0.04 - 0.02).toFixed(3),
        tilt: s.tilt || 0.1,
        vibration: isOffline ? '0.00' : (0.05 + Math.random() * 0.05).toFixed(2),
        moisture: s.moisture || 25,
      };
    });

    return { zones: zoneState, sensors: sensorState, lastUpdate: Date.now() };
  }

  connect() {
    if (this.connected) return;
    this.connected = true;
    this.interval = setInterval(() => this._tick(), 3000);
    this._notify('connection', { status: 'connected', time: Date.now() });
  }

  disconnect() {
    this.connected = false;
    if (this.interval) { clearInterval(this.interval); this.interval = null; }
    if (this.demoTimeout) { clearTimeout(this.demoTimeout); this.demoTimeout = null; }
    this._notify('connection', { status: 'disconnected', time: Date.now() });
  }

  subscribe(topic, callback) {
    if (!this.subscribers.has(topic)) this.subscribers.set(topic, new Set());
    this.subscribers.get(topic).add(callback);
    return () => { this.subscribers.get(topic)?.delete(callback); };
  }

  _notify(topic, data) {
    this.subscribers.get(topic)?.forEach(cb => cb(data));
    this.subscribers.get('*')?.forEach(cb => cb({ topic, data }));
  }

  _tick() {
    if (!this.connected) return;

    Object.keys(this.state.zones).forEach(zoneId => {
      const z = this.state.zones[zoneId];
      const noise = () => gaussianRandom(0, 0.2);

      if (!this.demoMode) {
        z.deformation = clamp(z.deformation + noise() * 0.03, 1, 50);
        z.velocity = clamp(z.velocity + noise() * 0.01, 0.05, 10);
        z.moisture = clamp(z.moisture + noise() * 0.15, 10, 100);
        z.tilt = clamp(z.tilt + noise() * 0.01, 0.05, 15);
        z.vibration = clamp(z.vibration + noise() * 0.005, 0.02, 5);
        z.pimPredicted = z.deformation * (0.90 + noise() * 0.01);
        z.aiPredicted = z.deformation * (1.08 + noise() * 0.02);

        const pimDev = z.pimPredicted > 0 ? Math.abs((z.deformation - z.pimPredicted) / z.pimPredicted) * 100 : 0;
        const riskCalc = calculateAuthoritativeRisk({
          deformation: z.deformation,
          velocity: z.velocity,
          moisture: z.moisture,
          tilt: z.tilt,
          pimDeviation: pimDev,
          aiPrediction: z.aiPredicted,
        });

        z.riskScore = riskCalc.score;
        z.riskLevel = riskCalc.level.key;
        z.riskContributions = riskCalc.contributions;
      }
    });

    Object.keys(this.state.sensors).forEach(sensorId => {
      const s = this.state.sensors[sensorId];
      if (s.status !== 'OFFLINE') {
        s.lastComm = Date.now();
        s.battery = clamp(s.battery - 0.005, 5, 100);
        s.signal = clamp(s.signal + gaussianRandom(0, 0.5), 10, 100);
        s.ax = ((Math.random() - 0.5) * 0.04).toFixed(3);
        s.ay = ((Math.random() - 0.5) * 0.04).toFixed(3);
        s.az = (9.81 + (Math.random() - 0.5) * 0.04).toFixed(3);
        const parentZone = this.state.zones[s.zone];
        if (parentZone) {
          s.tilt = (parentZone.tilt + Math.random() * 0.05).toFixed(2);
          s.vibration = (parentZone.vibration + Math.random() * 0.02).toFixed(2);
          s.moisture = Math.round(parentZone.moisture);
        }
      }
    });

    this.state.lastUpdate = Date.now();
    this._notify('zones', { ...this.state.zones });
    this._notify('sensors', { ...this.state.sensors });
    this._notify('update', { time: this.state.lastUpdate });
  }

  startDemo(onStep) {
    if (this.demoTimeout) {
      clearTimeout(this.demoTimeout);
      this.demoTimeout = null;
    }
    this.demoMode = true;
    this.demoStep = 0;
    this.state = this._initState(); // Clean baseline reset before demo
    if (onStep) this.demoCallbacks = [onStep];
    this._runDemoStep();
  }

  stopDemo() {
    if (this.demoTimeout) {
      clearTimeout(this.demoTimeout);
      this.demoTimeout = null;
    }
    this.demoMode = false;
    this.demoStep = 0;
    this.state = this._initState(); // Clean baseline reset after stopping demo
    this.demoCallbacks = [];
    this._notify('zones', { ...this.state.zones });
    this._notify('sensors', { ...this.state.sensors });
    this._notify('demo', { status: 'stopped', step: -1, desc: '' });
  }

  _runDemoStep() {
    if (this.demoTimeout) {
      clearTimeout(this.demoTimeout);
      this.demoTimeout = null;
    }

    if (!this.demoMode || this.demoStep > 11) {
      this.demoMode = false;
      this._notify('demo', { status: 'completed', step: this.demoStep });
      return;
    }

    const step = this.demoStep;
    const z4 = this.state.zones['Z-04'];
    const z5 = this.state.zones['Z-05'];

    // Sequence of 12 deterministic steps
    const demoSteps = [
      // STEP 1: Risk ~15, SAFE
      {
        desc: 'Step 1/12: Mine operating normally. All zones SAFE (Risk ~15).',
        action: () => {
          Object.values(this.state.zones).forEach(z => {
            z.deformation = 2.5;
            z.velocity = 0.15;
            z.moisture = 25;
            z.tilt = 0.1;
            z.vibration = 0.05;
            z.pimPredicted = 2.4;
            z.aiPredicted = 2.6;
          });
        }
      },
      // STEP 2: Deformation begins increasing
      {
        desc: 'Step 2/12: Deformation begins increasing in Zone D (Z-04).',
        action: () => {
          z4.deformation = 7.5;
          z4.velocity = 0.8;
          z4.pimPredicted = 7.0;
          z4.aiPredicted = 8.2;
        }
      },
      // STEP 3: Moisture rises
      {
        desc: 'Step 3/12: Moisture levels rise significantly following rainfall.',
        action: () => {
          z4.moisture = 62;
          z5.moisture = 58;
          z4.deformation = 9.8;
          z4.velocity = 1.1;
        }
      },
      // STEP 4: Tilt anomaly begins
      {
        desc: 'Step 4/12: Sensor tilt anomaly detected in Zone D (Z-04).',
        action: () => {
          z4.tilt = 2.2;
          z4.vibration = 0.45;
          z4.deformation = 12.0;
        }
      },
      // STEP 5: PIM deviation increases
      {
        desc: 'Step 5/12: PIM physics model deviation increases (+35%).',
        action: () => {
          z4.deformation = 15.5;
          z4.pimPredicted = 11.0;
          z4.velocity = 1.6;
          z4.tilt = 2.8;
        }
      },
      // STEP 6: AI forecast predicts acceleration
      {
        desc: 'Step 6/12: AI forecast predicts accelerated ground deformation.',
        action: () => {
          z4.aiPredicted = 26.5;
          z4.deformation = 17.8;
          z4.velocity = 2.1;
        }
      },
      // STEP 7: Risk crosses 50 -> HIGH
      {
        desc: 'Step 7/12: Risk score crosses 50. Zone D status becomes HIGH.',
        action: () => {
          z4.deformation = 21.0;
          z4.velocity = 2.6;
          z4.moisture = 72;
          z4.tilt = 3.6;
          z4.pimPredicted = 14.2;
          z4.aiPredicted = 31.0;
        }
      },
      // STEP 8: Generate HIGH alert
      {
        desc: 'Step 8/12: Generate HIGH Alert for Zone D (Z-04).',
        action: () => {
          z4.deformation = 23.5;
          z4.velocity = 2.9;
        }
      },
      // STEP 9: Multiple factors worsen
      {
        desc: 'Step 9/12: Multiple risk factors converging across Zone D & E.',
        action: () => {
          z4.deformation = 27.0;
          z4.velocity = 3.4;
          z4.moisture = 82;
          z4.tilt = 4.8;
          z5.deformation = 22.0;
          z5.velocity = 2.8;
          z5.moisture = 78;
        }
      },
      // STEP 10: Risk crosses 76 -> CRITICAL
      {
        desc: 'Step 10/12: Risk score crosses 76. Status escalates to CRITICAL.',
        action: () => {
          z4.deformation = 32.5;
          z4.velocity = 4.2;
          z4.moisture = 88;
          z4.tilt = 5.8;
          z4.pimPredicted = 19.0;
          z4.aiPredicted = 44.0;
        }
      },
      // STEP 11: Generate CRITICAL alert
      {
        desc: 'Step 11/12: Generate CRITICAL Alert for Zone D.',
        action: () => {
          z4.deformation = 36.0;
          z4.velocity = 4.8;
        }
      },
      // STEP 12: Show recommended action
      {
        desc: 'Step 12/12: Recommended action: Restrict access to affected zone and initiate ground inspection.',
        action: () => {
          z4.deformation = 39.5;
          z4.velocity = 5.4;
        }
      },
    ];

    const currentStep = demoSteps[step];
    currentStep.action();

    // Recalculate authoritative risk for all zones
    Object.keys(this.state.zones).forEach(id => {
      const z = this.state.zones[id];
      const pimDev = z.pimPredicted > 0 ? Math.abs((z.deformation - z.pimPredicted) / z.pimPredicted) * 100 : 0;
      const riskCalc = calculateAuthoritativeRisk({
        deformation: z.deformation,
        velocity: z.velocity,
        moisture: z.moisture,
        tilt: z.tilt,
        pimDeviation: pimDev,
        aiPrediction: z.aiPredicted,
      });
      z.riskScore = riskCalc.score;
      z.riskLevel = riskCalc.level.key;
      z.riskContributions = riskCalc.contributions;
    });

    this.state.lastUpdate = Date.now();
    this._notify('zones', { ...this.state.zones });
    this._notify('sensors', { ...this.state.sensors });
    this._notify('demo', { status: 'running', step, total: 12, desc: currentStep.desc });
    this.demoCallbacks.forEach(cb => cb(step, currentStep.desc));

    this.demoStep++;
    this.demoTimeout = setTimeout(() => this._runDemoStep(), 4000);
  }

  getState() {
    return this.state;
  }
}

export const wsService = new MockWebSocketService();
export default wsService;


