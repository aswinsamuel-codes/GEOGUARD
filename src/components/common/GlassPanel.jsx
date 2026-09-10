import { motion } from 'framer-motion';

export default function GlassPanel({ children, className = '', hover = false, padding = 'p-5', onClick, ...props }) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { scale: 1.01, borderColor: 'rgba(255,255,255,0.12)' },
    transition: { duration: 0.2 },
  } : {};

  return (
    <Component
      className={`glass-panel ${padding} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
}
