import { DATE_FORMAT } from '../constants';

export const formatDate = (date: Date, format = DATE_FORMAT.DISPLAY): string => {
  // Simple implementation for now
  return new Intl.DateTimeFormat('en-US').format(date);
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
}; 