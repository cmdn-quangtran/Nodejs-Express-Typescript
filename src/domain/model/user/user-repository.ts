import { DatabaseError } from "../../../util/error-util";
import { type Result } from "../../../util/result-util";
import { User } from "./user";

export class NotFoundUserError extends Error {
  override name = "NotFoundUserError" as const;

  override message = "The user was not found";
}

export type findByEmailResult = Result<User | undefined, DatabaseError>;
export type saveResult = Result<undefined, DatabaseError>;

export type UserRepository = {
  /**
   * Register a new user.
   * @param user
   * @returns Returns undefined
   */
  save(user: User): Promise<saveResult>;

  /**
   * Find user by email.
   * @param email
   * @returns Returns a user
   */
  findByEmail(email: string): Promise<findByEmailResult>;
};
