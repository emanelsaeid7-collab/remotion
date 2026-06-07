import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { MasterTemplate, getTotalDuration } from './MasterTemplate';

const FIX_DATA = {
  videoType: 'fix',
  title: 'Cursor Indexing Stuck',
  problem: 'Cursor IDE freezes during project indexing.',
  cause: 'Missing .cursorignore file causes indexing of node_modules.',
  solution: [
    { title: 'Create .cursorignore', code: 'touch .cursorignore' },
    { title: 'Add large folders', detail: 'node_modules, .git, dist' },
    { title: 'Restart Cursor', detail: 'Cmd+Shift+P → Reload Window' },
  ],
  cta: { text: 'Follow for more AI Dev tips!', handle: '@aidevtips', emoji: '⚡' },
};

const COMPARISON_DATA = {
  videoType: 'comparison',
  toolA: 'Cursor', toolB: 'Windsurf',
  features: [
    { label: 'Pricing', a: '$20/mo', b: '$15/mo' },
    { label: 'AI Models', a: 'GPT-4 + Claude', b: 'Claude Only' },
  ],
  pros: { Cursor: ['Better Git'], Windsurf: ['Faster', 'Cheaper'] },
  cons: { Cursor: ['Expensive'], Windsurf: ['Fewer features'] },
  winner: 'Cursor',
  winnerReason: 'For large codebases, Cursor wins.',
  cta: { text: 'Which one do you use?', handle: '@aidevtips', emoji: '🏆' },
};

const WORKFLOW_DATA = {
  videoType: 'workflow',
  workflowName: 'AI Blog Automation',
  steps: [
    { name: 'Trigger', icon: '💡', detail: 'New Idea in Notion', tool: 'n8n' },
    { name: 'Research', icon: '🔍', detail: 'Gather info', tool: 'Perplexity' },
    { name: 'Write', icon: '✍️', detail: 'Draft content', tool: 'Claude 3' },
    { name: 'Publish', icon: '🚀', detail: 'Post to CMS', tool: 'WordPress' },
  ],
  cta: { text: 'Want this template?', handle: '@aidevtips', emoji: '🤖' },
};

// ✅ durationInFrames كبير كـ ceiling — السيرفر يتحكم بالمدة الفعلية عبر --duration
const MAX_DURATION = 3600; // 2 دقيقة ceiling

export const RemotionRoot = () => (
  <>
    <Composition id="FixVideo"        component={MasterTemplate} durationInFrames={MAX_DURATION} fps={30} width={1080} height={1920} defaultProps={{ videoData: FIX_DATA }} />
    <Composition id="ComparisonVideo" component={MasterTemplate} durationInFrames={MAX_DURATION} fps={30} width={1080} height={1920} defaultProps={{ videoData: COMPARISON_DATA }} />
    <Composition id="WorkflowVideo"   component={MasterTemplate} durationInFrames={MAX_DURATION} fps={30} width={1080} height={1920} defaultProps={{ videoData: WORKFLOW_DATA }} />
  </>
);

registerRoot(RemotionRoot);
