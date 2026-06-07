import React from 'react';
import { AbsoluteFill, Series, Audio } from 'remotion';

import { HookSection }                           from './sections/HookSection';
import { ProblemSection }                        from './sections/ProblemSection';
import { SolutionSection }                       from './sections/SolutionSection';
import { ComparisonSection, WinnerSection }      from './sections/ComparisonSection';
import { WorkflowOverview, WorkflowStepSection } from './sections/WorkflowSection';
import { CTASection }                            from './sections/CTASection';

// Default durations (fallback only — overridden by server-calculated values)
const DEFAULT_HOOK_FRAMES     = 150; // 5s
const DEFAULT_CTA_FRAMES      = 150; // 5s
const DEFAULT_CONTENT_FRAMES  = 540; // 18s
const FPS = 30;

const buildSections = (data, hookDur, contentDur, ctaDur) => {
  const steps = data.steps || [];

  switch (data.videoType) {
    case 'fix':
    case 'error':
    case 'productivity':
    case 'freelancing':
      return [
        { component: <HookSection data={data} />,     duration: hookDur },
        { component: <ProblemSection data={data} />,  duration: Math.floor(contentDur * 0.35) },
        { component: <SolutionSection data={data} />, duration: Math.floor(contentDur * 0.65) },
        { component: <CTASection data={data} />,      duration: ctaDur },
      ];

    case 'comparison':
      return [
        { component: <HookSection data={data} />,       duration: hookDur },
        { component: <ComparisonSection data={data} />, duration: Math.floor(contentDur * 0.65) },
        { component: <WinnerSection data={data} />,     duration: Math.floor(contentDur * 0.35) },
        { component: <CTASection data={data} />,        duration: ctaDur },
      ];

    case 'workflow':
    case 'automation':
      const perStep = steps.length > 0 ? Math.floor(contentDur / (steps.length + 1)) : contentDur;
      return [
        { component: <HookSection data={data} />,      duration: hookDur },
        { component: <WorkflowOverview data={data} />, duration: perStep },
        ...steps.map((_, i) => ({
          component: <WorkflowStepSection data={data} stepIndex={i} />,
          duration: perStep,
        })),
        { component: <CTASection data={data} />, duration: ctaDur },
      ];

    default:
      return [
        { component: <HookSection data={data} />, duration: hookDur },
        { component: <CTASection data={data} />,  duration: ctaDur },
      ];
  }
};

export const MasterTemplate = ({ videoData }) => {
  const data = videoData || { videoType: 'fix', title: 'Example', problem: '...', solution: [] };

  // ── Use server-calculated durations if available ──────────────────────────
  const hookDur    = data.hookDurFrames    || DEFAULT_HOOK_FRAMES;
  const ctaDur     = data.ctaDurFrames     || DEFAULT_CTA_FRAMES;
  const totalDur   = data.totalDurationFrames || (DEFAULT_HOOK_FRAMES + DEFAULT_CONTENT_FRAMES + DEFAULT_CTA_FRAMES);
  const contentDur = totalDur - hookDur - ctaDur;

  const sections = buildSections(data, hookDur, contentDur, ctaDur);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', color: 'white' }}>
      {/* Audio spans entire video */}
      {data.audioUrl && (
        <Audio src={data.audioUrl} startFrom={0} />
      )}
      <Series>
        {sections.map((sec, i) => (
          <Series.Sequence key={i} durationInFrames={sec.duration}>
            <AbsoluteFill>{sec.component}</AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

// For Root.jsx preview — uses defaults
export const getTotalDuration = (data) => {
  if (!data) return DEFAULT_HOOK_FRAMES + DEFAULT_CONTENT_FRAMES + DEFAULT_CTA_FRAMES;
  const steps = data.steps || [];
  switch (data.videoType) {
    case 'workflow':
    case 'automation':
      return DEFAULT_HOOK_FRAMES + (steps.length + 1) * 150 + DEFAULT_CTA_FRAMES;
    default:
      return DEFAULT_HOOK_FRAMES + DEFAULT_CONTENT_FRAMES + DEFAULT_CTA_FRAMES;
  }
};
