# Dark Mode Implementation for Survey Application

Conference attendees need to complete surveys comfortably in various lighting conditions, particularly during evening sessions or in dimly lit venues. This feature implements a dark mode theme with automatic system preference detection, manual toggle capability, and persistent user preference storage. The implementation reduces eye strain, improves accessibility, and provides a modern user experience expected in contemporary web applications.

## Requirements

- Survey automatically displays in dark mode when user's device settings prefer dark mode
- Users can manually toggle between light and dark themes using an accessible UI control
- Theme preference persists across page loads and browser sessions
- No flash of light theme occurs when loading pages with dark mode preference saved
- All text content meets WCAG AA contrast requirements in dark mode (minimum 4.5:1 for normal text, 3:1 for large text)
- Focus indicators are clearly visible in both light and dark modes
- Theme switching is instant without layout shift or performance degradation
- Theme toggle is keyboard accessible (Tab to focus, Enter/Space to activate)
- Theme toggle announces state changes to screen readers (e.g., "Dark mode enabled")
- All UI components (buttons, inputs, cards, modals, etc.) render correctly in both themes
- Dark mode works across Chrome, Safari, Firefox, and Edge browsers
- Equal Experts brand colors are adapted appropriately for dark mode while maintaining brand identity

## Rules

- rules/react-rules.md
- rules/typescript-rules.md
- rules/code-quality-rules.md
- rules/design-rules.md (if exists)

## Component Architecture

```typescript
// Theme types and configuration
type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  systemPreference: Theme;
}

// Color palette for both themes
interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Brand colors (adapted for theme)
  primary: string;        // Equal Experts Blue #1795d4
  primaryHover: string;
  navy: string;           // Equal Experts Navy #22567c
  charcoal: string;       // Equal Experts Charcoal #2c3234

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

// Theme provider component structure
const ThemeProvider: React.FC<{ children: React.ReactNode }> => {
  // Detects system preference using window.matchMedia('(prefers-color-scheme: dark)')
  // Loads saved preference from localStorage
  // Provides theme state and toggle function via Context
};

// Theme toggle component
interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> => {
  // Renders accessible button with icon (sun/moon)
  // Announces state change to screen readers
  // Keyboard accessible (Tab, Enter, Space)
};

// Custom hook for consuming theme
const useTheme = (): ThemeContextValue => {
  // Returns current theme and toggle function
};

// Component hierarchy
// App
//   └── ThemeProvider
//         └── MantineProvider (configured with current theme)
//               └── AppShell
//                     ├── Header (contains ThemeToggle)
//                     └── Main (all existing pages/components)
```

## Extra Considerations

- **Accessibility**: All text must meet WCAG AA contrast requirements in dark mode (4.5:1 for normal text, 3:1 for large text, 3:1 for UI components)
- **Accessibility**: Focus indicators must have 3:1 contrast ratio against background in both themes
- **Accessibility**: Theme toggle must announce current state to screen readers using aria-label or aria-live region
- **Performance**: Theme switching must be instant (<16ms) to avoid perceived lag
- **Performance**: No flash of unstyled content (FOUC) or flash of light theme on page load
- **Performance**: Theme preference detection should happen before first paint using inline script or SSR techniques
- **Browser Compatibility**: Must work on Chrome 90+, Safari 14+, Firefox 88+, Edge 90+
- **Browser Compatibility**: Test `prefers-color-scheme` media query support and provide fallback
- **User Experience**: Theme toggle should be easily discoverable (likely in header or footer)
- **User Experience**: Smooth transition between themes (consider subtle CSS transition on background/text colors)
- **Data Persistence**: Use localStorage to persist theme preference (key: "theme-preference")
- **Data Persistence**: Handle localStorage unavailable scenarios (private browsing, full storage)
- **Responsive Design**: Theme toggle should be accessible on mobile (375px) through desktop (1920px)
- **Brand Consistency**: Dark mode colors should maintain Equal Experts brand identity while ensuring readability
- **Mantine Integration**: Leverage Mantine's built-in color scheme support where possible
- **System Preference Sync**: Consider implementing an "auto" mode that always follows system preference (optional based on user story open question)

## Testing Considerations

- **Unit Tests**: Test ThemeProvider logic (system preference detection, localStorage read/write, toggle function)
- **Unit Tests**: Test ThemeToggle component (renders correctly, handles click, keyboard navigation, ARIA attributes)
- **Unit Tests**: Test useTheme hook returns correct values and updates on theme change
- **Integration Tests**: Test theme persistence across page reloads
- **Integration Tests**: Test theme application to all existing components (survey questions, forms, buttons, inputs)


## Implementation Notes

- **Mantine Integration**: Use Mantine's `MantineProvider` and `ColorSchemeProvider` to manage themes across all Mantine components
- **Mantine Integration**: Extend Mantine's default theme with custom Equal Experts colors for both light and dark modes
- **State Management**: Use React Context for theme state (no Redux/Zustand needed for this simple state)
- **Storage Strategy**: Use localStorage with key "theme-preference" (values: "light", "dark", "system")
- **FOUC Prevention**: Initialize theme in `<head>` using inline script before React hydration, OR use Mantine's `ColorSchemeScript` component
- **CSS Variables**: Consider using CSS custom properties for theme colors to enable instant switching without re-render
- **Transition Effects**: Apply subtle CSS transitions (150-200ms) to background-color and color properties for smooth theme switching
- **Icon Design**: Use appropriate icons for theme toggle (sun for light mode, moon for dark mode, or a simple toggle switch)
- **Component Pattern**: Prefer functional components with hooks (useContext, useState, useEffect)
- **TypeScript**: Use strict type checking for theme values (no 'any' types)
- **Code Organization**: Place theme-related code in `src/theme/` directory (provider, toggle, colors, types)
- **Equal Experts Branding**: Maintain brand colors in dark mode by adjusting lightness/saturation rather than completely changing hues

## Specification by Example

### Example 1: System Preference Detection (First Visit)

**Given**: User opens survey for the first time with device set to dark mode
**When**: Survey page loads
**Then**:
- Survey immediately renders in dark mode without flash of light theme
- Background is dark (#1a1b1e or similar)
- Text is light (#e1e1e1 or similar) with 4.5:1+ contrast
- Theme toggle shows moon icon (indicating dark mode is active)

### Example 2: Manual Theme Toggle

**Given**: User is viewing survey in light mode
**When**: User clicks/taps the theme toggle button in the header
**Then**:
- Theme switches to dark mode instantly (< 16ms)
- All components transition smoothly to dark colors
- Theme toggle icon changes from sun to moon
- localStorage is updated: `{ "theme-preference": "dark" }`
- Screen reader announces: "Dark mode enabled"

### Example 3: Theme Persistence

**Given**: User has toggled to dark mode in a previous session
**When**: User opens survey in a new browser tab or after closing and reopening browser
**Then**:
- Survey loads directly in dark mode (no flash of light theme)
- User's preference is preserved from localStorage

### Example 4: Keyboard Accessibility

**Given**: User is navigating with keyboard only
**When**: User presses Tab key to navigate to theme toggle
**Then**:
- Theme toggle receives visible focus indicator (outline or ring)
**When**: User presses Enter or Space key
**Then**:
- Theme switches between light and dark mode
- Focus remains on theme toggle button

### Example 5: Color Palette

```typescript
// Light mode colors
const lightTheme: ThemeColors = {
  background: '#ffffff',
  backgroundSecondary: '#f8f9fa',
  backgroundTertiary: '#e9ecef',

  text: '#2c3234',              // Equal Experts Charcoal
  textSecondary: '#495057',
  textTertiary: '#6c757d',

  primary: '#1795d4',           // Equal Experts Blue
  primaryHover: '#1582bd',
  navy: '#22567c',              // Equal Experts Navy
  charcoal: '#2c3234',          // Equal Experts Charcoal

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
const darkTheme: ThemeColors = {
  background: '#1a1b1e',
  backgroundSecondary: '#25262b',
  backgroundTertiary: '#2c2e33',

  text: '#e1e1e1',
  textSecondary: '#a6a7ab',
  textTertiary: '#909296',

  primary: '#4db8e8',           // Lightened Equal Experts Blue for dark mode
  primaryHover: '#65c3ed',
  navy: '#5c89ab',              // Lightened Equal Experts Navy
  charcoal: '#e1e1e1',          // Inverted for dark mode

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
```



## Verification

- [ ] Survey detects system preference on first visit and displays in matching theme
- [ ] Theme toggle button is visible and accessible in header on all pages
- [ ] Clicking theme toggle switches between light and dark modes instantly
- [ ] Theme preference persists across page reloads (stored in localStorage)
- [ ] No flash of light theme occurs when loading with dark mode preference
- [ ] All text meets WCAG AA contrast requirements in dark mode (verified with Lighthouse/axe)
- [ ] Focus indicators are clearly visible in both themes (3:1 contrast minimum)
- [ ] Theme toggle is keyboard accessible (Tab to focus, Enter/Space to activate)
- [ ] Screen reader announces theme state change ("Dark mode enabled/disabled")
- [ ] All survey question components render correctly in both themes
- [ ] All form inputs (text, radio, checkbox, select) are readable in both themes
- [ ] All buttons and interactive elements are visible in both themes
- [ ] Mantine UI components (modals, notifications, tooltips) work correctly in both themes
- [ ] Theme switching is instant without layout shift (verified in DevTools)
- [ ] Equal Experts brand colors are preserved appropriately in dark mode
- [ ] Tested and working on Chrome, Safari, Firefox, Edge (latest versions)
- [ ] Tested on mobile viewports (375px) and desktop (1920px)
- [ ] localStorage fallback works when storage is unavailable
- [ ] Theme toggle icon changes correctly (sun in light mode, moon in dark mode)
- [ ] Smooth CSS transitions occur during theme switching (no jarring color jumps)
