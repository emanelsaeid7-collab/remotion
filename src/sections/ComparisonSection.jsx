import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, baseContainer } from '../styles';
import { AnimatedBG } from '../components/AnimatedBG';
import { AnimText, GlowBadge } from '../components/AnimText';

export const ComparisonSection = ({ data }) => {
  const frame = useCurrentFrame();
  const features = data.features || [];
  const pros = data.pros || {};
  const cons = data.cons || {};

  return (
    <div style={{ ...baseContainer }}>
      <AnimatedBG accentColor={COLORS.primary} />

      <div style={{ zIndex: 10, width: '100%', maxWidth: 1100, padding: '0 50px' }}>
        <AnimText delay={0} duration={15} style={{ marginBottom: 28, textAlign: 'center' }}>
          <GlowBadge color={COLORS.primary} delay={0}>⚖️ مقارنة</GlowBadge>
        </AnimText>

        {/* VS Header */}
        <AnimText delay={8} duration={18} style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: COLORS.accent }}>{data.toolA}</div>
            <div style={{
              fontSize: 22, fontWeight: 900, color: COLORS.textMuted,
              padding: '8px 20px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 100,
            }}>VS</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: COLORS.secondary }}>{data.toolB}</div>
          </div>
        </AnimText>

        {/* Features table */}
        {features.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {features.map((feat, i) => {
              const delay = 18 + i * 12;
              const progress = interpolate(frame, [delay, delay + 12], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });

              return (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  alignItems: 'center',
                  gap: 16,
                  opacity: progress,
                  transform: `translateY(${(1 - progress) * 20}px)`,
                }}>
                  {/* Tool A */}
                  <div style={{
                    background: `${COLORS.accent}18`,
                    border: `1px solid ${COLORS.accent}33`,
                    borderRadius: 12,
                    padding: '14px 20px',
                    textAlign: 'right',
                    fontSize: 17,
                    color: COLORS.text,
                  }}>
                    {feat.a}
                  </div>
                  {/* Feature label */}
                  <div style={{
                    fontSize: 12,
                    color: COLORS.textMuted,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    minWidth: 110,
                  }}>
                    {feat.label}
                  </div>
                  {/* Tool B */}
                  <div style={{
                    background: `${COLORS.secondary}18`,
                    border: `1px solid ${COLORS.secondary}33`,
                    borderRadius: 12,
                    padding: '14px 20px',
                    fontSize: 17,
                    color: COLORS.text,
                  }}>
                    {feat.b}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pros & Cons */}
        {(pros[data.toolA] || cons[data.toolA]) && (
          <AnimText delay={40} duration={15}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[data.toolA, data.toolB].map((tool, ti) => (
                <div key={ti} style={{
                  background: COLORS.bgGlass,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 16,
                  padding: '20px 24px',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: ti === 0 ? COLORS.accent : COLORS.secondary }}>
                    {tool}
                  </div>
                  {(pros[tool] || []).map((p, pi) => (
                    <div key={pi} style={{ fontSize: 15, color: COLORS.text, marginBottom: 6, display: 'flex', gap: 8 }}>
                      <span style={{ color: COLORS.success }}>✓</span> {p}
                    </div>
                  ))}
                  {(cons[tool] || []).map((c, ci) => (
                    <div key={ci} style={{ fontSize: 15, color: COLORS.textMuted, marginBottom: 6, display: 'flex', gap: 8 }}>
                      <span style={{ color: COLORS.danger }}>✗</span> {c}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </AnimText>
        )}
      </div>
    </div>
  );
};

export const WinnerSection = ({ data }) => {
  const frame = useCurrentFrame();
  const winnerProgress = interpolate(frame, [5, 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const glow = Math.sin(frame / 15) * 0.3 + 0.7;

  return (
    <div style={{ ...baseContainer }}>
      <AnimatedBG accentColor={COLORS.warning} />
      <div style={{ zIndex: 10, textAlign: 'center', padding: '0 60px' }}>
        <AnimText delay={0} duration={15} style={{ marginBottom: 24 }}>
          <GlowBadge color={COLORS.warning}>🏆 الفائز</GlowBadge>
        </AnimText>
        <div style={{
          fontSize: 100,
          marginBottom: 20,
          opacity: winnerProgress,
          transform: `scale(${0.5 + 0.5 * winnerProgress}) rotate(${(1 - winnerProgress) * -20}deg)`,
        }}>
          🏆
        </div>
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          color: COLORS.warning,
          opacity: winnerProgress,
          textShadow: `0 0 ${40 * glow}px ${COLORS.warning}`,
          marginBottom: 16,
        }}>
          {data.winner}
        </div>
        {data.winnerReason && (
          <AnimText delay={30} duration={15}>
            <div style={{ fontSize: 22, color: COLORS.textMuted, maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
              {data.winnerReason}
            </div>
          </AnimText>
        )}
      </div>
    </div>
  );
};
