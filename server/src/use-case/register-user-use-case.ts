import { randomUUID } from "crypto";
import { Role } from "prisma/generated/enums";
import type { UserRepository } from "@/domain/model/user/user-repository";
import { type Logger } from "@/domain/support/logger";
import type { UserRegisterRequest } from "@/generated/api/@types";
import {
  ConflictError,
  DatabaseError,
  UnexpectedError,
} from "@/util/error-util";
import { type Result } from "@/util/result-util";
import { type UseCase } from "./interfaces";
import { User } from "@/domain/model/user/user";

export type RegisterUserUseCaseInput = {
  input: UserRegisterRequest;
};

export type RegisterUserUseCaseOutput = undefined;

export type RegisterUserUseCaseException =
  | DatabaseError
  | UnexpectedError
  | ConflictError;

export type RegisterUserUseCaseResult = Result<
  RegisterUserUseCaseOutput,
  RegisterUserUseCaseException
>;

export type RegisterUserUseCase = UseCase<
  RegisterUserUseCaseInput,
  RegisterUserUseCaseOutput,
  RegisterUserUseCaseException
>;

export type RegisterUserUseCaseProps = {
  readonly userRepository: UserRepository;

  readonly logger: Logger;
};

export class RegisterUserUseCaseImpl implements RegisterUserUseCase {
  readonly #userRepository: UserRepository;

  readonly #logger: Logger;

  constructor({ userRepository, logger }: RegisterUserUseCaseProps) {
    this.#userRepository = userRepository;
    this.#logger = logger;
  }

  async execute({
    input,
  }: RegisterUserUseCaseInput): Promise<RegisterUserUseCaseResult> {
    this.#logger.debug("execute register user use case");
    const findUserResult = await this.#userRepository.findByEmail(input.email);
    if (findUserResult.success === true && findUserResult.data !== undefined) {
      return {
        success: false,
        error: new ConflictError("The user already exists"),
      };
    }

    const user: User = {
      ...input,
      id: randomUUID(),
      role: Role.USER,
      dayOfBirth: new Date(input.dayOfBirth),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const saveResult = await this.#userRepository.save(user);

    if (saveResult.success === false) {
      return {
        success: false,
        error: saveResult.error,
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }
}
