import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing, Img } from 'remotion';
import { CTASection } from './sections/CTASection';
import { COLORS, FONTS, SHADOWS, VIDEO_TYPE_ICONS, VIDEO_TYPE_LABELS, VIDEO_TYPE_GRADIENTS } from './styles';

const FPS = 30;

// ── Single Scene Renderer ─────────────────────────────────────────────────────
const SceneSlide = ({ scene, index, total, videoType }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const slideUp = interpolate(frame, [0, 12], [50, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const scaleIn = interpolate(frame, [0, 12], [0.92, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) });

  const float = interpolate(frame, [0, fps * 2], [0, -8], { extrapolateRight: 'extend' });
  const floatCycle = Math.sin(float / 10) * 5;

  const gradient = VIDEO_TYPE_GRADIENTS[videoType] || VIDEO_TYPE_GRADIENTS.default;
  const accent = gradient[0];

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center',
      padding: '100px 60px 120px', flexDirection: 'column', gap: 36,
      fontFamily: FONTS.body,
    }}>
      <div style={{
        position: 'absolute', top: '15%', left: '50%',
        transform: `translateX(-50%) translateY(${floatCycle}px)`,
        width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}12 0%, ${COLORS.secondary}08 50%, transparent 70%)`,
        filter: 'blur(60px)', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
        backgroundSize: '60px 60px', opacity: 0.3, zIndex: 1,
      }} />

      <div style={{
        opacity: fadeIn, transform: `scale(${scaleIn})`,
        background: `linear-gradient(135deg, ${accent}, ${gradient[1]})`,
        color: COLORS.white, padding: '10px 28px', borderRadius: 100,
        fontSize: 15, fontWeight: 800, letterSpacing: 2, zIndex: 10,
        boxShadow: SHADOWS.md, fontFamily: FONTS.heading,
      }}>STEP {index + 1} / {total}</div>

      <div style={{
        opacity: fadeIn, transform: `translateY(${slideUp}px)`,
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 24, padding: '48px 44px', maxWidth: 880, width: '100%',
        boxShadow: SHADOWS.lg, zIndex: 10, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`,
        }} />
        <h2 style={{
          margin: 0, fontSize: 48, fontWeight: 800, color: COLORS.text,
          lineHeight: 1.25, textAlign: 'center', fontFamily: FONTS.heading, letterSpacing: -0.5,
        }}>{scene.title || scene.text || ''}</h2>
        {scene.detail && (
          <p style={{
            margin: '24px 0 0', fontSize: 22, color: COLORS.muted,
            textAlign: 'center', lineHeight: 1.6, fontWeight: 400,
          }}>{scene.detail}</p>
        )}
        {scene.searchTerms && Array.isArray(scene.searchTerms) && scene.searchTerms.length > 0 && (
          <div style={{ marginTop: 32, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {scene.searchTerms.map((tag, i) => (
              <span key={i} style={{
                fontSize: 14, color: accent, background: `${accent}12`,
                border: `1px solid ${accent}25`, padding: '6px 16px',
                borderRadius: 100, fontWeight: 600, fontFamily: FONTS.heading,
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div style={{
        opacity: fadeIn * 0.7, fontSize: 16, color: COLORS.muted,
        fontWeight: 500, zIndex: 10, marginTop: 8,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>🚀</span><span>SmartRemoteGigs • Work Smarter</span>
      </div>
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
  console.log("sceneTimings count:", sceneTimings.length);
  console.log("scenes count:", scenes.length);
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
        component: <SceneSlide scene={scene} index={i} total={sceneTimings.length} videoType={videoType} />,
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
        component: <SceneSlide scene={scene} index={i} total={scenes.length} videoType={videoType} />,
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
    component: <CTASection data={data} />,
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
