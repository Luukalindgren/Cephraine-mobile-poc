export const Colors = {
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#4A42DB',
  secondary: '#FF6B6B',
  secondaryLight: '#FF8E8E',
  background: '#0F0F23',
  surface: '#1A1A2E',
  surfaceLight: '#25253D',
  surfaceHighlight: '#2D2D4A',
  text: '#EAEAEA',
  textSecondary: '#A0A0B8',
  textMuted: '#6B6B82',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#FF5252',
  white: '#FFFFFF',
  black: '#000000',
  border: '#2A2A42',
  tabBar: '#16162B',
  tabBarActive: '#6C63FF',
  tabBarInactive: '#6B6B82',
};

export const Severity = {
  getColor: (severity: number): string => {
    if (severity <= 2) return '#4CAF50';
    if (severity <= 4) return '#8BC34A';
    if (severity <= 6) return '#FFC107';
    if (severity <= 8) return '#FF9800';
    return '#FF5252';
  },
  getLabel: (severity: number): string => {
    if (severity <= 2) return 'Mild';
    if (severity <= 4) return 'Moderate';
    if (severity <= 6) return 'Significant';
    if (severity <= 8) return 'Severe';
    return 'Extreme';
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};
