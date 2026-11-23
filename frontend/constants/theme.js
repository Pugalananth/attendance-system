/**
 * ENTERPRISE DESIGN SYSTEM
 * Professional Corporate Dark Theme
 */

export const COLORS = {

  // =========================
  // BACKGROUNDS
  // =========================

  bg: '#050816',
  bgSecondary: '#0B1023',
  bgCard: '#11182D',
  bgElevated: '#172036',
  bgInput: '#1A2440',
  bgGlass: 'rgba(255,255,255,0.04)',
  bgSidebar: '#0A1124',

  // =========================
  // PRIMARY BRAND
  // =========================

  primary: '#4F7CFF',
  primaryLight: '#6B95FF',
  primaryDark: '#315BE8',

  primaryGlow: 'rgba(79,124,255,0.18)',

  // =========================
  // SECONDARY
  // =========================

  secondary: '#7C5CFF',
  secondaryLight: '#9B82FF',
  secondaryDark: '#5B3AE5',

  // =========================
  // STATUS COLORS
  // =========================

  success: '#00D097',
  successLight: '#00F5B2',
  successDark: '#00A677',

  warning: '#FFB547',
  warningLight: '#FFD280',
  warningDark: '#E29A24',

  danger: '#FF4F6D',
  dangerLight: '#FF7A91',
  dangerDark: '#D72F4E',

  info: '#00C2FF',

  // =========================
  // TEXT
  // =========================

  textPrimary: '#FFFFFF',
  textSecondary: '#A7B0C5',
  textMuted: '#6D7893',
  textDisabled: '#4A556E',

  // =========================
  // BORDER
  // =========================

  border: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.12)',
  borderActive: '#4F7CFF',

  // =========================
  // ICON COLORS
  // =========================

  iconPrimary: '#4F7CFF',
  iconSecondary: '#A7B0C5',

  // =========================
  // FACE DETECTION
  // =========================

  faceOutline: '#00E0FF',
  faceGlow: 'rgba(0,224,255,0.25)',

  // =========================
  // GRADIENTS
  // =========================

  gradientPrimary: [
    '#4F7CFF',
    '#7C5CFF',
  ],

  gradientSuccess: [
    '#00D097',
    '#00F5B2',
  ],

  gradientDanger: [
    '#FF4F6D',
    '#FF7A91',
  ],

  gradientCard: [
    '#151D35',
    '#101728',
  ],

  gradientDark: [
    '#0A1124',
    '#050816',
  ],

  // =========================
  // OVERLAY
  // =========================

  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(5,8,22,0.85)',
};

// =====================================
// TYPOGRAPHY
// =====================================

export const FONTS = {

  // Font Families
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',

  // Font Sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 38,
  '4xl': 48,

  // Line Heights
  lineXs: 16,
  lineSm: 20,
  lineBase: 24,
  lineMd: 28,
  lineLg: 32,
};

// =====================================
// SPACING SYSTEM
// =====================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
};

// =====================================
// BORDER RADIUS
// =====================================

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 32,
  full: 9999,
};

// =====================================
// SHADOW SYSTEM
// =====================================

export const SHADOWS = {

  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },

  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },

  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },

  primaryGlow: {
    shadowColor: '#4F7CFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },

  successGlow: {
    shadowColor: '#00D097',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
};

// =====================================
// COMPONENT STYLES
// =====================================

export const COMPONENTS = {

  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },

  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.base,
    paddingVertical: 14,
  },

  button: {
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
  COMPONENTS,
};