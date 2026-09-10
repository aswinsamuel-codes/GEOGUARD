import { createContext, useContext, useReducer, useEffect, useCallback, useRef, useMemo } from 'react';
import { ZONES, MINE_INFO } from '../data/mockMineData';
import { SENSORS } from '../data/mockSensorData';
import wsService from '../services/websocket';
import { getRiskLevel, MINE_NAME, MINE_SUBTITLE, DATA_LABEL } from '../utils/constants';
import { calculateAuthoritativeRisk } from '../utils/riskEngine';
import toast from 'react-hot-toast';

const AppContext = createContext(null);

const initialState = {
  connected: false,
  lastUpdate: null,
  selectedZone: 'Z-04',
  zones: {},
  sensors: {},
  alerts: [],
  demoActive: false,
  demoStep: -1,
  demoDesc: '',
  notifications: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, connected: action.payload };
    case 'SET_LAST_UPDATE':
      return { ...state, lastUpdate: action.payload };
    case 'SELECT_ZONE':
      return { ...state, selectedZone: action.payload };
    case 'UPDATE_ZONES':
      return { ...state, zones: action.payload };
    case 'UPDATE_SENSORS':
      return { ...state, sensors: action.payload };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts], notifications: state.notifications + 1 };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: 0 };
    case 'SET_DEMO': {
      const { active, step, desc } = action.payload;
      return { ...state, demoActive: active, demoStep: step ?? state.demoStep, demoDesc: desc ?? state.demoDesc };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const prevRiskLevels = useRef({});

  useEffect(() => {
    const initZones = {};
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

      initZones[z.id] = {
        ...z,
        riskScore: riskCalc.score,
        riskLevel: riskCalc.level.key,
        riskContributions: riskCalc.contributions,
        pimPredicted,
        aiPredicted,
        vibration: z.tilt * 0.15,
        velocity: z.velocity || 0.1,
      };
    });
    dispatch({ type: 'UPDATE_ZONES', payload: initZones });

    const initSensors = {};
    SENSORS.forEach(s => {
      initSensors[s.id] = { ...s };
    });
    dispatch({ type: 'UPDATE_SENSORS', payload: initSensors });
  }, []);

  useEffect(() => {
    wsService.connect();
    dispatch({ type: 'SET_CONNECTED', payload: true });

    const unsubZones = wsService.subscribe('zones', (zoneData) => {
      dispatch({ type: 'UPDATE_ZONES', payload: zoneData });

      // check for risk level escalation and generate dynamic alerts
      Object.entries(zoneData).forEach(([zoneId, data]) => {
        const prevLevel = prevRiskLevels.current[zoneId];
        const currentLevel = getRiskLevel(data.riskScore);

        if (prevLevel && prevLevel.key !== currentLevel.key && currentLevel.min > prevLevel.min) {
          const zoneName = data.name || zoneId;
          const severity = currentLevel.key; // HIGH or CRITICAL

          if (severity === 'HIGH' || severity === 'CRITICAL') {
            const newAlert = {
              id: `ALT-${Date.now()}-${Math.floor(Math.random()*1000)}`,
              severity,
              zone: zoneId,
              zoneName,
              time: Date.now(),
              riskScore: data.riskScore,
              reason: `${severity} risk detected in ${zoneName}. Deformation: ${data.deformation.toFixed(1)}mm, Velocity: ${data.velocity.toFixed(2)}mm/d, Moisture: ${Math.round(data.moisture)}%.`,
              prediction: `Accelerated deformation forecast (+${(data.aiPredicted - data.deformation).toFixed(1)}mm / 24h)`,
              confidence: 88,
              action: severity === 'CRITICAL'
                ? 'Restrict access to affected zone and initiate ground inspection.'
                : 'Increase monitoring frequency and prepare contingency inspection.',
              contributions: data.riskContributions || [],
              factors: (data.riskContributions || []).map(c => ({
                factor: `${c.label}: ${c.rawValue} (+${c.contribution} pts)`,
                active: c.contribution > 8,
              })),
            };

            dispatch({ type: 'ADD_ALERT', payload: newAlert });

            toast.error(`${zoneName}: Risk escalated to ${currentLevel.label} (${data.riskScore})`, {
              duration: 6000,
              style: { background: '#1a2235', color: '#fff', border: `1px solid ${currentLevel.color}` },
            });
          }
        }
        prevRiskLevels.current[zoneId] = currentLevel;
      });
    });

    const unsubSensors = wsService.subscribe('sensors', (sensorData) => {
      dispatch({ type: 'UPDATE_SENSORS', payload: sensorData });
    });

    const unsubUpdate = wsService.subscribe('update', (data) => {
      dispatch({ type: 'SET_LAST_UPDATE', payload: data.time });
    });

    const unsubDemo = wsService.subscribe('demo', (data) => {
      dispatch({ type: 'SET_DEMO', payload: {
        active: data.status === 'running',
        step: data.step,
        desc: data.desc,
      }});
      if (data.status === 'completed') {
        toast.success('Demo sequence completed', {
          style: { background: '#1a2235', color: '#fff', border: '1px solid #22c55e' },
        });
      }
    });

    return () => {
      unsubZones();
      unsubSensors();
      unsubUpdate();
      unsubDemo();
      wsService.disconnect();
    };
  }, []);

  const selectZone = useCallback((zoneId) => {
    dispatch({ type: 'SELECT_ZONE', payload: zoneId });
  }, []);

  const startDemo = useCallback(() => {
    toast('🎬 Starting GEOGUARD System Integrity Demo...', {
      duration: 3000,
      style: { background: '#1a2235', color: '#fff', border: '1px solid #06b6d4' },
    });
    wsService.startDemo();
  }, []);

  const stopDemo = useCallback(() => {
    wsService.stopDemo();
    dispatch({ type: 'SET_DEMO', payload: { active: false, step: -1, desc: '' } });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  const getZoneData = useCallback((zoneId) => {
    if (!state.zones) return null;
    return state.zones[zoneId] || null;
  }, [state.zones]);

  const getAllZones = useCallback(() => {
    if (!state.zones || Object.keys(state.zones).length === 0) return ZONES.map(z => ({ ...z, riskScore: z.risk }));
    return Object.values(state.zones);
  }, [state.zones]);

  // Unified Authoritative Derived State
  const zonesList = useMemo(() => Object.values(state.zones), [state.zones]);
  const sensorsList = useMemo(() => Object.values(state.sensors), [state.sensors]);

  const selectedZoneData = useMemo(() => {
    return state.zones[state.selectedZone] || zonesList[0] || null;
  }, [state.zones, state.selectedZone, zonesList]);

  const maxRiskZone = useMemo(() => {
    if (zonesList.length === 0) return { riskScore: 15 };
    return zonesList.reduce((max, z) => (z.riskScore ?? 0) > (max.riskScore ?? 0) ? z : max, zonesList[0]);
  }, [zonesList]);

  const overallRisk = maxRiskZone ? (maxRiskZone.riskScore ?? 15) : 15;
  const overallRiskLevel = useMemo(() => getRiskLevel(overallRisk), [overallRisk]);

  const currentMine = useMemo(() => ({
    id: 'M-01',
    name: MINE_NAME,
    subtitle: MINE_SUBTITLE,
    dataLabel: DATA_LABEL,
  }), []);

  const currentDeformation = selectedZoneData?.deformation ?? 2.5;
  const currentVelocity = selectedZoneData?.velocity ?? 0.15;
  const currentMoisture = selectedZoneData?.moisture ?? 25;
  const currentTilt = selectedZoneData?.tilt ?? 0.1;
  const currentVibration = selectedZoneData?.vibration ?? 0.05;
  const currentPimPredicted = selectedZoneData?.pimPredicted ?? 2.4;
  const currentAiPredicted = selectedZoneData?.aiPredicted ?? 2.6;
  const pimDev = currentPimPredicted > 0 ? Math.abs((currentDeformation - currentPimPredicted) / currentPimPredicted) * 100 : 0;

  const authoritativeRiskCalc = useMemo(() => {
    return calculateAuthoritativeRisk({
      deformation: currentDeformation,
      velocity: currentVelocity,
      moisture: currentMoisture,
      tilt: currentTilt,
      pimDeviation: pimDev,
      aiPrediction: currentAiPredicted,
    });
  }, [currentDeformation, currentVelocity, currentMoisture, currentTilt, pimDev, currentAiPredicted]);

  const zoneSensors = useMemo(() => {
    return sensorsList.filter(s => s.zone === state.selectedZone);
  }, [sensorsList, state.selectedZone]);

  const avgBattery = useMemo(() => {
    if (sensorsList.length === 0) return 92;
    return Math.round(sensorsList.reduce((acc, s) => acc + (s.battery || 0), 0) / sensorsList.length);
  }, [sensorsList]);

  const avgSignal = useMemo(() => {
    if (sensorsList.length === 0) return 94;
    return Math.round(sensorsList.reduce((acc, s) => acc + (s.signal || 0), 0) / sensorsList.length);
  }, [sensorsList]);

  const systemHealth = useMemo(() => {
    const onlineCount = sensorsList.filter(s => s.status === 'ONLINE').length;
    const weakCount = sensorsList.filter(s => s.status === 'WEAK').length;
    const offlineCount = sensorsList.filter(s => s.status === 'OFFLINE').length;
    const totalSensors = sensorsList.length || SENSORS.length;
    const sensorHealthPct = totalSensors > 0 ? Math.round((onlineCount / totalSensors) * 100) : 100;
    const degradedSensors = weakCount + offlineCount;
    return {
      onlineCount,
      weakCount,
      offlineCount,
      totalSensors,
      sensorHealthPct,
      networkStatus: offlineCount > 2 ? 'DEGRADED' : 'HEALTHY',
      gatewayStatus: 'OPERATIONAL',
      degradedSensors,
    };
  }, [sensorsList]);

  const demoState = useMemo(() => ({
    active: state.demoActive,
    step: state.demoStep,
    desc: state.demoDesc,
  }), [state.demoActive, state.demoStep, state.demoDesc]);

  const value = {
    ...state,
    currentMine,
    riskScore: overallRisk,
    riskLevel: overallRiskLevel,
    activeAlerts: state.alerts,
    deformation: currentDeformation,
    deformationVelocity: currentVelocity,
    moisture: currentMoisture,
    tilt: currentTilt,
    vibration: currentVibration,
    battery: avgBattery,
    signal: avgSignal,
    pimPrediction: currentPimPredicted,
    observedDeformation: currentDeformation,
    aiPrediction: currentAiPredicted,
    predictionConfidence: 88,
    riskContributions: authoritativeRiskCalc.contributions,
    systemHealth,
    demoState,
    selectZone,
    startDemo,
    stopDemo,
    clearNotifications,
    getZoneData,
    getAllZones,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

