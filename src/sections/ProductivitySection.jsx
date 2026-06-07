import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const ConceptSection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ fps, frame, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
      <div style={{ transform: `scale(${scale})`, textAlign: 'center' }}>
        <div style={{ fontSize: '120px', marginBottom: '40px' }}>🧠</div>
        <h2 style={{ fontSize: '60px', color: '#94a3b8', marginBottom: '20px' }}>
          Core Concept
        </h2>
        <h1 style={{ fontSize: '90px', color: '#38bdf8', fontWeight: 'bold', lineHeight: '1.2' }}>
          {data.concept}
        </h1>
      </div>
    </AbsoluteFill>
  );
};

export const TipsSection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '80px' }}>
      <h2 style={{ fontSize: '70px', color: '#fcd34d', fontWeight: 'bold', marginBottom: '60px', textAlign: 'center' }}>
        Pro Tips 🔥
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {data.tips?.map((tip, index) => {
          const slideIn = spring({ fps, frame: frame - (index * 15), config: { damping: 14 } });
          return (
            <div key={index} style={{
              transform: `translateX(${(1 - slideIn) * 1000}px)`, backgroundColor: '#1e293b',
              padding: '40px', borderRadius: '20px', borderLeft: '10px solid #f59e0b'
            }}>
              <h3 style={{ fontSize: '50px', color: 'white', margin: '0 0 10px 0' }}>{tip.title}</h3>
              <p style={{ fontSize: '40px', color: '#cbd5e1', margin: 0 }}>{tip.detail}</p>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};