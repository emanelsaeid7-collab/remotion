// ── SmartRemoteGigs Design System ───────────────────────────────────────────

export const COLORS = {
  primary:   '#7C3AED',   // بنفسجي — العلامة الرئيسية
  secondary: '#06B6D4',   // سماوي — التفاصيل والتأكيد
  success:   '#10B981',   // أخضر — الإنجاز والـ CTA
  bg:        '#FFFFFF',   // خلفية رئيسية
  surface:   '#F8FAFC',   // سطح البطاقات
  border:    '#E5E7EB',   // الحدود
  text:      '#222222',   // النص الرئيسي
  muted:     '#626262',   // النص الثانوي
  white:     '#FFFFFF',
};

export const FONTS = {
  heading: '"Inter", "Segoe UI", "SF Pro Display", -apple-system, sans-serif',
  body:    '"Inter", "Segoe UI", "SF Pro Text", -apple-system, sans-serif',
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(124, 58, 237, 0.1), 0 4px 6px -2px rgba(124, 58, 237, 0.05)',
  glow: '0 0 40px rgba(124, 58, 237, 0.15)',
};

// أيقونات SVG بسيطة لكل نوع فيديو
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

// تدرجات ألوان لكل نوع (Primary + Secondary blends)
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
