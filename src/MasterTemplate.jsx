import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing, Img } from 'remotion';
import { CTASection } from './sections/CTASection';
import { COLORS, FONTS, SHADOWS, VIDEO_TYPE_ICONS, VIDEO_TYPE_LABELS, VIDEO_TYPE_GRADIENTS } from './styles';

const FPS = 30;

// ── Glass Card Component ────────────────────────────────────────────────────
const GlassCard = ({ children, style, accent }) => (
  <div style={{
    background: `linear-gradient(135deg, ${COLORS.bgGlass}, rgba(255,255,255,0.02))`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 28,
    padding: '48px 40px',
    maxWidth: 920,
    width: '100%',
    boxShadow: SHADOWS.card,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }}>
    {/* Top glow line */}
    <div style={{
      position: 'absolute',
      top: 0, left: 24, right: 24,
      height: 2,
      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
      borderRadius: 2,
      opacity: 0.6,
    }} />
    {children}
  </div>
);

// ── Step Indicator Pill ─────────────────────────────────────────────────────
const StepPill = ({ current, total, accent }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 12], [0.8, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.7)) });

  return (
    <div style={{
      transform: `scale(${scale})`,
      background: `linear-gradient(135deg, ${accent}20, ${COLORS.primary}15)`,
      border: `1.5px solid ${accent}40`,
      padding: '12px 32px',
      borderRadius: 100,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      zIndex: 10,
      boxShadow: `0 0 20px ${accent}20`,
    }}>
      {/* Dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            backgroundColor: i === current ? accent : COLORS.textDim,
            transition: 'all 0.3s ease',
            boxShadow: i === current ? `0 0 8px ${accent}` : 'none',
          }} />
        ))}
      </div>
      <span style={{
        fontFamily: FONTS.heading, fontSize: 15, fontWeight: 700,
        color: accent, letterSpacing: 2, textTransform: 'uppercase',
      }}>
        Step {current + 1} of {total}
      </span>
    </div>
  );
};

// ── Progress Bar ────────────────────────────────────────────────────────────
const ProgressBar = ({ currentScene, totalScenes, accent }) => {
  const progress = ((currentScene + 1) / totalScenes) * 100;
  return (
    <div style={{
      position: 'absolute',
      bottom: 50,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '75%',
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.06)',
      borderRadius: 100,
      overflow: 'hidden',
      zIndex: 50,
    }}>
      <div style={{
        width: `${progress}%`,
        height: '100%',
        background: `linear-gradient(90deg, ${accent}, ${COLORS.secondary})`,
        borderRadius: 100,
        boxShadow: `0 0 12px ${accent}50`,
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
};

// ── Type Badge ──────────────────────────────────────────────────────────────
const TypeBadge = ({ videoType }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 10], [-20, 0], { extrapolateRight: 'clamp' });

  const icon = VIDEO_TYPE_ICONS[videoType] || VIDEO_TYPE_ICONS.default;
  const label = VIDEO_TYPE_LABELS[videoType] || VIDEO_TYPE_LABELS.default;
  const gradient = VIDEO_TYPE_GRADIENTS[videoType] || VIDEO_TYPE_GRADIENTS.default;

  return (
    <div style={{
      position: 'absolute',
      top: 55,
      left: '50%',
      transform: `translateX(-50%) translateY(${translateY}px)`,
      opacity,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: `linear-gradient(135deg, ${gradient[0]}15, ${gradient[1]}10)`,
      border: `1.5px solid ${gradient[0]}30`,
      padding: '10px 24px',
      borderRadius: 100,
      backdropFilter: 'blur(12px)',
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{
        fontFamily: FONTS.heading, fontSize: 15, fontWeight: 700,
        color: gradient[0], letterSpacing: 1.5, textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  );
};

// ── Scene Slide ───────────────────────────────────────────────────────────────
const SceneSlide = ({ scene, index, total, videoType }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const slideUp = interpolate(frame, [0, 12], [60, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const scaleIn = interpolate(frame, [0, 12], [0.88, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) });

  const float = interpolate(frame, [0, fps * 2], [0, -8], { extrapolateRight: 'extend' });
  const floatCycle = Math.sin(float / 10) * 6;

  const gradient = VIDEO_TYPE_GRADIENTS[videoType] || VIDEO_TYPE_GRADIENTS.default;
  const accent = gradient[0];

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 50px 140px',
      flexDirection: 'column',
      gap: 40,
      fontFamily: FONTS.body,
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: `translateX(-50%) translateY(${floatCycle}px)`,
        width: 700,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}10 0%, ${COLORS.primary}06 40%, transparent 70%)`,
        filter: 'blur(80px)',
        zIndex: 1,
      }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
        backgroundSize: '50px 50px',
        zIndex: 1,
      }} />

      {/* Step pill */}
      <StepPill current={index} total={total} accent={accent} />

      {/* Content card */}
      <GlassCard accent={accent}>
        <h2 style={{
          margin: 0,
          fontSize: 52,
          fontWeight: 800,
          color: COLORS.text,
          lineHeight: 1.25,
          textAlign: 'center',
          fontFamily: FONTS.heading,
          letterSpacing: -0.5,
          textShadow: `0 2px 20px ${accent}20`,
        }}>
          {scene.title || scene.text || ''}
        </h2>

        {scene.detail && (
          <p style={{
            margin: '28px 0 0',
            fontSize: 24,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 1.6,
            fontWeight: 400,
          }}>
            {scene.detail}
          </p>
        )}

        {scene.searchTerms && Array.isArray(scene.searchTerms) && scene.searchTerms.length > 0 && (
          <div style={{
            marginTop: 36,
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {scene.searchTerms.map((tag, i) => (
              <span key={i} style={{
                fontSize: 14,
                color: accent,
                background: `${accent}12`,
                border: `1px solid ${accent}25`,
                padding: '8px 18px',
                borderRadius: 100,
                fontWeight: 600,
                fontFamily: FONTS.heading,
                boxShadow: `0 0 8px ${accent}10`,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Footer brand */}
      <div style={{
        opacity: fadeIn * 0.6,
        fontSize: 15,
        color: COLORS.textDim,
        fontWeight: 500,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        letterSpacing: 0.5,
      }}>
        <span>🚀</span>
        <span>SmartRemoteGigs</span>
        <span style={{ color: COLORS.textDim }}>•</span>
        <span>Work Smarter</span>
      </div>

      <ProgressBar currentScene={index} totalScenes={total} accent={accent} />
    </AbsoluteFill>
  );
};

// ── Master Template ─────────────────────────────────────────────────────────
export const MasterTemplate = ({ videoData }) => {
  const data = videoData || { videoType: 'fix', title: 'Example', solution: [] };

  const sceneTimings = data.sceneTimings || [];
  const scenes = data.scenes || data.solution || [];
  const ctaFrames = data.ctaDurFrames || 150;
  const videoType = data.videoType || 'fix';

  console.log("--- DIAGNOSTIC ---");
  console.log("sceneTimings:", sceneTimings.length);
  console.log("scenes:", scenes.length);
  console.log("audioDuration:", data.audioDuration);
  console.log("totalDurationFrames:", data.totalDurationFrames);
  console.log("videoType:", videoType);
  console.log("logoBase64:", data.logoBase64 ? `✅ ${data.logoBase64.length}` : '❌');
  console.log("------------------");

  let sections = [];

  if (sceneTimings.length > 0 && scenes.length > 0) {
    sceneTimings.forEach((timing, i) => {
      const scene = scenes[i] || scenes[scenes.length - 1];

      const startFrame = Math.round(timing.start * FPS);
      const endFrame = Math.round(timing.end * FPS);
      const durFrames = Math.max(endFrame - startFrame, 1);

      console.log(`[scene ${i + 1}] start=${timing.start}s(${startFrame}f) end=${timing.end}s(${endFrame}f) dur=${durFrames}f`);

      sections.push({
        component: (
          <>
            <TypeBadge videoType={videoType} />
            <SceneSlide scene={scene} index={i} total={sceneTimings.length} videoType={videoType} />
          </>
        ),
        from: startFrame,
        duration: durFrames,
      });
    });
  } else {
    const totalFrames = data.totalDurationFrames || 900;
    const contentFrames = totalFrames - ctaFrames;
    const perScene = Math.floor(contentFrames / Math.max(scenes.length, 1));

    scenes.forEach((scene, i) => {
      sections.push({
        component: (
          <>
            <TypeBadge videoType={videoType} />
            <SceneSlide scene={scene} index={i} total={scenes.length} videoType={videoType} />
          </>
        ),
        from: i * perScene,
        duration: perScene,
      });
    });
  }

  let ctaStartFrame = 0;
  if (sections.length > 0) {
    const lastSection = sections[sections.length - 1];
    ctaStartFrame = lastSection.from + lastSection.duration;
  } else {
    ctaStartFrame = (data.totalDurationFrames || 900) - ctaFrames;
  }

  console.log(`[CTA] startFrame=${ctaStartFrame}, duration=${ctaFrames}`);

  sections.push({
    component: (
      <>
        <TypeBadge videoType={videoType} />
        <CTASection data={data} />
      </>
    ),
    from: ctaStartFrame,
    duration: ctaFrames,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, color: COLORS.text, fontFamily: FONTS.body }}>
      {sections.map((sec, i) => (
        <Sequence key={i} from={sec.from} durationInFrames={sec.duration}>
          <AbsoluteFill>{sec.component}</AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const getTotalDuration = (data) => {
  if (!data) return 900;

  const ctaFrames = data.ctaDurFrames || 150;

  if (data.sceneTimings && data.sceneTimings.length > 0) {
    const lastTiming = data.sceneTimings[data.sceneTimings.length - 1];
    const scenesDurationFrames = Math.round(lastTiming.end * FPS);
    return scenesDurationFrames + ctaFrames;
  }

  const steps = data.steps || [];
  switch (data.videoType) {
    case 'workflow':
    case 'automation':
      return (steps.length + 1) * 150 + 150;
    default:
      return data.totalDurationFrames || 900;
  }
};
