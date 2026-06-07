import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { CTASection } from './sections/CTASection';
import { COLORS, FONTS, SHADOWS, VIDEO_TYPE_ICONS, VIDEO_TYPE_LABELS, VIDEO_TYPE_GRADIENTS } from './styles';

const FPS = 30;

// ── Helper: Progress Bar ────────────────────────────────────────────────────
const ProgressBar = ({ currentScene, totalScenes, progress, accent }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: 60,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '70%',
      height: 6,
      backgroundColor: COLORS.border,
      borderRadius: 100,
      overflow: 'hidden',
      zIndex: 50,
    }}>
      <div style={{
        width: `${progress}%`,
        height: '100%',
        background: `linear-gradient(90deg, ${accent}, ${COLORS.secondary})`,
        borderRadius: 100,
        transition: 'width 0.1s linear',
      }} />
      {/* Scene dots */}
      <div style={{
        position: 'absolute',
        top: -5,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 2px',
      }}>
        {Array.from({ length: totalScenes }).map((_, i) => (
          <div key={i} style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: i <= currentScene ? accent : COLORS.border,
            border: `2px solid ${COLORS.white}`,
            boxShadow: i === currentScene ? `0 0 0 3px ${accent}40` : 'none',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  );
};

// ── Helper: Type Badge ─────────────────────────────────────────────────────────
const TypeBadge = ({ videoType, delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 10], [-20, 0], { extrapolateRight: 'clamp' });

  const icon = VIDEO_TYPE_ICONS[videoType] || VIDEO_TYPE_ICONS.default;
  const label = VIDEO_TYPE_LABELS[videoType] || VIDEO_TYPE_LABELS.default;
  const gradient = VIDEO_TYPE_GRADIENTS[videoType] || VIDEO_TYPE_GRADIENTS.default;

  return (
    <div style={{
      position: 'absolute',
      top: 50,
      left: '50%',
      transform: `translateX(-50%) translateY(${translateY}px)`,
      opacity,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: `linear-gradient(135deg, ${gradient[0]}15, ${gradient[1]}15)`,
      border: `1.5px solid ${gradient[0]}30`,
      padding: '10px 24px',
      borderRadius: 100,
      backdropFilter: 'blur(10px)',
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{
        fontFamily: FONTS.heading,
        fontSize: 16,
        fontWeight: 700,
        color: gradient[0],
        letterSpacing: 1.5,
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  );
};

// ── Single Scene Renderer ───────────────────────────────────────────────────────
const SceneSlide = ({ scene, index, total, videoType, sceneDuration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timings
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const slideUp = interpolate(frame, [0, 12], [50, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const scaleIn = interpolate(frame, [0, 12], [0.92, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) });

  // Subtle float animation
  const float = interpolate(frame, [0, fps * 2], [0, -8], { extrapolateRight: 'extend' });
  const floatCycle = Math.sin(float / 10) * 5;

  const gradient = VIDEO_TYPE_GRADIENTS[videoType] || VIDEO_TYPE_GRADIENTS.default;
  const accent = gradient[0];

  // Progress for this scene (0 to 1)
  const sceneProgress = Math.min(frame / sceneDuration, 1);

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '100px 60px 120px',
      flexDirection: 'column',
      gap: 36,
      fontFamily: FONTS.body,
    }}>
      {/* Soft gradient background orb */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: `translateX(-50%) translateY(${floatCycle}px)`,
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}12 0%, ${COLORS.secondary}08 50%, transparent 70%)`,
        filter: 'blur(60px)',
        zIndex: 1,
      }} />

      {/* Decorative grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        opacity: 0.3,
        zIndex: 1,
      }} />

      {/* Scene number pill */}
      <div style={{
        opacity: fadeIn,
        transform: `scale(${scaleIn})`,
        background: `linear-gradient(135deg, ${accent}, ${gradient[1]})`,
        color: COLORS.white,
        padding: '10px 28px',
        borderRadius: 100,
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: 2,
        zIndex: 10,
        boxShadow: SHADOWS.md,
        fontFamily: FONTS.heading,
      }}>
        STEP {index + 1} / {total}
      </div>

      {/* Main content card */}
      <div style={{
        opacity: fadeIn,
        transform: `translateY(${slideUp}px)`,
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 24,
        padding: '48px 44px',
        maxWidth: 880,
        width: '100%',
        boxShadow: SHADOWS.lg,
        zIndex: 10,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Accent top border */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`,
        }} />

        {/* Scene title */}
        <h2 style={{
          margin: 0,
          fontSize: 48,
          fontWeight: 800,
          color: COLORS.text,
          lineHeight: 1.25,
          textAlign: 'center',
          fontFamily: FONTS.heading,
          letterSpacing: -0.5,
        }}>
          {scene.title || scene.text || ''}
        </h2>

        {/* Scene detail / subtitle */}
        {scene.detail && (
          <p style={{
            margin: '24px 0 0',
            fontSize: 22,
            color: COLORS.muted,
            textAlign: 'center',
            lineHeight: 1.6,
            fontWeight: 400,
          }}>
            {scene.detail}
          </p>
        )}

        {/* Search terms as tags */}
        {scene.searchTerms && Array.isArray(scene.searchTerms) && scene.searchTerms.length > 0 && (
          <div style={{
            marginTop: 32,
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
                padding: '6px 16px',
                borderRadius: 100,
                fontWeight: 600,
                fontFamily: FONTS.heading,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom tip indicator */}
      <div style={{
        opacity: fadeIn * 0.7,
        fontSize: 16,
        color: COLORS.muted,
        fontWeight: 500,
        zIndex: 10,
        marginTop: 8,
      }}>
        💡 SmartRemoteGigs • Work Smarter
      </div>
    </AbsoluteFill>
  );
};

// ── Master Template ───────────────────────────────────────────────────────────
export const MasterTemplate = ({ videoData }) => {
  const data = videoData || { videoType: 'fix', title: 'Example', solution: [] };
  const { fps } = useVideoConfig();

  const sceneTimings = data.sceneTimings || [];
  const scenes = data.scenes || data.solution || [];
  const ctaFrames = data.ctaDurFrames || 150;
  const videoType = data.videoType || 'fix';

  // ✅ Diagnostic logs (maintained)
  console.log("--- DIAGNOSTIC ---");
  console.log("sceneTimings count:", sceneTimings.length);
  console.log("scenes count:", scenes.length);
  console.log("audioDuration:", data.audioDuration);
  console.log("totalDurationFrames:", data.totalDurationFrames);
  console.log("videoType:", videoType);
  console.log("------------------");

  let sections = [];
  let totalContentFrames = 0;

  if (sceneTimings.length > 0 && scenes.length > 0) {
    sceneTimings.forEach((timing, i) => {
      const scene = scenes[i] || scenes[scenes.length - 1];
      
      const startFrame = Math.round(timing.start * FPS);
      const endFrame = Math.round(timing.end * FPS);
      const durFrames = Math.max(endFrame - startFrame, 1);
      totalContentFrames = endFrame;

      console.log(`[scene ${i + 1}] start=${timing.start}s(${startFrame}f) end=${timing.end}s(${endFrame}f) dur=${durFrames}f`);

      sections.push({
        component: (
          <>
            <TypeBadge videoType={videoType} delay={startFrame} />
            <SceneSlide 
              scene={scene} 
              index={i} 
              total={sceneTimings.length} 
              videoType={videoType}
              sceneDuration={durFrames}
            />
            <ProgressBar 
              currentScene={i} 
              totalScenes={sceneTimings.length} 
              progress={((i + 1) / sceneTimings.length) * 100}
              accent={VIDEO_TYPE_GRADIENTS[videoType]?.[0] || COLORS.primary}
            />
          </>
        ),
        from: startFrame,
        duration: durFrames,
      });
    });
  } else {
    // Fallback
    const totalFrames = data.totalDurationFrames || 900;
    const contentFrames = totalFrames - ctaFrames;
    const perScene = Math.floor(contentFrames / Math.max(scenes.length, 1));
    totalContentFrames = contentFrames;

    scenes.forEach((scene, i) => {
      sections.push({
        component: (
          <>
            <TypeBadge videoType={videoType} delay={i * perScene} />
            <SceneSlide 
              scene={scene} 
              index={i} 
              total={scenes.length} 
              videoType={videoType}
              sceneDuration={perScene}
            />
            <ProgressBar 
              currentScene={i} 
              totalScenes={scenes.length} 
              progress={((i + 1) / scenes.length) * 100}
              accent={COLORS.primary}
            />
          </>
        ),
        from: i * perScene,
        duration: perScene,
      });
    });
  }

  // CTA starts right after last scene
  const ctaStartFrame = totalContentFrames;

  console.log(`[CTA] startFrame=${ctaStartFrame}, duration=${ctaFrames}`);

  sections.push({
    component: (
      <>
        <TypeBadge videoType={videoType} delay={ctaStartFrame} />
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

// ── Duration Calculator (maintained) ────────────────────────────────────────────
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
