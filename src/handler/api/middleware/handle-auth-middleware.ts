import type { NextFunction, Request, Response } from "express";
import {
  UnauthorizedError,
  InvalidRequestError,
  InvalidTokenError,
  InsufficientScopeError,
} from "express-oauth2-jwt-bearer";
import type { Logger } from "../../../domain/support/logger";

type VerifyJwtError =
  | UnauthorizedError
  | InvalidRequestError
  | InvalidTokenError
  | InsufficientScopeError
  | Error;

export class VerifyJwtInternalServerError extends Error {
  override name = "VerifyJwtInternalServerError" as const;

  override message =
    "An internal error occurred during token verification" as const;
}

/**
 * Middleware to handle results from express-oauth2-jwt-bearer
 */
export const buildHandleVerifyJwtMiddleware =
  ({ logger }: { logger: Logger }) =>
  (
    error: VerifyJwtError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    logger.debug("Error occurred in verifyJwt", {
      message: error.message,
    });

    if (
      !(
        error instanceof InsufficientScopeError ||
        error instanceof InvalidRequestError ||
        error instanceof InvalidTokenError ||
        error instanceof UnauthorizedError
      )
    ) {
      logger.error("Internal error occurred in VerifyJwt", error);
      const verifyJwtInternalServerError = new VerifyJwtInternalServerError();
      return res.status(500).send({
        name: verifyJwtInternalServerError.name,
        message: verifyJwtInternalServerError.message,
      });
    }

    logger.info("Token verification failed", {
      message: error.message,
      name: error.name,
    });
    return res.status(401).send({
      name: "UnauthorizedError",
      message: "Authentication failed",
    });
  };
