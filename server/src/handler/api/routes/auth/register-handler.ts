import type * as inversify from "inversify";
import type { Request, Response } from "express";
import { type Logger } from "@/domain/support/logger";
import { type RegisterUserUseCase } from "@/use-case/register-user-use-case";
import { LOGGER, REGISTER_USER_USE_CASE } from "@/di-container/service-id";
import {
  ConflictError,
  DatabaseError,
  ExhaustiveError,
  UnexpectedError,
  unexpectedErrorMessage,
} from "@/util/error-util";
import { type UserRegisterRequest } from "@/generated/api/@types";

export const buildRegisterUserHandler =
  ({ container }: { container: inversify.Container }) =>
  async (req: Request<undefined>, res: Response) => {
    const logger = container.get<Logger>(LOGGER);
    const registerUserUseCase = container.get<RegisterUserUseCase>(
      REGISTER_USER_USE_CASE
    );

    try {
      const input: UserRegisterRequest = req.body;

      const registerUserResult = await registerUserUseCase.execute({ input });

      if (registerUserResult.success === false) {
        const { error } = registerUserResult;

        if (error instanceof ConflictError) {
          logger.error(error.message, error);
          res.status(400).send({
            name: error.name,
            message: error.message,
          });
          return;
        }

        if (
          error instanceof UnexpectedError ||
          error instanceof DatabaseError
        ) {
          logger.error(unexpectedErrorMessage, error);
          res.status(500).send({
            name: error.name,
            message: unexpectedErrorMessage,
          });
          return;
        }
        throw new ExhaustiveError(error);
      }

      res.status(201).send(registerUserResult.data);
    } catch (error) {
      logger.error(
        "Unexpected error caught in save user handler",
        error as Error
      );
      res.status(500).send({
        name: new UnexpectedError().name,
        message: unexpectedErrorMessage,
      });
    }
  };
