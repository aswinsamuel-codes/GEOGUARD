import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Box, Radio, AlertTriangle } from 'lucide-react';

const items = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/mine-map', icon: Map, label: 'Map' },
  { path: '/digital-twin', icon: Box, label: '3D Twin' },
  { path: '/live-sensors', icon: Radio, label: 'Sensors' },
  { path: '/alerts', icon: AlertTriangle, label: 'Alerts' },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-mine-900/95 backdrop-blur-xl border-t border-white/[0.06] safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive ? 'text-accent-cyan' : 'text-gray-500'
              }`
            }
          >
            <item.icon size={18} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
