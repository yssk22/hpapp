import { LogLevel, LogSink } from "@hpapp/system/logging/types";
import Constants from "expo-constants";

const consoleEvents: Array<RegExp> = (
  Constants.expoConfig?.extra?.hpapp?.consoleEvents || [".*"]
).map((re: string) => {
  return new RegExp(re);
});

class Console implements LogSink {
  constructor() {}
  Log(
    level: LogLevel,
    event: string,
    message: string,
    data?: Record<string, any> | undefined
  ): void {
    // isFocus event
    const isFocus =
      consoleEvents.filter((r) => {
        return r.test(event);
      }).length > 0;

    if (level === "error") {
      if (isFocus) {
        console.error(event, message, JSON.stringify(data, null, "  "));
      } else {
        console.error(event, message);
      }
    } else {
      if (isFocus) {
        console.log(event, message, JSON.stringify(data, null, "  "));
      } else {
        console.log(event, message);
      }
    }
  }
}

export default new Console();
