import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from '../theme/useTheme';

export interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

export function ThemeToggle({ size = 'md', ariaLabel }: ThemeToggleProps): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const { setColorScheme } = useMantineColorScheme();

  const isDark = theme === 'dark';
  const label = ariaLabel ?? (isDark ? 'Switch to light mode' : 'Switch to dark mode');

  const handleToggle = (): void => {
    toggleTheme();
    // Also update Mantine's color scheme
    setColorScheme(isDark ? 'light' : 'dark');
  };

  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;

  return (
    <ActionIcon
      onClick={handleToggle}
      size={size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg'}
      variant="subtle"
      color="gray"
      aria-label={label}
      title={label}
      style={{
        transition: 'background-color 150ms ease, color 150ms ease',
      }}
    >
      {isDark ? (
        <IconSun size={iconSize} aria-hidden="true" />
      ) : (
        <IconMoon size={iconSize} aria-hidden="true" />
      )}
      <span className="visually-hidden">{isDark ? 'Dark mode enabled' : 'Light mode enabled'}</span>
    </ActionIcon>
  );
}
