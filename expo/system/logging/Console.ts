/* eslint-disable no-console */
import Constants from 'expo-constants';

import { LogLevel, LogSink } from './types';

const defaultEvents: string[] = ['^$']; //'.*'; // '.*';

const consoleEvents: RegExp[] = (Constants.expoConfig?.extra?.hpapp?.consoleEvents || [defaultEvents]).map(
  (re: string) => {
    return new RegExp(re);
  }
);

/**
 * Console is an LogSink implemenation that uses console.log() and console.error()
 */
class Console implements LogSink {
  Log(level: LogLevel, event: string, message: string, data?: Record<string, any> | undefined): void {
    // isFocus event
    const isFocus =
      consoleEvents.filter((r) => {
        return r.test(event);
      }).length > 0;

    if (level === 'error') {
      console.error(event, message, JSON.stringify(data, null, '  '));
    } else if (level === 'debug') {
      if (__DEV__) {
        console.log(event, message, JSON.stringify(data, null, '  '));
      }
    } else {
      if (isFocus) {
        console.log(event, message, JSON.stringify(data, null, '  '));
      } else {
        console.log(event, message);
      }
    }
  }
}

export default new Console();
