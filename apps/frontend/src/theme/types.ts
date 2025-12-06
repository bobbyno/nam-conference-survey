export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  systemPreference: Theme;
}

export interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Brand colors (adapted for theme)
  primary: string; // Equal Experts Blue #1795d4
  primaryHover: string;
  navy: string; // Equal Experts Navy #22567c
  charcoal: string; // Equal Experts Charcoal #2c3234

  // UI element colors
  border: string;
  borderFocus: string;
  inputBackground: string;
  buttonBackground: string;
  cardBackground: string;

  // State colors
  success: string;
  warning: string;
  error: string;
  info: string;
}
