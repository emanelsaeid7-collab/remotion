// ── SmartRemoteGigs Cinematic Design System ─────────────────────────────────

export const COLORS = {
  bg:         '#050508',
  bgElevated: '#0E0E14',
  bgCard:     'rgba(255,255,255,0.03)',

  primary:    '#7C3AED',
  primaryGlow:'rgba(124,58,237,0.4)',
  secondary:  '#06B6D4',
  secondaryGlow:'rgba(6,182,212,0.35)',
  accent:     '#F59E0B',
  accentGlow: 'rgba(245,158,11,0.35)',

  text:       '#FFFFFF',
  textMuted:  '#A0A0B8',
  textDim:    '#505060',

  border:     'rgba(255,255,255,0.06)',
  borderGlow: 'rgba(124,58,237,0.12)',
};

export const FONTS = {
  heading: '"Inter", "Segoe UI", "SF Pro Display", system-ui, sans-serif',
  body:    '"Inter", "Segoe UI", system-ui, sans-serif',
};

export const SHADOWS = {
  glow:    '0 0 80px rgba(124,58,237,0.25), 0 0 160px rgba(124,58,237,0.1)',
  card:    '0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
  text:    '0 4px 30px rgba(0,0,0,0.8)',
  button:  '0 12px 40px rgba(124,58,237,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
};

export const VIDEO_TYPE_GRADIENTS = {
  fix:         ['#7C3AED', '#06B6D4'],
  error:       ['#EF4444', '#7C3AED'],
  comparison:  ['#06B6D4', '#10B981'],
  workflow:    ['#7C3AED', '#10B981'],
  productivity:['#10B981', '#06B6D4'],
  freelancing: ['#F59E0B', '#7C3AED'],
  automation:  ['#7C3AED', '#EC4899'],
  default:     ['#7C3AED', '#06B6D4'],
};

export const VIDEO_TYPE_ICONS = {
  fix: '🔧', error: '⚡', comparison: '⚖️', workflow: '⚙️',
  productivity: '🚀', freelancing: '💼', automation: '🤖', default: '✨',
};

export const VIDEO_TYPE_LABELS = {
  fix: 'Quick Fix', error: 'Error Solved', comparison: 'Comparison',
  workflow: 'Workflow', productivity: 'Productivity', freelancing: 'Freelancing',
  automation: 'Automation', default: 'Smart Tip',
};
