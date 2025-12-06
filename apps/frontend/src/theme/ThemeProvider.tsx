import { ReactNode, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { Theme } from './types';

const STORAGE_KEY = 'theme-preference';

interface ThemeProviderProps {
  children: ReactNode;
}

function getSystemPreference(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage unavailable (private browsing, full storage, etc.)
  }
  return null;
}

function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [systemPreference, setSystemPreference] = useState<Theme>(getSystemPreference);
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize theme before first render to prevent FOUC
    const stored = getStoredTheme();
    return stored ?? systemPreference;
  });

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent): void => {
      const newPreference: Theme = e.matches ? 'dark' : 'light';
      setSystemPreference(newPreference);

      // Only update theme if user hasn't manually set a preference
      const stored = getStoredTheme();
      if (!stored) {
        setTheme(newPreference);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleTheme = (): void => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storeTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, systemPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}
