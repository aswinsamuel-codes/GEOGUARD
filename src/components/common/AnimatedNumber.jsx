import { useEffect, useRef, useState } from 'react';

export default function AnimatedNumber({ value, duration = 800, decimals = 1, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);
  const frameRef = useRef(null);

  useEffect(() => {
    const from = prevValue.current;
    const to = value;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value, duration]);

  return <span>{prefix}{Number(display).toFixed(decimals)}{suffix}</span>;
}
