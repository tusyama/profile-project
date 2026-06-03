import { ThemeProvider as SCThemeProvider } from 'styled-components';
import type { ReactNode } from 'react';
import { theme } from './theme';
import { GlobalStyles } from './GlobalStyles';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <SCThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </SCThemeProvider>
  );
}
