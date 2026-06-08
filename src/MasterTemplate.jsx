import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { CTASection } from './sections/CTASection';
import { COLORS, FONTS, SHADOWS, VIDEO_TYPE_GRADIENTS, VIDEO_TYPE_ICONS, VIDEO_TYPE_LABELS } from './styles';

const FPS = 30;

// ── Animated Gradient Background ────────────────────────────────────────────
const AnimatedGradient = ({ colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = (frame % (fps * 8)) / (fps * 8); // 8-second cycle
  const angle = 135 + Math.sin(t * Math.PI * 2) * 45;
  const scale = 1 + Math.sin(t * Math.PI * 2) * 0.15;
  const opacity = 0.15 + Math.sin(t * Math.PI * 2) * 0.05;

  return (
    <div style={{
      position: 'absolute',
      inset: -100,
      background: `linear-gradient(${angle}deg, ${colors[0]}40, ${colors[1]}30, ${COLORS.bg} 70%)`,
      transform: `scale(${scale})`,
      opacity,
      filter: 'blur(60px)',
      zIndex: 0,
    }} />
  );
};

// ── Floating Orbs ───────────────────────────────────────────────────────────
const FloatingOrbs = ({ color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 120) % (fps * 12)) / (fps * 12);
        const x = 20 + Math.sin(t * Math.PI * 2 + i * 2) * 30;
        const y = 20 + Math.cos(t * Math.PI * 2 + i * 3) * 25;
        const size = 200 + i * 100;

        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}${15 + i * 5} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            zIndex: 1,
            transform: `translate(-50%, -50%)`,
          }} />
        );
      })}
    </>
  );
};

// ── Grid Lines ──────────────────────────────────────────────────────────────
const GridLines = () => (
  <div style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    zIndex: 1,
  }} />
);

// ── Step Badge ───────────────────────────────────────────────────────────────
const StepBadge = ({ current, total, color }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 15], [0.6, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.7)) });

  return (
    <div style={{
      transform: `scale(${scale})`,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      zIndex: 10,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: `linear-gradient(135deg, ${color}, ${COLORS.secondary})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, fontWeight: 800, color: COLORS.text,
        boxShadow: `0 8px 24px ${color}50`,
        fontFamily: FONTS.heading,
      }}>
        {current + 1}
      </div>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <span style={{
          fontFamily: FONTS.heading, fontSize: 13, fontWeight: 700,
          color: COLORS.textMuted, letterSpacing: 2, textTransform: 'uppercase',
        }}>
          Step {current + 1} of {total}
        </span>
        <div style={{
          width: 80, height: 4, borderRadius: 2,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${((current + 1) / total) * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${COLORS.secondary})`,
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
    </div>
  );
};

// ── Content Card ────────────────────────────────────────────────────────────
const ContentCard = ({ children, color }) => (
  <div style={{
    background: `linear-gradient(135deg, ${COLORS.bgCard}, rgba(255,255,255,0.01))`,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 32,
    padding: '52px 44px',
    maxWidth: 900,
    width: '100%',
    boxShadow: SHADOWS.card,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 10,
  }}>
    {/* Glow line top */}
    <div style={{
      position: 'absolute',
      top: 0, left: 40, right: 40,
      height: 3,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      borderRadius: 3,
      opacity: 0.5,
    }} />
    {children}
  </div>
);

// ── Scene Slide ─────────────────────────────────────────────────────────────
const SceneSlide = ({ scene, index, total, videoType }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const slideUp = interpolate(frame, [0, 14], [80, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const scaleIn = interpolate(frame, [0, 14], [0.85, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) });

  const gradient = VIDEO_TYPE_GRADIENTS[videoType] || VIDEO_TYPE_GRADIENTS.default;
  const color = gradient[0];

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '140px 48px 160px',
      flexDirection: 'column',
      gap: 44,
      fontFamily: FONTS.body,
    }}>
      <AnimatedGradient colors={gradient} />
      <FloatingOrbs color={color} />
      <GridLines />

      <div style={{
        opacity: fadeIn,
        transform: `translateY(${slideUp}px) scale(${scaleIn})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 44,
        zIndex: 10,
        width: '100%',
        maxWidth: 920,
      }}>
        <StepBadge current={index} total={total} color={color} />

        <ContentCard color={color}>
          <h2 style={{
            margin: 0,
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.text,
            lineHeight: 1.2,
            textAlign: 'center',
            fontFamily: FONTS.heading,
            letterSpacing: -1,
            textShadow: `0 4px 30px ${color}30`,
          }}>
            {scene.title || scene.text || ''}
          </h2>

          {scene.detail && (
            <p style={{
              margin: '32px 0 0',
              fontSize: 26,
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
              marginTop: 40,
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              {scene.searchTerms.map((tag, i) => (
                <span key={i} style={{
                  fontSize: 15,
                  color: color,
                  background: `${color}12`,
                  border: `1.5px solid ${color}30`,
                  padding: '10px 20px',
                  borderRadius: 100,
                  fontWeight: 600,
                  fontFamily: FONTS.heading,
                  boxShadow: `0 0 12px ${color}15`,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </ContentCard>

        <div style={{
          opacity: fadeIn * 0.5,
          fontSize: 15,
          color: COLORS.textDim,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          letterSpacing: 0.5,
        }}>
          <span style={{ fontSize: 18 }}>🚀</span>
          <span>SmartRemoteGigs</span>
          <span style={{ color: COLORS.textDim }}>•</span>
          <span>Work Smarter</span>
        </div>
      </div>
    </AbsoluteFill>
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

// ── Master Template ───────────────────────────────────────────────────────
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
    return Math.round(lastTiming.end * FPS) + ctaFrames;
  }
  return data.totalDurationFrames || 900;
};
