import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, baseContainer } from '../styles';
import { AnimatedBG } from '../components/AnimatedBG';
import { AnimText, GlowBadge } from '../components/AnimText';

export const CTASection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaText = data.cta?.text || 'تابعني للمزيد من المحتوى التقني!';
  const ctaEmoji = data.cta?.emoji || '🚀';
  const ctaHandle = data.cta?.handle || '@yourhandle';

  const bounce = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  const glow = Math.sin(frame / 20) * 0.4 + 0.6;

  return (
    <div style={{ ...baseContainer }}>
      <AnimatedBG accentColor={COLORS.primary} />

      {/* Particle burst */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = interpolate(frame, [0, 40], [0, 200], { extrapolateRight: 'clamp' });
        const fadeOut = interpolate(frame, [30, 60], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: [COLORS.primary, COLORS.accent, COLORS.secondary, COLORS.accentBlue][i % 4],
            transform: `translate(${Math.cos(angle) * dist - 5}px, ${Math.sin(angle) * dist - 5}px)`,
            opacity: fadeOut,
          }} />
        );
      })}

      <div style={{ zIndex: 10, textAlign: 'center', padding: '0 80px', maxWidth: 900 }}>
        {/* Emoji */}
        <div style={{
          fontSize: 80,
          marginBottom: 20,
          transform: `scale(${bounce})`,
          filter: `drop-shadow(0 0 30px ${COLORS.primary})`,
        }}>
          {ctaEmoji}
        </div>

        {/* Main CTA text */}
        <AnimText delay={10} duration={20} from={{ opacity: 0, y: 30 }}>
          <div style={{
            fontSize: 48,
            fontWeight: 900,
            color: COLORS.text,
            lineHeight: 1.2,
            marginBottom: 20,
            textShadow: `0 0 ${30 * glow}px ${COLORS.primary}66`,
          }}>
            {ctaText}
          </div>
        </AnimText>

        {/* Handle */}
        <AnimText delay={25} duration={15}>
          <div style={{
            display: 'inline-block',
            fontSize: 30,
            fontWeight: 800,
            color: COLORS.primary,
            padding: '12px 36px',
            background: `${COLORS.primary}18`,
            border: `2px solid ${COLORS.primary}`,
            borderRadius: 100,
            boxShadow: `0 0 ${20 * glow}px ${COLORS.primary}44`,
          }}>
            {ctaHandle}
          </div>
        </AnimText>

        {/* Action buttons */}
        <AnimText delay={35} duration={15} style={{ marginTop: 30 }}>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['❤️ Like', '🔔 Subscribe', '💬 Comment'].map((btn, i) => (
              <div key={i} style={{
                padding: '10px 24px',
                background: COLORS.bgGlass,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 100,
                fontSize: 18,
                color: COLORS.textMuted,
                fontWeight: 600,
              }}>
                {btn}
              </div>
            ))}
          </div>
        </AnimText>
      </div>
    </div>
  );
};
