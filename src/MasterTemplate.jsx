import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { CTASection } from './sections/CTASection';
import { COLORS } from './styles';

const FPS = 30;

// ── Single Scene Renderer ─────────────────────────────────────────────────────
const SceneSlide = ({ scene, index, total }) => {
  const frame = useCurrentFrame();
  
  // Animation: fade in + slide up (first 15 frames of the scene)
  const progress = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', 
    extrapolateRight: 'clamp',
  });
  
  const fadeOut = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp', 
    extrapolateRight: 'clamp',
  });

  const colors = ['#6C63FF', '#43E97B', '#38F9D7', '#FF6584', '#FFB347'];
  const accent = colors[index % colors.length];

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS?.bg || '#0f172a',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 60px',
      flexDirection: 'column',
      gap: 32,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '10%',
        width: 500, height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
        opacity: fadeOut,
      }} />

      {/* Scene number */}
      <div style={{
        opacity: progress,
        transform: `scale(${0.8 + 0.2 * progress})`,
        background: `${accent}22`,
        border: `1px solid ${accent}66`,
        color: accent,
        padding: '8px 24px',
        borderRadius: 100,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: 2,
        zIndex: 10,
      }}>
        {index + 1} / {total}
      </div>

      {/* Scene text */}
      <div style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * 40}px)`,
        fontSize: 52,
        fontWeight: 800,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 1.3,
        zIndex: 10,
        fontFamily: '"Inter", "Segoe UI", sans-serif',
        textShadow: `0 0 40px ${accent}44`,
        maxWidth: 900,
      }}>
        {scene.title || scene.text || ''}
      </div>

      {/* Search terms as subtle tags */}
      {scene.detail && (
        <div style={{
          opacity: progress * 0.5,
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          zIndex: 10,
        }}>
          {scene.detail.split(',').map((tag, i) => (
            <span key={i} style={{
              fontSize: 14,
              color: accent,
              background: `${accent}15`,
              padding: '4px 12px',
              borderRadius: 100,
            }}>
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Master Template ───────────────────────────────────────────────────────────
export const MasterTemplate = ({ videoData }) => {
  const data = videoData || { videoType: 'fix', title: 'Example', solution: [] };

  const sceneTimings = data.sceneTimings || [];
  const scenes = data.scenes || data.solution || [];
  const ctaFrames = data.ctaDurFrames || 150;

  // ✅ Diagnostic logs
  console.log("--- DIAGNOSTIC ---");
  console.log("sceneTimings count:", sceneTimings.length);
  console.log("scenes count:", scenes.length);
  console.log("audioDuration:", data.audioDuration);
  console.log("totalDurationFrames:", data.totalDurationFrames);
  console.log("------------------");

  let sections = [];

  if (sceneTimings.length > 0 && scenes.length > 0) {
    sceneTimings.forEach((timing, i) => {
      const scene = scenes[i] || scenes[scenes.length - 1];
      
      // ✅ استخدم التوقيتات المُعدّلة مباشرة بدون visualOffset تراكمي
      const startFrame = Math.round(timing.start * FPS);
      const endFrame = Math.round(timing.end * FPS);
      const durFrames = Math.max(endFrame - startFrame, 1);

      console.log(`[scene ${i + 1}] start=${timing.start}s(${startFrame}f) end=${timing.end}s(${endFrame}f) dur=${durFrames}f`);

      sections.push({
        component: <SceneSlide scene={scene} index={i} total={sceneTimings.length} />,
        from: startFrame,
        duration: durFrames,
      });
    });
  } else {
    // Fallback: divide equally
    const totalFrames = data.totalDurationFrames || 900;
    const contentFrames = totalFrames - ctaFrames;
    const perScene = Math.floor(contentFrames / Math.max(scenes.length, 1));

    scenes.forEach((scene, i) => {
      sections.push({
        component: <SceneSlide scene={scene} index={i} total={scenes.length} />,
        from: i * perScene,
        duration: perScene,
      });
    });
  }

  // CTA starts right after last scene
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
    <AbsoluteFill style={{ backgroundColor: '#0f172a', color: 'white' }}>
      {sections.map((sec, i) => (
        <Sequence key={i} from={sec.from} durationInFrames={sec.duration}>
          <AbsoluteFill>{sec.component}</AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ── Duration Calculator ──────────────────────────────────────────────────────
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
