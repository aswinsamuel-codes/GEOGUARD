import { useApp } from '../../context/AppContext';
import { MINE_NAME, MINE_SUBTITLE, DATA_LABEL } from '../../utils/constants';
import { formatTimestamp } from '../../utils/formatters';
import { Bell, Menu, User, Wifi, WifiOff, FlaskConical } from 'lucide-react';

export default function Header({ onMenuToggle }) {
  const { connected, lastUpdate, notifications, clearNotifications, demoActive, demoDesc } = useApp();

  return (
    <header className="flex-shrink-0 h-14 border-b border-white/[0.06] bg-mine-900/60 backdrop-blur-xl">
      <div className="h-full flex items-center justify-between px-3 sm:px-4 lg:px-6">
        {/* Left: Menu + Mine Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white truncate">{MINE_NAME}</h2>
              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/25">
                {DATA_LABEL}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 truncate">{MINE_SUBTITLE}</p>
          </div>
        </div>

        {/* Center: Demo Banner */}
        {demoActive && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20">
            <FlaskConical size={13} className="text-accent-cyan" />
            <span className="text-xs text-accent-cyan font-medium truncate max-w-[200px] lg:max-w-[300px]">{demoDesc}</span>
          </div>
        )}

        {/* Right: Status + Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection Status */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04]">
            {connected ? (
              <>
                <span className="status-dot-live" />
                <span className="text-[11px] text-gray-400">Live</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-risk-critical" />
                <span className="text-[11px] text-risk-critical">Offline</span>
              </>
            )}
          </div>

          {/* Last Update */}
          <div className="hidden md:block text-[11px] text-gray-500">
            {lastUpdate ? formatTimestamp(lastUpdate) : '—'}
          </div>

          {/* Notifications */}
          <button
            onClick={clearNotifications}
            className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Bell size={18} />
            {notifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-risk-critical text-[10px] font-bold flex items-center justify-center animate-pulse-alert">
                {notifications}
              </span>
            )}
          </button>

          {/* User */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.06]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              <User size={14} />
            </div>
            <span className="hidden lg:block text-xs text-gray-300">Operator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
