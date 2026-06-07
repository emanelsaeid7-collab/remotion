import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COLORS, baseContainer } from '../styles';
import { AnimatedBG } from '../components/AnimatedBG';
import { AnimText, GlowBadge } from '../components/AnimText';

const STEP_COLORS = [COLORS.primary, COLORS.accent, COLORS.accentBlue, COLORS.secondary, COLORS.warning];

export const WorkflowOverview = ({ data }) => {
  const frame = useCurrentFrame();
  const steps = data.steps || [];

  return (
    <div style={{ ...baseContainer }}>
      <AnimatedBG accentColor={COLORS.accentBlue} />
      <div style={{ zIndex: 10, width: '100%', maxWidth: 1000, padding: '0 60px' }}>
        <AnimText delay={0} duration={15} style={{ marginBottom: 24, textAlign: 'center' }}>
          <GlowBadge color={COLORS.accentBlue}>🔄 نظرة عامة</GlowBadge>
        </AnimText>

        <AnimText delay={8} duration={15} style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 44, fontWeight: 900 }}>{data.workflowName}</div>
        </AnimText>

        {/* Pipeline visualization */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
          {steps.map((step, i) => {
            const delay = 15 + i * 12;
            const progress = interpolate(frame, [delay, delay + 12], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const color = STEP_COLORS[i % STEP_COLORS.length];
            const label = typeof step === 'string' ? step : step.name;

            return (
              <React.Fragment key={i}>
                <div style={{
                  background: `${color}22`,
                  border: `2px solid ${color}`,
                  borderRadius: 12,
                  padding: '16px 22px',
                  textAlign: 'center',
                  minWidth: 130,
                  opacity: progress,
                  transform: `scale(${0.7 + 0.3 * progress})`,
                  boxShadow: `0 0 20px ${color}33`,
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{step.icon || '⚙️'}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{label}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    fontSize: 22,
                    color: COLORS.textMuted,
                    margin: '0 8px',
                    opacity: progress,
                  }}>→</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const WorkflowStepSection = ({ data, stepIndex }) => {
  const frame = useCurrentFrame();
  const steps = data.steps || [];
  const step = steps[stepIndex];
  if (!step) return null;

  const color = STEP_COLORS[stepIndex % STEP_COLORS.length];
  const label = typeof step === 'string' ? step : step.name;
  const detail = typeof step === 'object' ? step.detail : null;
  const tool = typeof step === 'object' ? step.tool : null;
  const inputs = typeof step === 'object' ? step.inputs : null;
  const outputs = typeof step === 'object' ? step.outputs : null;

  return (
    <div style={{ ...baseContainer }}>
      <AnimatedBG accentColor={color} />

      <div style={{ zIndex: 10, width: '100%', maxWidth: 1000, padding: '0 60px' }}>
        <AnimText delay={0} duration={12} style={{ marginBottom: 24 }}>
          <GlowBadge color={color}>خطوة {stepIndex + 1} من {steps.length}</GlowBadge>
        </AnimText>

        {/* Main step card */}
        <AnimText delay={8} duration={18} from={{ opacity: 0, y: 40 }}>
          <div style={{
            background: `linear-gradient(135deg, ${color}18, ${COLORS.bgCard})`,
            border: `1px solid ${color}55`,
            borderRadius: 24,
            padding: '36px 44px',
            marginBottom: 20,
            boxShadow: `0 20px 60px ${color}15`,
          }}>
            <div style={{ fontSize: 50, marginBottom: 14 }}>{step.icon || '⚙️'}</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: COLORS.text, marginBottom: 10 }}>{label}</div>
            {detail && (
              <div style={{ fontSize: 20, color: COLORS.textMuted, lineHeight: 1.7 }}>{detail}</div>
            )}
            {tool && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 14,
                padding: '6px 16px',
                background: `${color}22`,
                borderRadius: 100,
                fontSize: 14,
                color,
                fontWeight: 600,
              }}>
                🛠️ {tool}
              </div>
            )}
          </div>
        </AnimText>

        {/* Inputs / Outputs */}
        {(inputs || outputs) && (
          <AnimText delay={22} duration={15}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {inputs && (
                <div style={{ background: COLORS.bgGlass, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '18px 24px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>📥 المدخلات</div>
                  {inputs.map((inp, ii) => (
                    <div key={ii} style={{ fontSize: 16, color: COLORS.text, marginBottom: 6 }}>• {inp}</div>
                  ))}
                </div>
              )}
              {outputs && (
                <div style={{ background: COLORS.bgGlass, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '18px 24px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>📤 المخرجات</div>
                  {outputs.map((out, oi) => (
                    <div key={oi} style={{ fontSize: 16, color: COLORS.text, marginBottom: 6 }}>• {out}</div>
                  ))}
                </div>
              )}
            </div>
          </AnimText>
        )}
      </div>
    </div>
  );
};
