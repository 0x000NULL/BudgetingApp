import React, { createContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from './themes';
import type { Theme } from './types';

export const ThemeContext = createContext<Theme>(lightTheme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);
  
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? darkTheme : lightTheme);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 