import { DatabaseError } from "../../../util/error-util";
import { Result } from "../../../util/result-util";
import { User } from "./user";

export class NotFoundUserError extends Error {
  override name = "NotFoundUserError" as const;

  override message = "The user was not found";
}

export type saveResult = Result<undefined, DatabaseError>;

export type UserRepository = {
  /**
   * Register a new user.
   * @param user
   * @returns Returns undefined
   */
  save(user: User): Promise<saveResult>;
};
