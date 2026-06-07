import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, baseContainer } from '../styles';
import { AnimatedBG } from '../components/AnimatedBG';
import { AnimText, GlowBadge } from '../components/AnimText';

const TYPE_CONFIG = {
  fix: { label: '🔧 Quick Fix', color: COLORS.accent, emoji: '⚡' },
  comparison: { label: '⚖️ Comparison', color: COLORS.primary, emoji: '🆚' },
  workflow: { label: '🔄 Workflow', color: COLORS.accentBlue, emoji: '🚀' },
};

export const HookSection = ({ data }) => {
  const frame = useCurrentFrame();
  const config = TYPE_CONFIG[data.videoType] || TYPE_CONFIG.fix;

  const titleText =
    data.videoType === 'fix' ? data.title :
    data.videoType === 'comparison' ? `${data.toolA} vs ${data.toolB}` :
    data.workflowName;

  const subtitleText =
    data.videoType === 'fix' ? 'مشكلة شائعة — حل سريع' :
    data.videoType === 'comparison' ? 'أيهما الأفضل لك؟' :
    'أتمتة خطوة بخطوة';

  // Typewriter effect for title
  const charCount = Math.floor(interpolate(frame, [20, 60], [0, titleText.length], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));

  return (
    <div style={{ ...baseContainer }}>
      <AnimatedBG accentColor={config.color} />

      {/* Center content */}
      <div style={{ textAlign: 'center', zIndex: 10, padding: '0 80px', maxWidth: 900 }}>
        <AnimText delay={0} duration={15} style={{ marginBottom: 24 }}>
          <GlowBadge color={config.color} delay={0}>
            {config.label}
          </GlowBadge>
        </AnimText>

        {/* Typewriter title */}
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: 20,
          color: COLORS.text,
          minHeight: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textShadow: `0 0 40px ${config.color}55`,
        }}>
          {titleText.slice(0, charCount)}
          {charCount < titleText.length && (
            <span style={{
              display: 'inline-block',
              width: 4,
              height: 70,
              background: config.color,
              marginLeft: 4,
              opacity: Math.sin(frame / 8) > 0 ? 1 : 0,
              borderRadius: 2,
            }} />
          )}
        </div>

        <AnimText delay={65} duration={20} from={{ opacity: 0, y: 20 }}>
          <div style={{
            fontSize: 26,
            color: COLORS.textMuted,
            fontWeight: 400,
            letterSpacing: 0.5,
          }}>
            {subtitleText}
          </div>
        </AnimText>

        {/* Emoji floating */}
        <AnimText delay={70} duration={15} from={{ opacity: 0, scale: 0.3 }} to={{ opacity: 1, scale: 1 }}>
          <div style={{
            fontSize: 50,
            marginTop: 30,
            filter: `drop-shadow(0 0 20px ${config.color})`,
          }}>
            {config.emoji}
          </div>
        </AnimText>
      </div>
    </div>
  );
};
