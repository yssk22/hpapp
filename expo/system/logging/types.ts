export type LogLevel = 'error' | 'info';

export interface LogSink {
  Log(level: LogLevel, event: string, message: string, data?: Record<string, any>): void;
}
