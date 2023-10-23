import { LogLevel, LogSink } from "@hpapp/system/logging/types";
import Console from "@hpapp/system/logging/Console";

let sink: LogSink = Console;

export function Info(
  event: string,
  message: string,
  data?: Record<string, any>
) {
  sink.Log("info", event, message, data);
}

export function Error(
  event: string,
  message: string,
  data?: Record<string, any>
) {
  sink.Log("error", event, message, data);
}
