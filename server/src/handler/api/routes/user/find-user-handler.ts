import type * as inversify from "inversify";
import type { Request, Response } from "express";
import { type Logger } from "@/domain/support/logger";
import { FIND_USER_USE_CASE, LOGGER } from "@/di-container/service-id";
import {
  DatabaseError,
  ExhaustiveError,
  UnexpectedError,
  unexpectedErrorMessage,
} from "@/util/error-util";
import type { FindUserUseCase } from "@/use-case/find-user-use-case";
import { NotFoundUserError } from "@/domain/model/user/user-repository";

export const buildFindUserHandler =
  ({ container }: { container: inversify.Container }) =>
  async (_req: Request<undefined>, res: Response) => {
    const logger = container.get<Logger>(LOGGER);
    const findUserUseCase = container.get<FindUserUseCase>(FIND_USER_USE_CASE);

    try {
      const findUserResult = await findUserUseCase.execute({});

      if (findUserResult.success === false) {
        const { error } = findUserResult;

        if (error instanceof NotFoundUserError) {
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

      res.status(200).send(findUserResult.data);
    } catch (error) {
      logger.error(
        "Unexpected error caught in find user handler",
        error as Error
      );
      res.status(500).send({
        name: new UnexpectedError().name,
        message: unexpectedErrorMessage,
      });
    }
  };
