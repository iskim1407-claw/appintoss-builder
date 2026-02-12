/**
 * TDS (Toss Design System) Design Tokens
 * Based on official Appintoss developer documentation
 */

// === Colors ===
export const TDS_COLORS = {
  // Primary
  blue: "#3182F6",
  blueDark: "#1B64DA",
  blueLight: "#E8F3FF",

  // Neutral
  dark: "#191F28",
  gray900: "#191F28",
  gray800: "#333D4B",
  gray700: "#4E5968",
  gray600: "#6B7684",
  gray500: "#8B95A1",
  gray400: "#B0B8C1",
  gray300: "#D1D6DB",
  gray200: "#E4E9F0",
  gray100: "#F2F4F6",
  gray50: "#F9FAFB",
  white: "#FFFFFF",

  // Semantic
  danger: "#F04452",
  dangerLight: "#FEE9EB",
  green: "#1FC17B",
  greenLight: "#E8FAF0",
  teal: "#00A5A5",
  tealLight: "#E5F6F6",
  yellow: "#F5C73D",
  yellowLight: "#FEF8E5",
  orange: "#F97316",

  // Badge colors
  elephant: "#454F5D",
  elephantLight: "#F2F3F4",
  red: "#F04452",
  redLight: "#FEE9EB",
} as const;

// === Typography ===
export const TDS_TYPOGRAPHY = {
  t1: { fontSize: 24, fontWeight: 700, lineHeight: 1.4 },
  t2: { fontSize: 20, fontWeight: 700, lineHeight: 1.4 },
  t3: { fontSize: 17, fontWeight: 700, lineHeight: 1.5 },
  t4: { fontSize: 15, fontWeight: 600, lineHeight: 1.5 },
  t5: { fontSize: 14, fontWeight: 500, lineHeight: 1.5 },
  t6: { fontSize: 13, fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: 12, fontWeight: 400, lineHeight: 1.4 },
  label: { fontSize: 11, fontWeight: 500, lineHeight: 1.3 },
} as const;

// === Spacing ===
export const TDS_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
} as const;

// === Border Radius ===
export const TDS_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

// === Button Sizes ===
export const TDS_BUTTON_SIZES = {
  small: { height: 36, paddingX: 16, fontSize: 13 },
  medium: { height: 44, paddingX: 20, fontSize: 14 },
  large: { height: 52, paddingX: 24, fontSize: 15 },
  xlarge: { height: 60, paddingX: 28, fontSize: 16 },
} as const;

// === Badge Sizes ===
export const TDS_BADGE_SIZES = {
  xsmall: { height: 18, paddingX: 6, fontSize: 10 },
  small: { height: 22, paddingX: 8, fontSize: 11 },
  medium: { height: 26, paddingX: 10, fontSize: 12 },
  large: { height: 30, paddingX: 12, fontSize: 13 },
} as const;

// === Shadows ===
export const TDS_SHADOWS = {
  sm: "0 1px 3px rgba(0,0,0,0.08)",
  md: "0 4px 12px rgba(0,0,0,0.1)",
  lg: "0 8px 24px rgba(0,0,0,0.12)",
  xl: "0 16px 48px rgba(0,0,0,0.15)",
} as const;

// === Animation ===
export const TDS_ANIMATION = {
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// Type exports
export type TDSColor = keyof typeof TDS_COLORS;
export type TDSTypography = keyof typeof TDS_TYPOGRAPHY;
export type TDSSpacing = keyof typeof TDS_SPACING;
export type TDSRadius = keyof typeof TDS_RADIUS;
export type TDSButtonSize = keyof typeof TDS_BUTTON_SIZES;
export type TDSBadgeSize = keyof typeof TDS_BADGE_SIZES;

// Button variants helper
export const getButtonStyles = (
  variant: "fill" | "weak",
  color: "primary" | "dark" | "danger" | "light"
) => {
  const variants = {
    fill: {
      primary: { bg: TDS_COLORS.blue, text: TDS_COLORS.white, hoverBg: TDS_COLORS.blueDark },
      dark: { bg: TDS_COLORS.dark, text: TDS_COLORS.white, hoverBg: TDS_COLORS.gray800 },
      danger: { bg: TDS_COLORS.danger, text: TDS_COLORS.white, hoverBg: "#D93A47" },
      light: { bg: TDS_COLORS.gray100, text: TDS_COLORS.dark, hoverBg: TDS_COLORS.gray200 },
    },
    weak: {
      primary: { bg: TDS_COLORS.blueLight, text: TDS_COLORS.blue, hoverBg: "#D6E9FF" },
      dark: { bg: TDS_COLORS.gray100, text: TDS_COLORS.dark, hoverBg: TDS_COLORS.gray200 },
      danger: { bg: TDS_COLORS.dangerLight, text: TDS_COLORS.danger, hoverBg: "#FDD4D8" },
      light: { bg: TDS_COLORS.white, text: TDS_COLORS.gray700, hoverBg: TDS_COLORS.gray50 },
    },
  };
  return variants[variant][color];
};

// Badge variants helper
export const getBadgeStyles = (
  variant: "fill" | "weak",
  color: "blue" | "teal" | "green" | "red" | "yellow" | "elephant"
) => {
  const colorMap = {
    blue: { fill: TDS_COLORS.blue, weak: TDS_COLORS.blueLight, text: TDS_COLORS.blue },
    teal: { fill: TDS_COLORS.teal, weak: TDS_COLORS.tealLight, text: TDS_COLORS.teal },
    green: { fill: TDS_COLORS.green, weak: TDS_COLORS.greenLight, text: TDS_COLORS.green },
    red: { fill: TDS_COLORS.red, weak: TDS_COLORS.redLight, text: TDS_COLORS.red },
    yellow: { fill: TDS_COLORS.yellow, weak: TDS_COLORS.yellowLight, text: "#A67C00" },
    elephant: { fill: TDS_COLORS.elephant, weak: TDS_COLORS.elephantLight, text: TDS_COLORS.elephant },
  };
  
  return variant === "fill"
    ? { bg: colorMap[color].fill, text: TDS_COLORS.white }
    : { bg: colorMap[color].weak, text: colorMap[color].text };
};
