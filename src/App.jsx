import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import SkeletonLoader from './components/common/SkeletonLoader';

const MineMapPage = lazy(() => import('./pages/MineMapPage'));
const DigitalTwinPage = lazy(() => import('./pages/DigitalTwinPage'));
const LiveSensorsPage = lazy(() => import('./pages/LiveSensorsPage'));
const PredictionsPage = lazy(() => import('./pages/PredictionsPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SystemHealthPage = lazy(() => import('./pages/SystemHealthPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin mx-auto mb-3" />
        <SkeletonLoader lines={3} className="max-w-xs" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a2235',
              color: '#e5e7eb',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '13px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="mine-map" element={<Suspense fallback={<PageLoader />}><MineMapPage /></Suspense>} />
            <Route path="digital-twin" element={<Suspense fallback={<PageLoader />}><DigitalTwinPage /></Suspense>} />
            <Route path="live-sensors" element={<Suspense fallback={<PageLoader />}><LiveSensorsPage /></Suspense>} />
            <Route path="predictions" element={<Suspense fallback={<PageLoader />}><PredictionsPage /></Suspense>} />
            <Route path="alerts" element={<Suspense fallback={<PageLoader />}><AlertsPage /></Suspense>} />
            <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
            <Route path="system-health" element={<Suspense fallback={<PageLoader />}><SystemHealthPage /></Suspense>} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
