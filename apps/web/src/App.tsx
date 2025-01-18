import React from 'react';
import { ThemeProvider } from '@budget/ui';
import { Router } from './Router';
import { TRPCProvider } from './providers/TRPCProvider';

export function App() {
  return (
    <TRPCProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </TRPCProvider>
  );
} 