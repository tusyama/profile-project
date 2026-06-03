export const theme = {
  colors: {
    bg: '#0a0e14',
    surface: '#121820',
    surfaceHover: '#1a2330',
    border: '#2a3544',
    text: '#e8edf4',
    textMuted: '#8b9aab',
    accent: '#2dd4bf',
    accentHover: '#5eead4',
    error: '#f87171',
    success: '#4ade80',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  font: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
  },
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
  },
  layout: {
    maxWidth: '1100px',
    /** Sticky header: md padding ×2 + logo line + border */
    headerHeight: '4rem',
  },
} as const;

export type AppTheme = typeof theme;
