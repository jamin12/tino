// ─── CCP Design System Tokens ───────────────────────────────────────────────
// Figma export(example 파일)에서 추출한 디자인 토큰.
// 모든 CCP 컴포넌트는 이 토큰을 참조하여 일관성을 유지한다.

// ─── Colors ─────────────────────────────────────────────────────────────────

export const colors = {
  primary: {
    DEFAULT: "#0077ff",
    light: "#0077ff14",
    semi: "#0077ff80",
  },
  success: {
    DEFAULT: "#00b30e",
    muted: "#009d32",
    light: "#009d3214",
    bright: "#00ba06",
  },
  error: {
    DEFAULT: "#da1e28",
    light: "#da1e2814",
  },
  warning: {
    DEFAULT: "#dea600",
  },
  info: {
    DEFAULT: "#6366f1",
  },
  teal: {
    DEFAULT: "#18be94",
  },
  cyan: {
    DEFAULT: "#1fbdd0",
  },
  navy: {
    DEFAULT: "#014b9f",
  },
  dark: {
    DEFAULT: "#1b2c3f",
    shadow: "#1b2c3f33",
  },
  neutral: {
    50: "#f9f9f9",
    100: "#f6f8fa",
    150: "#f0f0f0",
    200: "#eef0f2",
    250: "#e7edf3",
    300: "#e0e0e0",
    350: "#edeff1",
    400: "#dddddd",
    450: "#d2d2d2",
    500: "#ccd6dd",
    550: "#bac0c6",
    600: "#b1b1b1",
    650: "#999999",
    700: "#6d6f72",
    750: "#5e5e5e",
    800: "#555555",
    850: "#3d3e40",
    900: "#333333",
    950: "#222222",
    1000: "#111111",
  },
  white: "#ffffff",
  black: "#000000",
} as const;

// ─── Typography ─────────────────────────────────────────────────────────────

export const fontFamily = {
  sans: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', sans-serif",
} as const;

export const fontSize = {
  "2xs": "10px",
  xs: "11px",
  sm: "13px",
  base: "14px",
  md: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  "2xs": "14px",
  xs: "14.3px",
  sm: "18px",
  "sm-tight": "18.2px",
  base: "20px",
  md: "24px",
  lg: "26px",
  xl: "28px",
  "2xl": "36px",
} as const;

// letter-spacing 패턴: fontSize(px) × -0.01
export const letterSpacing = {
  "2xs": "-0.10px",
  xs: "-0.11px",
  sm: "-0.13px",
  base: "-0.14px",
  md: "-0.16px",
  lg: "-0.18px",
  xl: "-0.20px",
  "2xl": "-0.24px",
  none: "0",
} as const;

// ─── Shadows ────────────────────────────────────────────────────────────────

export const shadow = {
  card: "0px 0px 8px #00000014",
  dropdown: "4px 4px 4px #0000001a",
  tooltip: "4px 4px 8px #1b2c3f33",
  header: "0px 1px 5px #6b77ac33",
  panel: "-1px 0px 5px #6b77ac33",
  subtle: "2px 2px 8px #0000000d",
  focus: "0px 2px 10px #0077ff33",
} as const;

// ─── Border Radius ──────────────────────────────────────────────────────────

export const radius = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  pill: "20px",
  full: "50px",
} as const;

// ─── Spacing Scale (px) ─────────────────────────────────────────────────────

export const spacing = {
  0: "0px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
} as const;

// ─── Tailwind Utility Classes ───────────────────────────────────────────────
// 자주 사용하는 Tailwind 클래스 조합을 미리 정의

export const textStyle = {
  "heading-xl": "text-xl font-bold leading-7 tracking-[-0.20px]",
  "heading-lg": "text-lg font-bold leading-[26px] tracking-[-0.18px]",
  "heading-md": "text-base font-semibold leading-6 tracking-[-0.16px]",
  "body-default": "text-[13px] font-medium leading-5 tracking-[-0.13px]",
  "body-regular": "text-[13px] font-normal leading-5 tracking-[-0.13px]",
  "body-bold": "text-[13px] font-bold leading-5 tracking-[-0.13px]",
  "body-sm": "text-sm font-medium leading-5 tracking-[-0.14px]",
  "body-sm-bold": "text-sm font-bold leading-5 tracking-[-0.14px]",
  "label-xs": "text-xs font-normal leading-[18px] tracking-[-0.12px]",
  "label-2xs": "text-[10px] font-bold leading-[14px] tracking-[-0.10px]",
  "caption": "text-[11px] font-normal leading-[14.3px] tracking-[-0.11px]",
  "number-2xl": "text-2xl font-bold leading-9 tracking-[-0.24px]",
} as const;
