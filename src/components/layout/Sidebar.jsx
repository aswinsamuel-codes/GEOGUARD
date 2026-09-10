import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Map, Box, Radio, BrainCircuit, AlertTriangle,
  BarChart3, HeartPulse, ChevronLeft, ChevronRight, Play, Square
} from 'lucide-react';

const iconMap = {
  'dashboard': LayoutDashboard,
  'mine-map': Map,
  'digital-twin': Box,
  'live-sensors': Radio,
  'predictions': BrainCircuit,
  'alerts': AlertTriangle,
  'analytics': BarChart3,
  'system-health': HeartPulse,
};

export default function Sidebar({ collapsed, onToggle }) {
  const { demoActive, startDemo, stopDemo } = useApp();

  return (
    <div className="h-full flex flex-col bg-mine-900/80 backdrop-blur-xl border-r border-white/[0.06]">
      {/* Logo */}
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
            <span className="text-white font-black text-sm">G</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-bold text-white tracking-tight leading-none">GEOGUARD</h1>
              <p className="text-[10px] text-cyan-400/70 font-medium tracking-wider mt-0.5">MINE INTELLIGENCE</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = iconMap[item.key] || LayoutDashboard;
          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Demo Button */}
      <div className="p-3 border-t border-white/[0.06]">
        {!collapsed ? (
          <button
            onClick={demoActive ? stopDemo : startDemo}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              demoActive
                ? 'bg-risk-critical/20 text-risk-critical border border-risk-critical/30 hover:bg-risk-critical/30'
                : 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25 hover:bg-accent-cyan/25'
            }`}
          >
            {demoActive ? <Square size={14} /> : <Play size={14} />}
            {demoActive ? 'Stop Demo' : 'Run Demo'}
          </button>
        ) : (
          <button
            onClick={demoActive ? stopDemo : startDemo}
            className={`w-full flex items-center justify-center p-2 rounded-lg transition-all ${
              demoActive ? 'text-risk-critical' : 'text-accent-cyan'
            }`}
            title={demoActive ? 'Stop Demo' : 'Run Demo'}
          >
            {demoActive ? <Square size={16} /> : <Play size={16} />}
          </button>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center p-2 border-t border-white/[0.06] text-gray-500 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
}
