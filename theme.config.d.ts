export interface ColorSwatch {
  light: string;
  dark: string;
}

export interface ThemeColors {
  primary: ColorSwatch;
  secondary: ColorSwatch;
  background: ColorSwatch;
  surface: ColorSwatch;
  card: ColorSwatch;
  foreground: ColorSwatch;
  muted: ColorSwatch;
  border: ColorSwatch;
  success: ColorSwatch;
  warning: ColorSwatch;
  error: ColorSwatch;
  tint: ColorSwatch;
}

export declare const themeColors: ThemeColors;
