import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const ErrorLogSection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ fps, frame, config: { damping: 12 } });
  const opacity = Math.min(1, frame / 15);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center' }}>
        <div style={{ fontSize: '100px', marginBottom: '20px' }}>🚨</div>
        <h2 style={{ fontSize: '60px', color: '#f87171', fontWeight: 'bold', marginBottom: '30px' }}>
          Error Log
        </h2>
        <div style={{
          backgroundColor: '#1e1e2f', padding: '40px', borderRadius: '20px',
          border: '4px solid #ef4444', fontFamily: 'monospace', fontSize: '40px',
          color: '#fca5a5', marginBottom: '40px'
        }}>
          {data.errorLog}
        </div>
        <p style={{ fontSize: '45px', color: '#cbd5e1', lineHeight: '1.4' }}>
          {data.explanation}
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const ErrorFixSection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = Math.min(1, frame / 15);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '80px', opacity }}>
      <h2 style={{ fontSize: '70px', color: '#4ade80', fontWeight: 'bold', marginBottom: '60px', textAlign: 'center' }}>
        How to Fix it 🛠️
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {data.fixSteps?.map((stepObj, index) => {
          const stepScale = spring({ fps, frame: frame - (index * 15), config: { damping: 12 } });
          return (
            <div key={index} style={{
              transform: `scale(${stepScale})`, backgroundColor: '#1e293b',
              padding: '40px', borderRadius: '20px', borderLeft: '10px solid #22c55e',
              fontSize: '45px', color: 'white'
            }}>
              <span style={{ fontWeight: 'bold', color: '#4ade80', marginRight: '20px' }}>
                Step {index + 1}:
              </span>
              {stepObj.step}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};