/**
 * provides a logging framework
 */
import Console from './Console';
import { LogSink } from './types';

// TODO: provide a way to customize the sink
const sink: LogSink = Console;

/**
 * log a record at INFO level
 */
export function Info(event: string, message: string, data?: Record<string, any>) {
  sink.Log('info', event, message, data);
}

/**
 * log a record at ERROR level
 */
export function Error(event: string, message: string, data?: Record<string, any>) {
  sink.Log('error', event, message, data);
}

/**
 * log a record at DEBUG level. only write it to the sing when __DEV__ is true
 */
export function Debug(event: string, message: string, data?: Record<string, any>) {
  sink.Log('debug', event, message, data);
}
