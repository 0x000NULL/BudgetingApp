import { env } from '@budget/core';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    logMessage('info', message, context);
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    logMessage('warn', message, context);
  },
  error: (message: string, context?: Record<string, unknown>) => {
    logMessage('error', message, context);
  },
};

function logMessage(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  if (env.NODE_ENV === 'production') {
    // Send to logging service
  } else {
    console[level](entry);
  }
} 