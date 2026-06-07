export const COLORS = {
  bg: '#0A0A0F',
  bgCard: '#12121A',
  bgGlass: 'rgba(255,255,255,0.04)',
  primary: '#6C63FF',
  primaryGlow: 'rgba(108,99,255,0.3)',
  secondary: '#FF6584',
  accent: '#43E97B',
  accentBlue: '#38F9D7',
  text: '#FFFFFF',
  textMuted: '#8888AA',
  border: 'rgba(255,255,255,0.08)',
  success: '#43E97B',
  danger: '#FF6584',
  warning: '#FFB347',
};

export const FONTS = {
  heading: '"Inter", "Segoe UI", sans-serif',
  body: '"Inter", "Segoe UI", sans-serif',
  mono: '"Fira Code", monospace',
};

export const EASE = {
  out: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0.0, 1, 1)',
  inOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const baseContainer = {
  width: '100%',
  height: '100%',
  backgroundColor: COLORS.bg,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: FONTS.body,
  color: COLORS.text,
  overflow: 'hidden',
  position: 'relative',
};
