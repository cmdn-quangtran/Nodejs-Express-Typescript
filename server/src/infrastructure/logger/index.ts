import pino from "pino";
import type { Logger, AdditionalData } from "../../domain/support/logger";
import { dateToIsoString } from "../../util/date-util";

export type LogLevel = "debug" | "info" | "warn" | "error";

const loggingObjectFrom = (data?: AdditionalData) =>
  data instanceof Error
    ? {
        err: data,
      }
    : {
        data,
      };

export class LoggerImpl implements Logger {
  #logger: pino.Logger;

  #logLevel: LogLevel;

  constructor({ logLevel }: { logLevel: LogLevel }) {
    this.#logger = pino({
      level: logLevel,
      timestamp: () =>
        `, "timestamp":"${dateToIsoString(
          new Date(),
          "YYYY-MM-DDTHH:mm:ss.SSSZZ"
        )}"`,
      mixin(_context, level) {
        return { logLevel: pino.levels.labels[level]?.toUpperCase() };
      },
    });
    this.#logLevel = logLevel;
  }

  debug(message: string, data?: AdditionalData): void {
    this.#logger.debug(loggingObjectFrom(data), message);
  }

  info(message: string, data?: AdditionalData): void {
    this.#logger.info(loggingObjectFrom(data), message);
  }

  warn(message: string, data?: AdditionalData): void {
    this.#logger.warn(loggingObjectFrom(data), message);
  }

  error(message: string, data?: AdditionalData): void {
    this.#logger.error(loggingObjectFrom(data), message);
  }

  appendKeys(options: { [key: string]: unknown }): void {
    this.#logger = this.#logger.child({ ...options });
  }

  resetKeys(): void {
    this.#logger = pino({
      level: this.#logLevel,
      timestamp: () => `, "timestamp":"${dateToIsoString(new Date())}"`,
      mixin(_context, level) {
        return { logLevel: pino.levels.labels[level]?.toUpperCase() };
      },
    });
  }
}
