import { Container } from "inversify";
import * as serviceId from "./service-id";
import { unwrapEnv } from "./env-util";
import { LoggerImpl, type LogLevel } from "../infrastructure/logger";

export const registerContainer = (): Container => {
  const container = new Container();

  /**
   * Environment Variables
   */
  container
    .bind(serviceId.ALLOW_ORIGINS)
    .toConstantValue(unwrapEnv("ALLOW_ORIGINS"));
  container
    .bind(serviceId.LOG_LEVEL)
    .toDynamicValue(() => unwrapEnv("LOG_LEVEL"))
    .inSingletonScope();

  /**
   * Utilities
   */
  container
    .bind(serviceId.LOGGER)
    .toDynamicValue(
      () =>
        new LoggerImpl({
          logLevel: container.get<string>(serviceId.LOG_LEVEL) as LogLevel,
        })
    )
    .inSingletonScope();

  return container;
};
