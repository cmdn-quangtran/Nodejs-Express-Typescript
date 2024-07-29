import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { initHandler } from "../init-handler";
import { HttpError } from "express-openapi-validator/dist/framework/types";
import {
  AccessDeniedError,
  ROLES_INVALID_ERROR_CODE,
  UnexpectedError,
} from "../../util/error-util";

import { type Logger } from "../../domain/support/logger";
import { LOGGER, ALLOW_ORIGINS } from "../../di-container/service-id";
import { buildHealthRouter } from "./routes/health/health.route";

export class NotFoundResourceError extends Error {
  override name = "NotFoundResourceError" as const;

  override message = "The requested resource was not found" as const;
}

const bootstrap = () => {
  const { container } = initHandler();
  const allowOrigins = container.get<string>(ALLOW_ORIGINS);
  const logger = container.get<Logger>(LOGGER);
  const app = express();

  app.use(
    cors(
      allowOrigins !== ""
        ? { origin: allowOrigins.split(","), optionsSuccessStatus: 200 }
        : undefined // If allowOrigins is an empty string, CORS will be set to wildcard
    )
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    logger.resetKeys();
    logger.appendKeys({
      path: req.path,
      method: req.method,
    });
    logger.info("Request Information", {
      method: req.method,
      path: req.path,
      params: req.params,
      query: req.query,
      body: req.body,
      header: req.headers,
    });

    res.on("finish", () => {
      logger.info("Response Status", { statusCode: res.statusCode });
    });

    next();
  });

  // Health check (no authentication required)
  app.use("/health", buildHealthRouter({ container }));

  app.get("/", (_req, res) => {
    res.status(200).send("Hello, World");
  });

  // Validation

  app.get("*", (req, res) => {
    logger.info("Access to undefined path", {
      message: "GET *",
      reqPath: req.path,
    });

    const notFoundResourceError = new NotFoundResourceError();
    res.status(404).send({
      name: notFoundResourceError.name,
      message: notFoundResourceError.message,
    });
  });

  // Comprehensive error handling
  app.use(
    (error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
      logger.error("Unhandled error caught by Express", error);
      if (error.message === ROLES_INVALID_ERROR_CODE) {
        const errorContent = new AccessDeniedError();
        res.status(403).send({
          name: errorContent.name,
          message: errorContent.message,
        });
      } else {
        res.status(500).send({
          name: new UnexpectedError().name,
          message: error.message,
        });
      }
    }
  );

  app.listen(80, () => {
    logger.info(`App listening on port ...`);
  });
};

bootstrap();
