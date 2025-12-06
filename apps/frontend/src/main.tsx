import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { theme } from './theme/theme';
import { ThemeProvider } from './theme/ThemeProvider';
import { useTheme } from './theme/useTheme';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles/global.css';

function AppWithTheme() {
  const { theme: colorScheme } = useTheme();

  return (
    <MantineProvider theme={theme} defaultColorScheme={colorScheme} forceColorScheme={colorScheme}>
      <Notifications position="top-right" />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorSchemeScript defaultColorScheme="light" />
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  </React.StrictMode>
);