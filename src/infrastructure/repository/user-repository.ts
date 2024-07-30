import type { DB } from "../../../prisma/generated/types";
import { User } from "../../domain/model/user/user";
import {
  findByEmailResult,
  saveResult,
  UserRepository,
} from "../../domain/model/user/user-repository";
import type { Logger } from "../../domain/support/logger";
import { Kysely } from "kysely";
import { DatabaseError } from "../../util/error-util";

export type EmployeeRepositoryProps = {
  dbClient: Kysely<DB>;
  logger: Logger;
};

export class UserRepositoryImpl implements UserRepository {
  readonly #dbClient: Kysely<DB>;

  readonly #logger: Logger;

  constructor({ dbClient, logger }: EmployeeRepositoryProps) {
    this.#dbClient = dbClient;
    this.#logger = logger;
  }

  async save(user: User): Promise<saveResult> {
    try {
      await this.#dbClient
        .insertInto("User")
        .values({
          id: user.id,
          email: user.email,
          password: user.password,
          username: user.username,
          role: user.role,
          name: user.name,
          avatar: user.avatar,
          dayOfBirth: user.dayOfBirth,
          phoneNumber: user.phoneNumber,
          updatedAt: new Date(),
        })
        .onConflict((oc) =>
          oc.columns(["id"]).doUpdateSet({
            email: user.email,
            password: user.password,
            username: user.username,
            role: user.role,
            name: user.name,
            avatar: user.avatar,
            dayOfBirth: user.dayOfBirth,
            phoneNumber: user.phoneNumber,
            updatedAt: new Date(),
          })
        )
        .executeTakeFirst();

      this.#logger.debug("Success to save user");
      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      this.#logger.error("Failed to save", error as Error);
      return {
        success: false,
        error: new DatabaseError(),
      };
    }
  }

  async findByEmail(email: string): Promise<findByEmailResult> {
    try {
      const user = await this.#dbClient
        .selectFrom("User")
        .select([
          "id",
          "email",
          "password",
          "username",
          "role",
          "name",
          "avatar",
          "dayOfBirth",
          "phoneNumber",
          "createdAt",
          "updatedAt",
        ])
        .where("email", "=", email)
        .executeTakeFirst();

      if (user === undefined) {
        return {
          success: true,
          data: undefined,
        };
      }

      this.#logger.debug("Success to find by email");
      return {
        success: true,
        data: new User(user),
      };
    } catch (error) {
      this.#logger.error("Failed to find by email", error as Error);
      return {
        success: false,
        error: new DatabaseError(),
      };
    }
  }
}
