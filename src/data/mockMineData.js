import { MAP_CENTER } from '../utils/constants';

export const MINE_INFO = {
  name: 'GEOGUARD DEMO MINE',
  subtitle: 'Jharia Coalfield, Jharkhand, India',
  dataLabel: 'SYNTHETIC / DEMO DATA',
  center: MAP_CENTER,
  depth: 250,
  seamThickness: 3.0,
  area: '2.4 km²',
  type: 'Underground Longwall',
  operator: 'Demo Operator',
};

export const MINE_BOUNDARY = [
  [23.7490, 86.4100],
  [23.7495, 86.4200],
  [23.7410, 86.4210],
  [23.7405, 86.4105],
];

export const PANELS = [
  { id: 'P-01', name: 'Panel 01', bounds: [[23.7475, 86.4115], [23.7480, 86.4145]], depth: 220, status: 'active' },
  { id: 'P-02', name: 'Panel 02', bounds: [[23.7465, 86.4115], [23.7470, 86.4145]], depth: 235, status: 'active' },
  { id: 'P-03', name: 'Panel 03', bounds: [[23.7455, 86.4115], [23.7460, 86.4145]], depth: 250, status: 'active' },
  { id: 'P-04', name: 'Panel 04', bounds: [[23.7475, 86.4155], [23.7480, 86.4185]], depth: 240, status: 'active' },
  { id: 'P-05', name: 'Panel 05', bounds: [[23.7465, 86.4155], [23.7470, 86.4185]], depth: 255, status: 'completed' },
  { id: 'P-06', name: 'Panel 06', bounds: [[23.7455, 86.4155], [23.7460, 86.4185]], depth: 260, status: 'planned' },
  { id: 'P-07', name: 'Panel 07', bounds: [[23.7440, 86.4115], [23.7448, 86.4145]], depth: 265, status: 'active' },
  { id: 'P-08', name: 'Panel 08', bounds: [[23.7440, 86.4155], [23.7448, 86.4185]], depth: 270, status: 'planned' },
];

export const ZONES = [
  {
    id: 'Z-01', name: 'Zone A — North Face', panel: 'P-01', risk: 15,
    center: [23.7478, 86.4130],
    bounds: [[23.7473, 86.4110], [23.7483, 86.4150]],
    deformation: 2.2, velocity: 0.1, moisture: 25, tilt: 0.1,
    status: 'SAFE',
  },
  {
    id: 'Z-02', name: 'Zone B — Central Corridor', panel: 'P-02', risk: 18,
    center: [23.7468, 86.4130],
    bounds: [[23.7463, 86.4110], [23.7473, 86.4150]],
    deformation: 2.8, velocity: 0.1, moisture: 28, tilt: 0.1,
    status: 'SAFE',
  },
  {
    id: 'Z-03', name: 'Zone C — South Gallery', panel: 'P-03', risk: 20,
    center: [23.7458, 86.4130],
    bounds: [[23.7453, 86.4110], [23.7463, 86.4150]],
    deformation: 3.1, velocity: 0.2, moisture: 30, tilt: 0.2,
    status: 'SAFE',
  },
  {
    id: 'Z-04', name: 'Zone D — East Extension', panel: 'P-04', risk: 22,
    center: [23.7478, 86.4170],
    bounds: [[23.7473, 86.4150], [23.7483, 86.4190]],
    deformation: 3.5, velocity: 0.2, moisture: 32, tilt: 0.2,
    status: 'SAFE',
  },
  {
    id: 'Z-05', name: 'Zone E — Old Workings', panel: 'P-05', risk: 25,
    center: [23.7468, 86.4170],
    bounds: [[23.7463, 86.4150], [23.7473, 86.4190]],
    deformation: 4.0, velocity: 0.25, moisture: 35, tilt: 0.3,
    status: 'SAFE',
  },
  {
    id: 'Z-06', name: 'Zone F — Deep Seam', panel: 'P-07', risk: 19,
    center: [23.7444, 86.4130],
    bounds: [[23.7438, 86.4110], [23.7450, 86.4150]],
    deformation: 3.0, velocity: 0.15, moisture: 29, tilt: 0.15,
    status: 'SAFE',
  },
];

export const INFRASTRUCTURE = [
  { type: 'building', name: 'Mine Office', position: [23.7492, 86.4120], icon: 'building' },
  { type: 'building', name: 'Ventilation Shaft', position: [23.7485, 86.4195], icon: 'wind' },
  { type: 'building', name: 'Winding House', position: [23.7495, 86.4160], icon: 'factory' },
  { type: 'residential', name: 'Residential Area', position: [23.7500, 86.4140], icon: 'home' },
  { type: 'transport', name: 'Railway Line', path: [[23.7435, 86.4090], [23.7435, 86.4220]], icon: 'train' },
];
