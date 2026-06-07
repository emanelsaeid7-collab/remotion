import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const RedFlagsSection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '80px' }}>
      <h2 style={{ fontSize: '80px', color: '#ef4444', fontWeight: 'bold', marginBottom: '60px', textAlign: 'center' }}>
        🚩 Red Flags
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {data.redFlags?.map((flag, index) => {
          const appear = spring({ fps, frame: frame - (index * 10), config: { damping: 12 } });
          return (
            <div key={index} style={{
              opacity: appear, transform: `translateY(${(1 - appear) * 100}px)`,
              backgroundColor: '#3f1115', padding: '40px', borderRadius: '20px',
              border: '2px solid #ef4444', fontSize: '45px', color: '#fca5a5', textAlign: 'center'
            }}>
              "{flag}"
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const AdviceSection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ fps, frame, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
      <div style={{ transform: `scale(${scale})`, textAlign: 'center', backgroundColor: '#1e293b', padding: '60px', borderRadius: '30px', border: '4px solid #60a5fa' }}>
        <div style={{ fontSize: '100px', marginBottom: '40px' }}>💡</div>
        <h2 style={{ fontSize: '50px', color: '#93c5fd', marginBottom: '30px' }}>
          Golden Rule
        </h2>
        <p style={{ fontSize: '60px', color: 'white', lineHeight: '1.4', fontWeight: 'bold' }}>
          {data.advice}
        </p>
      </div>
    </AbsoluteFill>
  );
};