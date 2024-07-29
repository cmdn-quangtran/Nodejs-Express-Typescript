import { Container } from "inversify";
import * as serviceId from "./service-id";
import { Pool } from "pg";
import type { DB } from "../../prisma/generated/types";
import { unwrapEnv } from "./env-util";
import { LoggerImpl, type LogLevel } from "../infrastructure/logger";
import { Kysely, PostgresDialect } from "kysely";

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
  container
    .bind(serviceId.AUTH0_AUDIENCE)
    .toConstantValue(unwrapEnv("AUTH0_AUDIENCE"));
  container
    .bind(serviceId.AUTH0_ISSUE_BASE_URL)
    .toConstantValue(unwrapEnv("AUTH0_ISSUE_BASE_URL"));
  container
    .bind(serviceId.DATABASE_HOST)
    .toDynamicValue(() => unwrapEnv("DATABASE_HOST"))
    .inSingletonScope();
  container
    .bind(serviceId.DATABASE_PASSWORD)
    .toDynamicValue(() => unwrapEnv("DATABASE_PASSWORD"))
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

  /**
   * Database Client
   */
  container.bind(serviceId.DB_CLIENT).toDynamicValue(
    (ctx) =>
      new Kysely<DB>({
        dialect: new PostgresDialect({
          pool: new Pool({
            database: "shop",
            host: ctx.container.get<string>(serviceId.DATABASE_HOST),
            user: "shop_admin",
            password: ctx.container.get<string>(serviceId.DATABASE_PASSWORD),
            port: 5432,
            max: 10,
          }),
        }),
        log: (event) => {
          if (event.level === "query") {
            const logger = ctx.container.get<LoggerImpl>(serviceId.LOGGER);
            const time = Math.round(event.queryDurationMillis * 100) / 100;
            logger.debug("SQL", {
              sql: event.query.sql,
              parameters: event.query.parameters,
              time,
            });
          }
        },
      })
  );

  return container;
};
