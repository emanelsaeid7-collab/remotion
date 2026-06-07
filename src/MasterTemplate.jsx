import React from 'react';
import { AbsoluteFill, Series } from 'remotion';

// Existing Imports
import { HookSection } from './sections/HookSection';
import { ProblemSection } from './sections/ProblemSection';
import { SolutionSection } from './sections/SolutionSection';
import { ComparisonSection, WinnerSection } from './sections/ComparisonSection';
import { WorkflowOverview, WorkflowStepSection } from './sections/WorkflowSection';
import { CTASection } from './sections/CTASection';

// NEW IMPORTS (We will create these files next)
import { ErrorLogSection, ErrorFixSection } from './sections/ErrorSection';
import { ConceptSection, TipsSection } from './sections/ProductivitySection';
import { RedFlagsSection, AdviceSection } from './sections/FreelancingSection';
import { AutomationTriggerSection, AutomationActionsSection } from './sections/AutomationSection';

// Duration constants (in frames at 30fps)
const HOOK_DUR = 150;         // 5s
const CTA_DUR = 150;          // 5s

// Specific section durations
const PROBLEM_DUR = 240;     // 8s
const SOLUTION_DUR = 360;    // 12s
const COMPARISON_DUR = 300;  // 10s
const WINNER_DUR = 180;       // 6s
const WORKFLOW_STEP_DUR = 150; // 5s

const ERROR_LOG_DUR = 210;   // 7s
const ERROR_FIX_DUR = 300;   // 10s

const CONCEPT_DUR = 210;     // 7s
const TIPS_DUR = 300;        // 10s

const RED_FLAGS_DUR = 240;   // 8s
const ADVICE_DUR = 210;      // 7s

const TRIGGER_DUR = 180;      // 6s
const ACTIONS_DUR = 300;     // 10s

/**
 * Build the series items based on videoType
 */
const buildSections = (data) => {
  const sections = [];
  const steps = data.steps || [];

  switch (data.videoType) {
    case 'fix':
      sections.push(
        { component: <HookSection data={data} />,     duration: HOOK_DUR },
        { component: <ProblemSection data={data} />,  duration: PROBLEM_DUR },
        { component: <SolutionSection data={data} />, duration: SOLUTION_DUR },
        { component: <CTASection data={data} />,      duration: CTA_DUR },
      );
      break;

    case 'error':
      sections.push(
        { component: <HookSection data={data} />,       duration: HOOK_DUR },
        { component: <ErrorLogSection data={data} />,   duration: ERROR_LOG_DUR },
        { component: <ErrorFixSection data={data} />,   duration: ERROR_FIX_DUR },
        { component: <CTASection data={data} />,        duration: CTA_DUR },
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

    case 'productivity':
      sections.push(
        { component: <HookSection data={data} />,       duration: HOOK_DUR },
        { component: <ConceptSection data={data} />,    duration: CONCEPT_DUR },
        { component: <TipsSection data={data} />,       duration: TIPS_DUR },
        { component: <CTASection data={data} />,        duration: CTA_DUR },
      );
      break;

    case 'freelancing':
      sections.push(
        { component: <HookSection data={data} />,       duration: HOOK_DUR },
        { component: <RedFlagsSection data={data} />,   duration: RED_FLAGS_DUR },
        { component: <AdviceSection data={data} />,     duration: ADVICE_DUR },
        { component: <CTASection data={data} />,        duration: CTA_DUR },
      );
      break;

    case 'automation':
      sections.push(
        { component: <HookSection data={data} />,              duration: HOOK_DUR },
        { component: <AutomationTriggerSection data={data} />, duration: TRIGGER_DUR },
        { component: <AutomationActionsSection data={data} />, duration: ACTIONS_DUR },
        { component: <CTASection data={data} />,               duration: CTA_DUR },
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
  const data = videoData || { videoType: 'fix', title: 'Example', problem: 'No data', solution: [] };
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

/**
 * Calculate total duration dynamically from videoData
 */
export const getTotalDuration = (data) => {
  if (!data) return HOOK_DUR + CTA_DUR;
  const steps = data.steps || [];

  switch (data.videoType) {
    case 'fix':
      return HOOK_DUR + PROBLEM_DUR + SOLUTION_DUR + CTA_DUR;
    case 'error':
      return HOOK_DUR + ERROR_LOG_DUR + ERROR_FIX_DUR + CTA_DUR;
    case 'comparison':
      return HOOK_DUR + COMPARISON_DUR + WINNER_DUR + CTA_DUR;
    case 'workflow':
      return HOOK_DUR + WORKFLOW_STEP_DUR + (steps.length * WORKFLOW_STEP_DUR) + CTA_DUR;
    case 'productivity':
      return HOOK_DUR + CONCEPT_DUR + TIPS_DUR + CTA_DUR;
    case 'freelancing':
      return HOOK_DUR + RED_FLAGS_DUR + ADVICE_DUR + CTA_DUR;
    case 'automation':
      return HOOK_DUR + TRIGGER_DUR + ACTIONS_DUR + CTA_DUR;
    default:
      return HOOK_DUR + CTA_DUR;
  }
};
