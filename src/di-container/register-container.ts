import { Container } from "inversify";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import * as serviceId from "./service-id";
import type { DB } from "../../prisma/generated/types";
import { unwrapEnv } from "./env-util";
import { LoggerImpl, type LogLevel } from "../infrastructure/logger";
import { UserRepositoryImpl } from "../infrastructure/repository/user-repository";
import { RegisterUserUseCaseImpl } from "../use-case/register-user-use-case";
import { type UserRepository } from "../domain/model/user/user-repository";
import { type Logger } from "../domain/support/logger";
import { FindUserUseCaseImpl } from "@/use-case/find-user-use-case";

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
  /**
   * Database Redis
   */

  /**
   * Repositories
   */
  container
    .bind(serviceId.USER_REPOSITORY)
    .toDynamicValue(
      (ctx) =>
        new UserRepositoryImpl({
          dbClient: ctx.container.get<Kysely<DB>>(serviceId.DB_CLIENT),
          logger: ctx.container.get<LoggerImpl>(serviceId.LOGGER),
        })
    )
    .inSingletonScope();

  /**
   * Use Cases
   */
  container
    .bind(serviceId.REGISTER_USER_USE_CASE)
    .toDynamicValue(
      (ctx) =>
        new RegisterUserUseCaseImpl({
          userRepository: ctx.container.get<UserRepository>(
            serviceId.USER_REPOSITORY
          ),
          logger: ctx.container.get<Logger>(serviceId.LOGGER),
        })
    )
    .inSingletonScope();
  container
    .bind(serviceId.FIND_USER_USE_CASE)
    .toDynamicValue(
      (ctx) =>
        new FindUserUseCaseImpl({
          userRepository: ctx.container.get<UserRepository>(
            serviceId.USER_REPOSITORY
          ),
          logger: ctx.container.get<Logger>(serviceId.LOGGER),
        })
    )
    .inSingletonScope();

  return container;
};
