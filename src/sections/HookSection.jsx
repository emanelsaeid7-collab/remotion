import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { COLORS } from '../styles';

export const HookSection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rawTitle = data?.title || data?.workflowName || "Awesome Tech Tip!";
  const titleString = typeof rawTitle === 'string' ? rawTitle : String(rawTitle);
  const words = titleString.split(' ');

  const typeConfig = {
    fix:          { badge: '⚡ Quick Fix',    color: COLORS.accent },
    error:        { badge: '🐛 Debug',        color: COLORS.danger },
    comparison:   { badge: '⚖️ Comparison',   color: COLORS.primary },
    workflow:     { badge: '🔄 Workflow',      color: COLORS.accentBlue },
    productivity: { badge: '🚀 Productivity', color: COLORS.accent },
    freelancing:  { badge: '💼 Freelancing',  color: COLORS.secondary },
    automation:   { badge: '🤖 Automation',   color: COLORS.accentBlue },
  };
  const config = typeConfig[data?.videoType] || { badge: '💡 Tip', color: COLORS.primary };

  const badgeProgress = spring({ fps, frame, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px',
      flexDirection: 'column',
      gap: 32,
    }}>
      {/* Badge */}
      <div style={{
        opacity: badgeProgress,
        transform: `scale(${badgeProgress})`,
        background: `${config.color}22`,
        border: `1px solid ${config.color}66`,
        color: config.color,
        padding: '10px 28px',
        borderRadius: 100,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: 2,
      }}>
        {config.badge}
      </div>

      {/* Title words animated */}
      <h1 style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px 24px',
        margin: 0,
        textAlign: 'center',
      }}>
        {words.map((word, index) => {
          const scale = spring({
            fps,
            frame: frame - index * 6 - 8,
            config: { damping: 12 },
          });
          return (
            <span key={index} style={{
              transform: `scale(${scale})`,
              display: 'inline-block',
              fontSize: words.length > 5 ? '72px' : '96px',
              color: 'white',
              fontWeight: 900,
              lineHeight: 1.1,
              textShadow: `0 0 40px ${config.color}55`,
              fontFamily: '"Inter", "Segoe UI", sans-serif',
            }}>
              {word}
            </span>
          );
        })}
      </h1>

      {/* Subtitle */}
      <div style={{
        opacity: spring({ fps, frame: frame - 20, config: { damping: 14 } }),
        fontSize: 24,
        color: COLORS.textMuted,
        fontWeight: 400,
        letterSpacing: 0.5,
      }}>
        {data?.videoType === 'comparison'
          ? `${data.toolA || ''} vs ${data.toolB || ''}`
          : data?.videoDesc?.slice(0, 60) + '...' || ''}
      </div>
    </AbsoluteFill>
  );
};
