import { createContext } from 'react';
import { colors, typography, spacing, breakpoints } from '.';

export const ThemeContext = createContext({
  colors,
  typography,
  spacing,
  breakpoints,
}); 