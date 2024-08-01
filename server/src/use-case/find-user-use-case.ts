import {
  NotFoundUserError,
  type UserRepository,
} from "@/domain/model/user/user-repository";
import type { UsersResponse } from "@/generated/api/@types";
import type { DatabaseError, UnexpectedError } from "@/util/error-util";
import type { Result } from "@/util/result-util";
import type { UseCase } from "./interfaces";
import type { Logger } from "@/domain/support/logger";
import { dateToIsoString } from "@/util/date-util";

export type findUserUseCaseInput = {};
export type findUserUseCaseOutput = UsersResponse;
export type findUserUseCaseException =
  | DatabaseError
  | UnexpectedError
  | NotFoundUserError;

export type FindUserUseCaseResult = Result<
  findUserUseCaseOutput,
  findUserUseCaseException
>;
export type FindUserUseCase = UseCase<
  findUserUseCaseInput,
  findUserUseCaseOutput,
  findUserUseCaseException
>;
export type FindUserUseCaseProps = {
  readonly userRepository: UserRepository;
  readonly logger: Logger;
};

export class FindUserUseCaseImpl implements FindUserUseCase {
  readonly #userRepository: UserRepository;

  readonly #logger: Logger;

  constructor({ userRepository, logger }: FindUserUseCaseProps) {
    this.#userRepository = userRepository;
    this.#logger = logger;
  }

  async execute(): Promise<FindUserUseCaseResult> {
    this.#logger.debug("execute find user use case");
    const findUserResult = await this.#userRepository.findMany();

    if (findUserResult.success === false) {
      return {
        success: false,
        error: findUserResult.error,
      };
    }

    if (findUserResult.data == null) {
      return {
        success: false,
        error: new NotFoundUserError(),
      };
    }

    return {
      success: true,
      data: {
        users: findUserResult.data.map((user) => ({
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          avatar: user.avatar!,
          dayOfBirth: dateToIsoString(user.dayOfBirth!),
          phoneNumber: user.phoneNumber,
        })),
      },
    };
  }
}
