# GEOGUARD — AI-Powered Mine Subsidence Intelligence

> **SIH Demonstration Prototype** | Real-Time Underground Coal Mine Subsidence Monitoring, Prediction & Early Warning Command Center

[![GitHub Repository](https://img.shields.io/badge/GitHub-GEOGUARD-06b6d4?style=flat&logo=github)](https://github.com/aswinsamuel-codes/GEOGUARD.git)
[![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.x-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-Prototype%20%2F%20SIH%20Demo-22c55e?style=flat)]()

---

## 1. Project Identity

- **Name**: GEOGUARD
- **Tagline**: AI-Powered Mine Subsidence Intelligence
- **Repository**: [https://github.com/aswinsamuel-codes/GEOGUARD.git](https://github.com/aswinsamuel-codes/GEOGUARD.git)
- **Target Mine Context**: GEOGUARD Demo Mine (Jharia Coalfield, Jharkhand, India)
- **Status**: Prototype / SIH Demonstration Build

---

## 2. Project Overview

**GEOGUARD** is an advanced web-based mine safety command-center prototype engineered for **low-cost real-time mine subsidence monitoring, prediction, and early warning** in underground coal mines. 

Underground mining methods (such as longwall mining and bord-and-pillar extraction) extract coal seams deep below the Earth's surface. Over time, the collapse or convergence of void spaces causes subsurface rock displacement and surface ground subsidence. Sudden, unmonitored subsidence poses catastrophic threats to mine shafts, surface infrastructure, railways, surrounding communities, and underground worker safety.

GEOGUARD acts as a centralized operational decision-support system that bridges:
- **Satellite InSAR Deformation Mapping**: Broad spatial deformation field tracking.
- **Low-Cost IoT Sensor Telemetry**: High-frequency ground tilt, 3-axis acceleration, and soil moisture telemetry.
- **Physics-Based Modeling**: Probability Integral Method (PIM) subsidence prediction.
- **AI Forecasting**: Simulated CNN-LSTM neural network spatio-temporal deformation predictions.
- **Authoritative Geo-Risk Scoring**: 0–100 composite risk index with automated level classification (`SAFE`, `ADVISORY`, `HIGH`, `CRITICAL`).
- **Interactive 3D Digital Twin**: Real-time spatial visualization of surface deformation, underground extraction panels, and sensor nodes.
- **Explainable Early Warning System**: *"Why This Alert?"* risk contribution breakdown paired with operational response recommendations.

> [!IMPORTANT]
> **PROTOTYPE DATA DISCLAIMER**
> 
> The current GEOGUARD web application is an interactive frontend prototype created for Smart India Hackathon (SIH) technical demonstration.
> - Mine geometry, sensor telemetry, deformation measurements, alerts, and historical data are **SYNTHETIC / DEMO DATA**.
> - AI forecasts represent **SIMULATED CNN-LSTM OUTPUT**.
> - The system is not currently connected to live physical IoT hardware or production satellite APIs.

---

## 3. Problem Statement

Monitoring underground coal mine subsidence presents distinct technical challenges:

1. **Satellite InSAR Alone is Too Slow**: Synthetic Aperture Radar (SAR) interferometry provides exceptional spatial coverage over large mining areas, but its revisit period (6–12 days for Sentinel-1) cannot detect sudden, rapid accelerations in ground subsidence between satellite passes.
2. **Sensors Alone Lack Spatial Scope**: Spot IoT sensors (MPU6050 accelerometers, tilt meters, moisture sensors) deliver sub-second telemetry, but deploying them over several square kilometers is cost-prohibitive without targeted placement.
3. **Physics Models Lack Dynamic Adaptation**: Traditional empirical physics models like the Probability Integral Method (PIM) calculate theoretical final subsidence basins based on geometric extraction parameters, but cannot adjust dynamically to unexpected rainfall, geological faults, or anomalous rock mass behavior.

**The GEOGUARD Solution**: Unify satellite spatial boundaries, targeted real-time IoT telemetry, PIM physics baselines, and deep learning forecasting into **One Authoritative Command-Center System State**.

---

## 4. Core System Pipeline

The diagram below illustrates the end-to-end data flow of the GEOGUARD system, highlighting current simulated frontend prototype modules alongside future production backend integration components:

```
┌─────────────────────────────────────────────────────────┐
│              Sentinel-1 SAR / InSAR Data                │  [Simulated Prototype Data]
│             (Spatial Deformation Boundaries)            │  (Future: CopHub / ASF API Ingestion)
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│             InSAR Deformation Heat Field Map            │  [Implemented Leaflet 2D Layer]
│              High-Risk Zone Boundaries (Z-01..06)       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│            Low-Cost IoT Sensor Network Node             │  [Simulated Telemetry Engine]
│     (ESP32 + MPU6050 Accelerometer/Tilt + Moisture)    │  (Future: Physical LoRaWAN Nodes)
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│             LoRa Gateway / Real-Time WebSocket          │  [Implemented Mock WebSocket]
│         Sub-Second Telemetry & Diagnostic Stream        │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│          Probability Integral Method (PIM)              │  [Implemented Physics Engine]
│      Theoretical Subsidence Calculation (PIM vs Obs)    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│             CNN-LSTM Spatio-Temporal AI                 │  [Simulated Model Output]
│        6h / 12h / 24h / 48h Deformation Forecast       │  (Future: PyTorch Model Service)
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│           Authoritative Geo-Risk Engine (0-100)         │  [Implemented Authoritative Engine]
│      6-Factor Composite Risk Score & Level Evaluator    │
└────────────────────────────┬────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────┐
│   3D Digital Twin     │         │   Explainable Alerts  │
│(React Three Fiber/3.js)│         │ & Operational Action │
└───────────────────────┘         └───────────────────────┘
```

---

## 5. Key Implemented Features

GEOGUARD includes 8 dedicated dashboard views and operational modules:

- 📊 **Command-Center Dashboard**: Executive overview featuring live KPI cards (Overall Mine Risk, Current Status, Active Alerts, 24h Predicted Deformation), 2D Risk Map, Geo-Risk Composite Gauge, Sensor Stream, AI Predictions, and Early Warning panel.
- 🎯 **Authoritative Geo-Risk Gauge**: Dynamic composite gauge displaying the exact 0–100 risk score and status badge (`SAFE`, `ADVISORY`, `HIGH`, `CRITICAL`) with an expandable 6-factor risk breakdown.
- 🗺️ **Interactive 2D Leaflet Mine Map**: Vector overlay showing mine boundary limits, active/completed underground longwall extraction panels, risk zone polygons (Z-01 to Z-06), distinct radial deformation heat intensity fields, and sensor node markers with interactive detail popups.
- 🧊 **3D Digital Twin**: Built with React Three Fiber and Three.js. Features 3D surface terrain wireframe/mesh displacement, underground mining panels at actual depths (220m–270m), glowing ESP32 sensor nodes, risk zone overlays, and a toggleable **24h Projected Deformation Expansion** view.
- 📡 **Live Sensors Telemetry Stream**: Sensor grid displaying 12 ESP32 nodes with full telemetry metrics ($ax, ay, az$ 3-axis accelerations, tilt angle in degrees, vibration in $g$, soil moisture %, battery %, signal strength dBm, packet loss %, and last comm timestamp). Includes special offline node isolation handling.
- 🧠 **AI Predictions & Physics Comparison**: Simulated CNN-LSTM 48-hour deformation forecast curves, PIM theoretical model vs observed deformation comparison, dynamic physics deviation percentage, and anomaly detection indicators.
- 💡 **Explainable AI ("WHY THIS ALERT?")**: Detailed risk factor breakdown quantifying exact point contributions for ground deformation, velocity, moisture, tilt, PIM deviation, and AI forecast alongside model confidence % and actionable operator instructions.
- ⚡ **What-If Scenario Simulator**: Interactive sliders allowing mine engineers to simulate environmental and operational perturbations (rainfall intensity, soil moisture, deformation velocity, sensor movement, mining activity rate) and immediately observe projected risk score deltas, level transitions, and major driver factors.
- ⏪ **Incident Replay Scrubber**: 24-hour historical incident timeline scrubber (T-24h to T-0) demonstrating the progressive accumulation of subsidence, threshold crossings, and alert generation over time.
- 🩺 **System Health Diagnostics**: Real-time diagnostic statistics tracking online/weak/offline sensor counts, battery degradation, signal strength averages, network gateway status, and detected hardware faults.
- 🎬 **Deterministic Run Demo Sequence**: A 12-step guided demonstration sequence accessible via the sidebar button, engineered specifically for judges to watch a simulated risk escalation from `SAFE` (17) to `HIGH` (65) to `CRITICAL` (92) with clean reset capability.

---

## 6. Risk Classification System

GEOGUARD enforces a strict 4-tier risk classification standard across all pages:

| Score Range | Status Level | Color Code | Badge Style | Action Required |
| :---: | :---: | :---: | :---: | :--- |
| **0 – 30** | **SAFE** | `#22c55e` | Green | Normal operations; routine automated monitoring. |
| **31 – 50** | **ADVISORY** | `#eab308` | Yellow | Minor anomaly detected; log trends and review telemetry. |
| **51 – 75** | **HIGH** | `#f97316` | Orange | Elevated subsidence risk; increase sensor polling & alert field engineers. |
| **76 – 100** | **CRITICAL** | `#ef4444` | Red | Severe collapse risk; **restrict zone access immediately & inspect ground**. |

---

## 7. Risk Contribution Model

The authoritative risk engine (`src/utils/riskEngine.js`) calculates composite risk using six weighted risk factors:

$$\text{Composite Score} = \text{clamp}\left(\sum_{i=1}^{6} \text{FactorScore}_i \times \text{Weight}_i, \, 0, \, 100\right)$$

| Factor Key | Factor Label | Weight | Measurement Unit | Description |
| :--- | :--- | :---: | :---: | :--- |
| `ground_deformation` | Ground Deformation | **35%** | `mm` | Cumulative vertical surface displacement. |
| `deformation_velocity` | Deformation Velocity | **20%** | `mm/day` | Rate of subsidence change over time. |
| `moisture` | Soil Moisture | **15%** | `%` | Ground water saturation level. |
| `sensor_movement` | Sensor Movement (Tilt) | **10%** | `degrees (°)` | Angular tilt from ESP32 MPU6050 sensors. |
| `pim_deviation` | PIM Physics Deviation | **10%** | `%` | Percentage variance between PIM model & observed deformation. |
| `ai_forecast` | AI Forecast Acceleration | **10%** | `mm` | CNN-LSTM projected 24-hour deformation trend. |

---

## 8. Explainable Alerts & Decision Support

When risk escalates to `HIGH` or `CRITICAL`, GEOGUARD generates an alert containing an **Explainable AI** summary (*"WHY THIS ALERT?"*) to eliminate black-box decision-making:

```
[🚨 CRITICAL ALERT] Zone D — East Extension
Reason: CRITICAL risk detected in Zone D — East Extension. Deformation: 32.5mm, Velocity: 4.20mm/d, Moisture: 88%.

RECOMMENDED ACTION:
"Restrict access to affected zone and initiate ground inspection."

PREDICTION:
Accelerated deformation forecast (+11.5mm / 24h) | Confidence: 88%

WHY THIS ALERT? (RISK FACTOR BREAKDOWN):
✓ Ground Deformation         +32 pts (32.5 mm)
✓ Deformation Velocity       +20 pts (4.20 mm/d)
✓ Moisture                   +13 pts (88%)
✓ Sensor Movement (Tilt)     +7 pts (5.80°)
✓ PIM Deviation              +10 pts (85.2%)
✓ AI Forecast                +10 pts (44.0 mm)
```

---

## 9. 3D Digital Twin Architecture

The 3D Digital Twin (`src/pages/DigitalTwinPage.jsx`) provides spatial communication of surface and underground mine structures:

- **Technology**: React Three Fiber (`@react-three/fiber`), Three.js, and Drei (`@react-three/drei`).
- **Surface Layer**: Parametric `PlaneGeometry` terrain mesh (80x64 subdivisions) featuring real-time vertex height displacement calculated from live zone deformation.
- **Underground Longwall Panels**: 3D rectangular box geometries situated at actual mine depths (220m to 270m) representing active extraction panels (Panel P-01 through P-08).
- **Sensor Nodes**: 3D spheres positioned at exact surface coordinates with dynamic floating HTML labels (`Drei Html`) and status-colored emissive lighting.
- **Current vs. 24h Prediction View**:
  - *Current View*: Visualizes actual live surface deformation depressions.
  - *24h Prediction View*: Deepens terrain displacement, expands risk zone radial boundaries, and highlights projected expansion with a glowing purple aura ring (`#8b5cf6`).

---

## 10. What-If Scenario Simulator

The What-If Simulator (`src/components/predictions/WhatIfSimulator.jsx`) lets operators simulate hypothetical conditions without altering live monitoring feeds:

### Interactive Inputs:
1. **Rainfall Intensity**: `-50%` to `+100%`
2. **Soil Moisture Level**: `-30%` to `+50%`
3. **Deformation Velocity**: `-20%` to `+80%`
4. **Sensor Movement (Tilt)**: `-20%` to `+60%`
5. **Extraction Activity Rate**: `-50%` to `+50%`

### Prominent Output Display:
- **CURRENT RISK**: Baseline risk score before simulation (e.g., `17 SAFE`).
- **SCENARIO RISK**: Calculated scenario score (e.g., `68 HIGH`).
- **RISK DELTA**: Net risk score difference (e.g., `+51 POINTS`).
- **LEVEL TRANSITION**: Clear transition badge (`SAFE → HIGH`).
- **MAJOR DRIVERS**: Rank-ordered breakdown of factors driving the scenario change.

---

## 11. Incident Replay Module

The Incident Replay component (`src/components/incidents/IncidentReplay.jsx`) allows post-incident analysis and training:
- **Timeline**: 24-hour history scrubbed across `T-24h`, `T-18h`, `T-12h`, `T-6h`, to `T-0`.
- **Playback Controls**: Play, Pause, Reset, and Speed Toggle (`1x`, `2x`, `4x`).
- **Narrative Flow**: Demonstrates realistic subsidence accumulation: stable baseline $\rightarrow$ gradual deformation $\rightarrow$ sensor tilt accumulation $\rightarrow$ PIM deviation threshold crossing $\rightarrow$ AI alert trigger $\rightarrow$ critical state.

---

## 12. Deterministic Demo Mode

GEOGUARD features a built-in 12-step deterministic demonstration engine (`src/services/websocket.js`) designed specifically for evaluators and judges:

```
STEP 1: All zones operating normally (Risk ~17, SAFE)
  ↓
STEP 2: Deformation begins increasing in Zone D (Z-04)
  ↓
STEP 3: Soil moisture rises following heavy rainfall
  ↓
STEP 4: Sensor tilt anomaly detected on ESP32-07
  ↓
STEP 5: PIM deviation increases (+35% variance)
  ↓
STEP 6: AI forecast predicts accelerated ground deformation
  ↓
STEP 7: Risk score crosses 50 -> Status escalates to HIGH
  ↓
STEP 8: HIGH alert generated & dispatched
  ↓
STEP 9: Risk factors converge across Zone D & E
  ↓
STEP 10: Risk score crosses 76 -> Status escalates to CRITICAL (Risk 92)
  ↓
STEP 11: CRITICAL alert generated & displayed in alert feed
  ↓
STEP 12: Recommended Action: "Restrict access to affected zone and initiate ground inspection."
```

*Clicking "Stop Demo" or restarting "Run Demo" cleanly purges all active alerts and resets the application to the `17 SAFE` baseline without state leakage or timer duplicate loops.*

---

## 13. Technology Stack

### Frontend Core
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.2.0
- **Language**: JavaScript (ES6+ JSX)
- **Styling**: Vanilla CSS, Custom CSS Design System, Tailwind CSS v3.4, Glassmorphism
- **Routing**: React Router v6.22

### Visualization & Graphics
- **2D Mapping**: Leaflet 1.9.4, React Leaflet 4.2.1
- **3D Digital Twin**: Three.js r162, React Three Fiber 8.15.19, Drei 9.102.0
- **Data Charts**: Recharts 2.12.2
- **Animations**: Framer Motion 11.0.8
- **Icons**: Lucide React 0.359.0
- **Toasts**: react-hot-toast 2.4.1

---

## 14. Architecture

GEOGUARD uses a centralized state architecture where all components derive their displayed values from **One Authoritative State**:

```
src/
├── components/          # Modular UI components
│   ├── alerts/          # AlertPanel, AlertCard, ExplainableAI
│   ├── cards/           # KPICard, RiskGauge
│   ├── charts/          # PIMChart
│   ├── common/          # StatusBadge, AnimatedNumber, GlassPanel, SkeletonLoader
│   ├── incidents/       # IncidentReplay
│   ├── layout/          # AppShell, Header, Sidebar, MobileNav
│   ├── map/             # MineMap (Leaflet 2D)
│   ├── predictions/     # PredictionPanel, WhatIfSimulator
│   └── sensors/         # SensorPanel
├── context/
│   └── AppContext.jsx   # AppProvider & Centralized State Store
├── data/
│   ├── mockMineData.js  # Mine boundary, panels & ZONES initial baseline
│   ├── mockSensorData.js# ESP32 sensor network data & mock readings generator
│   ├── mockAlerts.js    # Default alert templates & incident timeline generator
│   └── mockPredictions.js# Historical deformation & prediction forecast generators
├── pages/               # Top-level Page Views (8 routes)
│   ├── DashboardPage.jsx
│   ├── MineMapPage.jsx
│   ├── DigitalTwinPage.jsx
│   ├── LiveSensorsPage.jsx
│   ├── PredictionsPage.jsx
│   ├── AlertsPage.jsx
│   ├── AnalyticsPage.jsx
│   └── SystemHealthPage.jsx
├── services/
│   ├── websocket.js     # Mock WebSocket Service & 12-Step Demo Engine
│   └── api.js           # API Abstraction Service
└── utils/
    ├── riskEngine.js    # Authoritative 6-Factor Risk Score Engine
    ├── pimModel.js      # Probability Integral Method Physics Engine
    ├── constants.js     # Risk levels, factor weights & branding constants
    └── formatters.js    # Number, date, time & gaussian noise utilities
```

---

## 15. Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aswinsamuel-codes/GEOGUARD.git
   cd GEOGUARD
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173/`

---

## 16. Production Build

To validate or create the production bundle:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

---

## 17. Prototype Data Disclaimer

> [!NOTE]
> **SYNTHETIC DATA NOTICE**
> 
> GEOGUARD is currently a **frontend demonstration prototype** developed for hackathon evaluation.
> - Ground deformation values, InSAR heat maps, soil moisture percentages, and MPU6050 accelerations are generated by synthetic telemetry simulation engines.
> - CNN-LSTM predictions represent simulated model outputs based on heuristic trend functions.
> - The application is not connected to a live physical mining operation or field IoT gateway.

---

## 18. Future Production Architecture

When deploying GEOGUARD in an operational underground coal mine, the intended production architecture will replace mock services with scalable backend services:

```
[ Physical ESP32 + MPU6050 Sensors ] ──(LoRaWAN)──► [ LoRa Gateway ] ──(MQTT)──┐
                                                                              │
[ Sentinel-1 SAR / Copernicus API ] ──(REST API)──► [ Python FastAPI ] ───────┼──► [ InfluxDB / TimescaleDB ]
                                                        (Backend)             │    (Time-Series Sensor Telemetry)
[ Mine GIS Extraction Boundaries ] ───────────────────────────────────────────┤
                                                                              │
                                                                              ▼
                                                                  [ PostgreSQL + PostGIS ]
                                                                  (Spatial Mine Database)
                                                                              │
                                                                              ▼
                                                                   [ PyTorch CNN-LSTM Core ]
                                                                   (Trained Prediction Model)
                                                                              │
                                                                              ▼
                                                                   [ Production WebSocket ]
                                                                              │
                                                                              ▼
                                                                     [ GEOGUARD Frontend ]
```

---

## 19. Development Roadmap

| Feature / Component | Current Prototype Status | Planned Future Production Integration |
| :--- | :---: | :---: |
| **Frontend UI Command Center** | ✅ Fully Implemented (React 18) | Production Deployment (Vercel / Docker) |
| **3D Digital Twin** | ✅ Fully Implemented (R3F / Three.js) | Real-time BIM / Point Cloud Ingestion |
| **Authoritative Risk Engine** | ✅ Fully Implemented (6-Factor Model) | Multi-Mine Custom Weighting Engine |
| **What-If Scenario Simulator** | ✅ Fully Implemented | Monte Carlo Risk Simulation Core |
| **Real-Time Data Stream** | ⚠️ Simulated WebSocket Service | Production MQTT / WebSockets Broker |
| **IoT Hardware Integration** | ⚠️ Synthetic Telemetry Data | Physical ESP32 + LoRaWAN Gateway Field Nodes |
| **Satellite Data Pipeline** | ⚠️ Synthetic Deformation Data | Automated Sentinel-1 InSAR Ingestion Pipeline |
| **AI Prediction Engine** | ⚠️ Simulated CNN-LSTM Outputs | Trained PyTorch CNN-LSTM Model Microservice |
| **Backend Database** | ⚠️ In-Memory Mock Data | PostgreSQL + PostGIS & InfluxDB |
| **User Authentication & RBAC** | ⚠️ Demo Mode | JWT / OAuth2 Role-Based Access Control |

---

## 20. Design Philosophy

GEOGUARD is built to answer **Five Operational Questions** for mine safety engineers:

1. 📍 **WHERE?** $\rightarrow$ *Mine Map & 3D Digital Twin pinpoint exact spatial deformation zones.*
2. 📉 **WHAT?** $\rightarrow$ *Live Sensor Telemetry quantifies deformation, velocity, tilt, and moisture.*
3. 🔍 **WHY?** $\rightarrow$ *Explainable AI decomposes the Geo-Risk score into exact factor contributions.*
4. ⏱ **WHEN?** $\rightarrow$ *CNN-LSTM 48-hour forecasts predict when thresholds will be crossed.*
5. 🛡 **WHAT SHOULD WE DO?** $\rightarrow$ *Automated early warning system dispatches unambiguous response actions.*

---

## 21. Project Status

- **Status**: Prototype / SIH Demonstration Build
- **Maintainer**: [aswinsamuel-codes](https://github.com/aswinsamuel-codes)
- **Repository**: [https://github.com/aswinsamuel-codes/GEOGUARD.git](https://github.com/aswinsamuel-codes/GEOGUARD.git)
- **License**: MIT License
