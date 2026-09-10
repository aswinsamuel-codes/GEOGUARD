import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import GlassPanel from '../common/GlassPanel';
import StatusBadge from '../common/StatusBadge';
import AnimatedNumber from '../common/AnimatedNumber';
import { generateIncidentTimeline } from '../../data/mockAlerts';
import { formatNumber } from '../../utils/formatters';
import { Play, Pause, RotateCcw, FastForward, History } from 'lucide-react';

function IncidentReplay() {
  const [timeline] = useState(() => generateIncidentTimeline());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);

  const current = timeline[currentIndex];

  const play = useCallback(() => {
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setCurrentIndex(0);
  }, []);

  const toggleSpeed = useCallback(() => {
    setSpeed(s => s === 1 ? 2 : s === 2 ? 4 : 1);
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= timeline.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, timeline.length]);

  const chartData = timeline.slice(0, currentIndex + 1);

  return (
    <GlassPanel padding="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="section-title flex items-center gap-2">
          <History size={14} className="text-accent-cyan" />
          Incident Replay
        </h3>
        <span className="text-[10px] text-gray-500 font-mono">24H TIMELINE</span>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-white/[0.03] rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500">Time</div>
          <div className="text-sm font-bold text-white">{current?.label}</div>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500">Risk</div>
          <div className="text-sm font-bold"><AnimatedNumber value={current?.riskScore ?? 0} decimals={0} /></div>
          <StatusBadge score={current?.riskScore ?? 0} size="xs" />
        </div>
        <div className="bg-white/[0.03] rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500">Deformation</div>
          <div className="text-sm font-bold text-accent-cyan">{formatNumber(current?.deformation)} mm</div>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500">Moisture</div>
          <div className="text-sm font-bold text-risk-safe">{formatNumber(current?.moisture, 0)}%</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-36 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#6b7280' }} interval={3} />
            <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} width={30} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#1a2235', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
            <ReferenceLine y={75} stroke="#ef444480" strokeDasharray="3 3" />
            <ReferenceLine y={50} stroke="#f9731680" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="riskScore" stroke="#ef4444" strokeWidth={2} dot={false} name="Risk" />
            <Line type="monotone" dataKey="deformation" stroke="#06b6d4" strokeWidth={1.5} dot={false} name="Deformation" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline Slider */}
      <div className="mb-3">
        <input
          type="range"
          min={0}
          max={timeline.length - 1}
          value={currentIndex}
          onChange={(e) => { setCurrentIndex(Number(e.target.value)); setPlaying(false); }}
          className="w-full h-1.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-cyan
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(6,182,212,0.4)]"
        />
        <div className="flex justify-between text-[9px] text-gray-600 mt-1">
          <span>T-24h</span><span>T-18h</span><span>T-12h</span><span>T-6h</span><span>T-0</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={reset} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors">
          <RotateCcw size={16} />
        </button>
        <button
          onClick={playing ? pause : play}
          className="p-2.5 rounded-lg bg-accent-cyan/15 text-accent-cyan hover:bg-accent-cyan/25 transition-colors"
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={toggleSpeed} className="px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors font-mono">
          {speed}x
        </button>
      </div>
    </GlassPanel>
  );
}

export default memo(IncidentReplay);
