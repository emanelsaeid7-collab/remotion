import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, baseContainer } from '../styles';
import { AnimatedBG } from '../components/AnimatedBG';
import { AnimText, GlowBadge } from '../components/AnimText';

export const SolutionSection = ({ data }) => {
  const frame = useCurrentFrame();
  const steps = data.solution || [];

  return (
    <div style={{ ...baseContainer }}>
      <AnimatedBG accentColor={COLORS.accent} />
      <div style={{ zIndex: 10, width: '100%', maxWidth: 1000, padding: '0 60px' }}>

        <AnimText delay={0} duration={15} style={{ marginBottom: 30 }}>
          <GlowBadge color={COLORS.accent} delay={0}>✅ The Fix</GlowBadge>
        </AnimText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {steps.map((step, i) => {
            const stepDelay = 10 + i * 15;
            const progress = interpolate(frame, [stepDelay, stepDelay + 15], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });

            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                background: COLORS.bgGlass,
                border: `1px solid ${COLORS.accent}${Math.floor(progress * 88).toString(16).padStart(2, '0')}`,
                borderRadius: 16,
                padding: '20px 30px',
                opacity: progress,
                transform: `translateX(${(1 - progress) * -40}px)`,
                boxShadow: progress > 0.5 ? `0 0 30px ${COLORS.accent}18` : 'none',
              }}>
                {/* Step number */}
                <div style={{
                  minWidth: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentBlue})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 900,
                  color: COLORS.bg,
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>

                {/* Step text */}
                <div style={{
                  fontSize: 19,
                  color: COLORS.text,
                  lineHeight: 1.65,
                  paddingTop: 8,
                  fontFamily: '"Inter", "Segoe UI", sans-serif',
                }}>
                  {typeof step === 'string' ? step : (
                    <>
                      <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 20 }}>
                        {step.title}
                      </div>
                      {step.detail && (
                        <div style={{ color: COLORS.textMuted, fontSize: 15 }}>
                          {step.detail}
                        </div>
                      )}
                      {step.code && (
                        <div style={{
                          background: '#1A1A2E',
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 8,
                          padding: '8px 16px',
                          marginTop: 8,
                          fontFamily: '"Fira Code", monospace',
                          fontSize: 14,
                          color: COLORS.accent,
                        }}>
                          {step.code}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
