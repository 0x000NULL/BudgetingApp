import { Platform } from 'react-native';

export const getResponsiveValue = (web: any, native: any) => {
  return Platform.select({
    web,
    default: native,
  });
}; 