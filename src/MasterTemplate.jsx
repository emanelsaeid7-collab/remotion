import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame } from 'remotion';

import { HookSection } from './sections/HookSection';
import { ProblemSection } from './sections/ProblemSection';
import { SolutionSection } from './sections/SolutionSection';
import { ComparisonSection, WinnerSection } from './sections/ComparisonSection';
import { WorkflowOverview, WorkflowStepSection } from './sections/WorkflowSection';
import { CTASection } from './sections/CTASection';

// Duration constants (in frames at 30fps)
const HOOK_DUR = 90;       // 3s
const PROBLEM_DUR = 120;   // 4s
const SOLUTION_DUR = 150;  // 5s
const COMPARISON_DUR = 150;
const WINNER_DUR = 90;
const WORKFLOW_STEP_DUR = 120;
const CTA_DUR = 90;        // 3s

/**
 * Build the series items based on videoType
 */
const buildSections = (data) => {
  const sections = [];
  const steps = data.steps || [];

  switch (data.videoType) {
    case 'fix':
      sections.push(
        { component: <HookSection data={data} />,    duration: HOOK_DUR },
        { component: <ProblemSection data={data} />, duration: PROBLEM_DUR },
        { component: <SolutionSection data={data} />,duration: SOLUTION_DUR },
        { component: <CTASection data={data} />,     duration: CTA_DUR },
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
      sections.push(
        { component: <HookSection data={data} />,          duration: HOOK_DUR },
        { component: <WorkflowOverview data={data} />,     duration: WORKFLOW_STEP_DUR },
        ...steps.map((_, i) => ({
          component: <WorkflowStepSection data={data} stepIndex={i} />,
          duration: WORKFLOW_STEP_DUR,
        })),
        { component: <CTASection data={data} />,           duration: CTA_DUR },
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
  const data = videoData || { videoType: 'fix', title: 'Example', problem: '...', solution: ['Step 1'] };
  const sections = buildSections(data);

  return (
    <AbsoluteFill>
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

/**
 * Calculate total duration dynamically from videoData
 */
export const getTotalDuration = (data) => {
  if (!data) return HOOK_DUR + CTA_DUR;
  const steps = data.steps || [];

  switch (data.videoType) {
    case 'fix':
      return HOOK_DUR + PROBLEM_DUR + SOLUTION_DUR + CTA_DUR;
    case 'comparison':
      return HOOK_DUR + COMPARISON_DUR + WINNER_DUR + CTA_DUR;
    case 'workflow':
      return HOOK_DUR + WORKFLOW_STEP_DUR + steps.length * WORKFLOW_STEP_DUR + CTA_DUR;
    default:
      return HOOK_DUR + CTA_DUR;
  }
};
