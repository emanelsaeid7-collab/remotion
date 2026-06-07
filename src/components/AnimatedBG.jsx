import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS } from '../styles';

export const AnimatedBG = ({ accentColor = COLORS.primary }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Gradient orbs */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
        transform: `translate(${Math.sin(frame / 90) * 30}px, ${Math.cos(frame / 120) * 20}px)`,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.secondary}18 0%, transparent 70%)`,
        transform: `translate(${Math.cos(frame / 100) * 25}px, ${Math.sin(frame / 80) * 30}px)`,
      }} />
      {/* Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
    </div>
  );
};
