import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const AutomationTriggerSection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ fps, frame, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
      <div style={{ transform: `scale(${scale})`, textAlign: 'center' }}>
        <h2 style={{ fontSize: '60px', color: '#a78bfa', marginBottom: '20px' }}>
          When this happens...
        </h2>
        <div style={{
          backgroundColor: '#4c1d95', padding: '50px 80px', borderRadius: '30px',
          border: '6px dashed #a78bfa', fontSize: '70px', color: 'white', fontWeight: 'bold'
        }}>
          ⚡ {data.trigger}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const AutomationActionsSection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '80px' }}>
      <h2 style={{ fontSize: '60px', color: '#c084fc', fontWeight: 'bold', marginBottom: '50px', textAlign: 'center' }}>
        Automated Actions 🤖
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '50px' }}>
        {data.actions?.map((action, index) => {
          const slide = spring({ fps, frame: frame - (index * 10), config: { damping: 14 } });
          return (
            <div key={index} style={{
              transform: `translateX(${(1 - slide) * -1000}px)`, backgroundColor: '#2e1065',
              padding: '30px 40px', borderRadius: '15px', fontSize: '45px', color: '#e9d5ff',
              display: 'flex', alignItems: 'center', gap: '20px'
            }}>
              <span style={{ fontSize: '50px' }}>✅</span> {action}
            </div>
          );
        })}
      </div>
      
      {data.impact && (
        <div style={{
          opacity: Math.min(1, (frame - 60) / 15), textAlign: 'center',
          fontSize: '55px', color: '#34d399', fontWeight: 'bold', marginTop: '20px'
        }}>
          🎯 Result: {data.impact}
        </div>
      )}
    </AbsoluteFill>
  );
};