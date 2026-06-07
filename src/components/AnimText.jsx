import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const AnimText = ({
  children,
  delay = 0,
  duration = 20,
  style = {},
  from = { opacity: 0, y: 30 },
  to = { opacity: 1, y: 0 },
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(progress, [0, 1], [from.opacity ?? 0, to.opacity ?? 1]);
  const y = interpolate(progress, [0, 1], [from.y ?? 0, to.y ?? 0]);
  const scale = interpolate(progress, [0, 1], [from.scale ?? 1, to.scale ?? 1]);

  return (
    <div style={{
      opacity,
      transform: `translateY(${y}px) scale(${scale})`,
      ...style,
    }}>
      {children}
    </div>
  );
};

export const GlowBadge = ({ children, color = '#6C63FF', delay = 0 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const pulse = Math.sin(frame / 20) * 0.15 + 0.85;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 20px',
      borderRadius: 100,
      background: `${color}22`,
      border: `1px solid ${color}55`,
      color,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: 2,
      textTransform: 'uppercase',
      opacity: progress,
      transform: `scale(${0.8 + 0.2 * progress})`,
      boxShadow: `0 0 ${20 * pulse}px ${color}44`,
    }}>
      {children}
    </div>
  );
};
