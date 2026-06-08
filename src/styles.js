// ── SmartRemoteGigs Dark Design System ───────────────────────────────────────

export const COLORS = {
  // Backgrounds (dark theme)
  bg:        '#0A0A0F',
  bgCard:    '#12121A',
  bgGlass:   'rgba(255,255,255,0.04)',
  bgElevated:'#1A1A25',

  // Brand colors (SmartRemoteGigs)
  primary:   '#7C3AED',
  primaryGlow:'rgba(124,58,237,0.35)',
  secondary: '#06B6D4',
  secondaryGlow:'rgba(6,182,212,0.30)',
  success:   '#10B981',
  successGlow:'rgba(16,185,129,0.30)',

  // Accent colors
  accent:    '#43E97B',
  accentBlue:'#38F9D7',
  accentPink:'#FF6584',
  accentOrange:'#FFB347',

  // Text
  text:      '#FFFFFF',
  textMuted: '#8888AA',
  textDim:   '#555577',

  // Borders & effects
  border:    'rgba(255,255,255,0.08)',
  borderGlow:'rgba(124,58,237,0.15)',
  white:     '#FFFFFF',
};

export const FONTS = {
  heading: '"Inter", "Segoe UI", "SF Pro Display", -apple-system, sans-serif',
  body:    '"Inter", "Segoe UI", "SF Pro Text", -apple-system, sans-serif',
  mono:    '"Fira Code", "JetBrains Mono", monospace',
};

export const SHADOWS = {
  sm:  '0 2px 8px rgba(0,0,0,0.4)',
  md:  '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
  lg:  '0 16px 48px rgba(124,58,237,0.15), 0 0 0 1px rgba(124,58,237,0.08)',
  glow: '0 0 60px rgba(124,58,237,0.2), 0 0 120px rgba(124,58,237,0.1)',
  card: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
};

export const VIDEO_TYPE_ICONS = {
  fix:         '🔧',
  error:       '⚡',
  comparison:  '⚖️',
  workflow:    '⚙️',
  productivity:'🚀',
  freelancing: '💼',
  automation:  '🤖',
  default:     '✨',
};

export const VIDEO_TYPE_LABELS = {
  fix:         'Quick Fix',
  error:         'Error Solved',
  comparison:    'Comparison',
  workflow:      'Workflow',
  productivity:  'Productivity',
  freelancing:   'Freelancing',
  automation:    'Automation',
  default:       'Smart Tip',
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

export const EASE = {
  out:    'cubic-bezier(0.0, 0.0, 0.2, 1)',
  in:     'cubic-bezier(0.4, 0.0, 1, 1)',
  inOut:  'cubic-bezier(0.4, 0.0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};
