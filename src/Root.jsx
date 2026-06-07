import React from 'react';
import { Composition } from 'remotion';
import { MasterTemplate, getTotalDuration } from './MasterTemplate';

// 1. Fix Data
const FIX_DATA = {
  videoType: 'fix',
  title: 'Cursor Indexing Stuck',
  problem: 'Cursor IDE freezes during project indexing and becomes unresponsive.',
  cause: 'Missing .cursorignore file causes indexing of the entire node_modules folder.',
  solution: [
    { title: 'Create .cursorignore', detail: 'In project root', code: 'touch .cursorignore' },
    { title: 'Add large folders', detail: 'node_modules, .git, dist, build' },
    { title: 'Restart Cursor', detail: 'Cmd+Shift+P -> Reload Window' },
  ],
  cta: { text: 'Follow for more AI Dev tips!', handle: '@aidevtips', emoji: '⚡' },
};

// 2. Error Data
const ERROR_DATA = {
  videoType: 'error',
  title: 'React Hydration Mismatch',
  errorLog: 'Text content did not match. Server: "Login" Client: "Logout"',
  explanation: 'The server rendered different HTML than what the client expected on initial load.',
  fixSteps: [
    { step: 'Check conditional rendering based on window/localStorage.' },
    { step: 'Use a custom useEffect hook to delay client-side rendering.' }
  ],
  cta: { text: 'Save this for your next bug!', handle: '@aidevtips', emoji: '🐛' },
};

// 3. Comparison Data
const COMPARISON_DATA = {
  videoType: 'comparison',
  toolA: 'Cursor',
  toolB: 'Windsurf',
  features: [
    { label: 'Pricing', a: '$20/mo', b: '$15/mo' },
    { label: 'AI Models', a: 'GPT-4 + Claude', b: 'Claude Only' },
    { label: 'Speed', a: '⭐⭐⭐⭐', b: '⭐⭐⭐⭐⭐' },
  ],
  pros: {
    Cursor: ['Better Git integration', 'Advanced Composer'],
    Windsurf: ['Faster UI', 'Cheaper'],
  },
  cons: {
    Cursor: ['Higher RAM usage', 'Expensive'],
    Windsurf: ['Fewer features', 'No multi-model'],
  },
  winner: 'Cursor',
  winnerReason: 'For large codebases and teams, Cursor wins by a large margin.',
  cta: { text: 'Which one do you use?', handle: '@aidevtips', emoji: '🏆' },
};

// 4. Workflow Data
const WORKFLOW_DATA = {
  videoType: 'workflow',
  workflowName: 'AI Blog Automation',
  steps: [
    { name: 'Trigger', icon: '💡', detail: 'New Idea in Notion', tool: 'n8n' },
    { name: 'Research', icon: '🔍', detail: 'Gather info automatically', tool: 'Perplexity API' },
    { name: 'Write', icon: '✍️', detail: 'Draft content', tool: 'Claude 3' },
    { name: 'Publish', icon: '🚀', detail: 'Post to CMS', tool: 'WordPress' },
  ],
  cta: { text: 'Want this n8n template?', handle: '@aidevtips', emoji: '🤖' },
};

// 5. Productivity Data
const PRODUCTIVITY_DATA = {
  videoType: 'productivity',
  title: '10x Your Deep Work',
  concept: 'The Pomodoro + AI Technique',
  tips: [
    { title: 'Block Distractions', detail: 'Use tools like Cold Turkey.' },
    { title: 'AI Code Reviews', detail: 'Let AI review your PRs instantly.' },
    { title: 'Batch Meetings', detail: 'Move all calls to Tuesday/Thursday.' }
  ],
  cta: { text: 'Boost your focus today!', handle: '@aidevtips', emoji: '📈' },
};

// 6. Freelancing Data
const FREELANCING_DATA = {
  videoType: 'freelancing',
  title: 'Client Red Flags',
  redFlags: [
    'Can we jump on a quick call? (Every day)',
    'We will pay you in equity/exposure.',
    'It should only take 5 minutes.'
  ],
  advice: 'Always have a clear contract and scope of work before starting.',
  cta: { text: 'Tag a freelancer who needs this!', handle: '@aidevtips', emoji: '💼' },
};

// 7. Automation Data
const AUTOMATION_DATA = {
  videoType: 'automation',
  title: 'Automate Client Onboarding',
  trigger: 'New Stripe Payment',
  actions: [
    'Create Google Drive Folder',
    'Send Welcome Email via Resend',
    'Invite to Slack Connect Channel',
    'Create Trello Board from Template'
  ],
  impact: 'Saves 2 hours per new client!',
  cta: { text: 'Automate your agency!', handle: '@aidevtips', emoji: '⚙️' },
};

export const RemotionRoot = () => {
  return (
    <>
      <Composition id="FixVideo" component={MasterTemplate} durationInFrames={getTotalDuration(FIX_DATA)} fps={30} width={1080} height={1920} defaultProps={{ videoData: FIX_DATA }} />
      <Composition id="ErrorVideo" component={MasterTemplate} durationInFrames={getTotalDuration(ERROR_DATA)} fps={30} width={1080} height={1920} defaultProps={{ videoData: ERROR_DATA }} />
      <Composition id="ComparisonVideo" component={MasterTemplate} durationInFrames={getTotalDuration(COMPARISON_DATA)} fps={30} width={1080} height={1920} defaultProps={{ videoData: COMPARISON_DATA }} />
      <Composition id="WorkflowVideo" component={MasterTemplate} durationInFrames={getTotalDuration(WORKFLOW_DATA)} fps={30} width={1080} height={1920} defaultProps={{ videoData: WORKFLOW_DATA }} />
      <Composition id="ProductivityVideo" component={MasterTemplate} durationInFrames={getTotalDuration(PRODUCTIVITY_DATA)} fps={30} width={1080} height={1920} defaultProps={{ videoData: PRODUCTIVITY_DATA }} />
      <Composition id="FreelancingVideo" component={MasterTemplate} durationInFrames={getTotalDuration(FREELANCING_DATA)} fps={30} width={1080} height={1920} defaultProps={{ videoData: FREELANCING_DATA }} />
      <Composition id="AutomationVideo" component={MasterTemplate} durationInFrames={getTotalDuration(AUTOMATION_DATA)} fps={30} width={1080} height={1920} defaultProps={{ videoData: AUTOMATION_DATA }} />
    </>
  );
};
