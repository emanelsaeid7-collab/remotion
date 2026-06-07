import React from 'react';
import { AbsoluteFill, Series } from 'remotion';

import { HookSection }                           from './sections/HookSection';
import { ProblemSection }                        from './sections/ProblemSection';
import { SolutionSection }                       from './sections/SolutionSection';
import { ComparisonSection, WinnerSection }      from './sections/ComparisonSection';
import { WorkflowOverview, WorkflowStepSection } from './sections/WorkflowSection';
import { CTASection }                            from './sections/CTASection';

const FPS = 30;

const buildSections = (data) => {
  const totalFrames  = data.totalDurationFrames || 900;
  const ctaFrames    = data.ctaDurFrames        || 150;
  const contentFrames = totalFrames - ctaFrames;
  const steps        = data.steps || [];

  switch (data.videoType) {
    case 'fix':
    case 'error':
    case 'productivity':
    case 'freelancing':
      return [
        { component: <ProblemSection data={data} />,  duration: Math.floor(contentFrames * 0.4) },
        { component: <SolutionSection data={data} />, duration: Math.floor(contentFrames * 0.6) },
        { component: <CTASection data={data} />,      duration: ctaFrames },
      ];

    case 'comparison':
      return [
        { component: <ComparisonSection data={data} />, duration: Math.floor(contentFrames * 0.65) },
        { component: <WinnerSection data={data} />,     duration: Math.floor(contentFrames * 0.35) },
        { component: <CTASection data={data} />,        duration: ctaFrames },
      ];

    case 'workflow':
    case 'automation':
      const perStep = Math.floor(contentFrames / (steps.length + 1));
      return [
        { component: <WorkflowOverview data={data} />, duration: perStep },
        ...steps.map((_, i) => ({
          component: <WorkflowStepSection data={data} stepIndex={i} />,
          duration: perStep,
        })),
        { component: <CTASection data={data} />, duration: ctaFrames },
      ];

    default:
      return [
        { component: <HookSection data={data} />, duration: contentFrames },
        { component: <CTASection data={data} />,  duration: ctaFrames },
      ];
  }
};

export const MasterTemplate = ({ videoData }) => {
  const data     = videoData || { videoType: 'fix', title: 'Example', problem: '...', solution: [] };
  const sections = buildSections(data);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', color: 'white' }}>
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

export const getTotalDuration = (data) => {
  if (!data) return 900;
  const steps = data.steps || [];
  switch (data.videoType) {
    case 'workflow':
    case 'automation':
      return (steps.length + 1) * 150 + 150;
    default:
      return 900;
  }
};
