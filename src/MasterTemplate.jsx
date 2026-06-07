import React from 'react';
import { AbsoluteFill, Series, Audio } from 'remotion';

import { HookSection } from './sections/HookSection';
import { ProblemSection } from './sections/ProblemSection';
import { SolutionSection } from './sections/SolutionSection';
import { ComparisonSection, WinnerSection } from './sections/ComparisonSection';
import { WorkflowOverview, WorkflowStepSection } from './sections/WorkflowSection';
import { CTASection } from './sections/CTASection';

// Duration constants (in frames at 30fps)
const HOOK_DUR          = 150; // 5s
const CTA_DUR           = 150; // 5s
const PROBLEM_DUR       = 240; // 8s
const SOLUTION_DUR      = 360; // 12s
const COMPARISON_DUR    = 300; // 10s
const WINNER_DUR        = 180; // 6s
const WORKFLOW_STEP_DUR = 150; // 5s

const buildSections = (data) => {
  const sections = [];
  const steps = data.steps || [];

  switch (data.videoType) {
    case 'fix':
    case 'error':
    case 'productivity':
    case 'freelancing':
      sections.push(
        { component: <HookSection data={data} />,     duration: HOOK_DUR },
        { component: <ProblemSection data={data} />,  duration: PROBLEM_DUR },
        { component: <SolutionSection data={data} />, duration: SOLUTION_DUR },
        { component: <CTASection data={data} />,      duration: CTA_DUR },
      );
      break;

    case 'comparison':
      sections.push(
        { component: <HookSection data={data} />,       duration: HOOK_DUR },
        { component: <ComparisonSection data={data} />, duration: COMPARISON_DUR },
        { component: <WinnerSection data={data} />,     duration: WINNER_DUR },
        { component: <CTASection data={data} />,        duration: CTA_DUR },
      );
      break;

    case 'workflow':
    case 'automation':
      sections.push(
        { component: <HookSection data={data} />,      duration: HOOK_DUR },
        { component: <WorkflowOverview data={data} />, duration: WORKFLOW_STEP_DUR },
        ...steps.map((_, i) => ({
          component: <WorkflowStepSection data={data} stepIndex={i} />,
          duration: WORKFLOW_STEP_DUR,
        })),
        { component: <CTASection data={data} />, duration: CTA_DUR },
      );
      break;

    default:
      sections.push(
        { component: <HookSection data={data} />, duration: HOOK_DUR },
        { component: <CTASection data={data} />,  duration: CTA_DUR },
      );
  }

  return sections;
};

export const MasterTemplate = ({ videoData }) => {
  const data = videoData || { videoType: 'fix', title: 'Example', problem: '...', solution: [] };
  const sections = buildSections(data);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', color: 'white' }}>
      {/* Audio plays across the entire video */}
      {data.audioUrl && (
        <Audio src={data.audioUrl} />
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

export const getTotalDuration = (data) => {
  if (!data) return HOOK_DUR + CTA_DUR;
  const steps = data.steps || [];

  switch (data.videoType) {
    case 'fix':
    case 'error':
    case 'productivity':
    case 'freelancing':
      return HOOK_DUR + PROBLEM_DUR + SOLUTION_DUR + CTA_DUR;
    case 'comparison':
      return HOOK_DUR + COMPARISON_DUR + WINNER_DUR + CTA_DUR;
    case 'workflow':
    case 'automation':
      return HOOK_DUR + WORKFLOW_STEP_DUR + (steps.length * WORKFLOW_STEP_DUR) + CTA_DUR;
    default:
      return HOOK_DUR + CTA_DUR;
  }
};
