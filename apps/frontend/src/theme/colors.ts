import { ThemeColors } from './types';

// Light mode colors
export const lightTheme: ThemeColors = {
  background: '#ffffff',
  backgroundSecondary: '#f8f9fa',
  backgroundTertiary: '#e9ecef',

  text: '#2c3234', // Equal Experts Charcoal
  textSecondary: '#495057',
  textTertiary: '#6c757d',

  primary: '#1795d4', // Equal Experts Blue
  primaryHover: '#1582bd',
  navy: '#22567c', // Equal Experts Navy
  charcoal: '#2c3234', // Equal Experts Charcoal

  border: '#dee2e6',
  borderFocus: '#1795d4',
  inputBackground: '#ffffff',
  buttonBackground: '#1795d4',
  cardBackground: '#ffffff',

  success: '#51cf66',
  warning: '#ffc078',
  error: '#ff6b6b',
  info: '#74c0fc',
};

// Dark mode colors
export const darkTheme: ThemeColors = {
  background: '#1a1b1e',
  backgroundSecondary: '#25262b',
  backgroundTertiary: '#2c2e33',

  text: '#e1e1e1',
  textSecondary: '#a6a7ab',
  textTertiary: '#909296',

  primary: '#4db8e8', // Lightened Equal Experts Blue for dark mode
  primaryHover: '#65c3ed',
  navy: '#5c89ab', // Lightened Equal Experts Navy
  charcoal: '#e1e1e1', // Inverted for dark mode

  border: '#373a40',
  borderFocus: '#4db8e8',
  inputBackground: '#25262b',
  buttonBackground: '#4db8e8',
  cardBackground: '#25262b',

  success: '#51cf66',
  warning: '#ffc078',
  error: '#ff6b6b',
  info: '#74c0fc',
};
