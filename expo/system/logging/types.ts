export type LogLevel = 'error' | 'info' | 'debug';

export interface LogSink {
  Log(level: LogLevel, event: string, message: string, data?: Record<string, any>): void;
}
