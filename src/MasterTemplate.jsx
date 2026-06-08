import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { CTASection } from './sections/CTASection';
import { COLORS, VIDEO_TYPE_GRADIENTS } from './styles';

const FPS = 30;

// ── Scene Colors ────────────────────────────────────────────────────────────
const SCENE_COLORS = ['#6C63FF', '#43E97B', '#38F9D7', '#FF6584', '#FFB347', '#7C3AED', '#06B6D4'];

// ── Scene Slide ───────────────────────────────────────────────────────────
const SceneSlide = ({ scene, index, total, videoType }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', 
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp', 
    extrapolateRight: 'clamp',
  });

  const gradient = VIDEO_TYPE_GRADIENTS[videoType] || VIDEO_TYPE_GRADIENTS.default;
  const accent = gradient[0];
  const sceneColor = SCENE_COLORS[index % SCENE_COLORS.length];

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '100px 60px 140px',
      flexDirection: 'column',
      gap: 36,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '10%',
        width: 500, height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}15 0%, transparent 70%)`,
        opacity: fadeOut,
      }} />

      {/* Step Button / Pill */}
      <div style={{
        opacity: progress,
        transform: `scale(${0.8 + 0.2 * progress})`,
        background: `linear-gradient(135deg, ${sceneColor}22, ${accent}22)`,
        border: `2px solid ${sceneColor}66`,
        color: sceneColor,
        padding: '12px 32px',
        borderRadius: 100,
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: 2,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: `0 0 20px ${sceneColor}30`,
      }}>
        <span style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${sceneColor}, ${accent})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 14,
          fontWeight: 800,
        }}>
          {index + 1}
        </span>
        <span>STEP {index + 1} / {total}</span>
      </div>

      {/* Scene Title */}
      <div style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * 40}px)`,
        fontSize: 52,
        fontWeight: 800,
        color: COLORS.text,
        textAlign: 'center',
        lineHeight: 1.3,
        zIndex: 10,
        fontFamily: '"Inter", "Segoe UI", sans-serif',
        textShadow: `0 0 40px ${accent}44`,
        maxWidth: 900,
      }}>
        {scene.title || scene.text || ''}
      </div>

      {/* Scene Detail / Subtitle */}
      {scene.detail && (
        <div style={{
          opacity: progress * 0.8,
          fontSize: 24,
          color: COLORS.textMuted,
          textAlign: 'center',
          lineHeight: 1.5,
          zIndex: 10,
          maxWidth: 800,
          padding: '0 20px',
        }}>
          {scene.detail}
        </div>
      )}

      {/* Search terms as tags */}
      {scene.searchTerms && Array.isArray(scene.searchTerms) && scene.searchTerms.length > 0 && (
        <div style={{
          opacity: progress * 0.6,
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          zIndex: 10,
          maxWidth: 800,
        }}>
          {scene.searchTerms.map((tag, i) => (
            <span key={i} style={{
              fontSize: 14,
              color: accent,
              background: `${accent}15`,
              border: `1px solid ${accent}40`,
              padding: '6px 16px',
              borderRadius: 100,
              fontWeight: 600,
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom brand */}
      <div style={{
        opacity: progress * 0.5,
        fontSize: 16,
        color: COLORS.textMuted,
        fontWeight: 500,
        zIndex: 10,
        position: 'absolute',
        bottom: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span>🚀</span>
        <span>SmartRemoteGigs</span>
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
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
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
