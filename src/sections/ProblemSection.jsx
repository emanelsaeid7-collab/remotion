import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, baseContainer } from '../styles';
import { AnimatedBG } from '../components/AnimatedBG';
import { AnimText, GlowBadge } from '../components/AnimText';

export const ProblemSection = ({ data }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ ...baseContainer }}>
      <AnimatedBG accentColor={COLORS.danger} />

      <div style={{ zIndex: 10, width: '100%', maxWidth: 1000, padding: '0 60px' }}>
        <AnimText delay={0} duration={15} style={{ marginBottom: 30 }}>
          <GlowBadge color={COLORS.danger} delay={0}>🚨 المشكلة</GlowBadge>
        </AnimText>

        {/* Problem card */}
        <AnimText delay={10} duration={20} from={{ opacity: 0, y: 40 }}>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.danger}15, ${COLORS.bgCard})`,
            border: `1px solid ${COLORS.danger}44`,
            borderRadius: 20,
            padding: '40px 50px',
            marginBottom: 30,
            boxShadow: `0 20px 60px ${COLORS.danger}15`,
          }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>😤</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
              {data.title}
            </div>
            <div style={{ fontSize: 22, color: COLORS.textMuted, lineHeight: 1.6 }}>
              {data.problem}
            </div>
          </div>
        </AnimText>

        {/* Cause card */}
        {data.cause && (
          <AnimText delay={25} duration={20} from={{ opacity: 0, y: 40 }}>
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.warning}15, ${COLORS.bgCard})`,
              border: `1px solid ${COLORS.warning}44`,
              borderRadius: 20,
              padding: '30px 50px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 20,
            }}>
              <div style={{ fontSize: 36 }}>🔍</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.warning, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>السبب</div>
                <div style={{ fontSize: 22, color: COLORS.textMuted, lineHeight: 1.6 }}>
                  {data.cause}
                </div>
              </div>
            </div>
          </AnimText>
        )}
      </div>
    </div>
  );
};
