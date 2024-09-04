import type * as inversify from "inversify";
import type { Request, Response } from "express";
import { type Logger } from "@/domain/support/logger";
import {
  LOGGER,
  S3_BUCKET_NAME,
  UPLOAD_FILE_USE_CASE,
} from "@/di-container/service-id";
import {
  DatabaseError,
  ExhaustiveError,
  UnexpectedError,
  unexpectedErrorMessage,
} from "@/util/error-util";
import type { UploadFileUseCase } from "@/use-case/upload-file-use-case";
import { ObjectStoreUnexpectedError } from "@/domain/support/object-storage";

export const buildUploadFileHandler =
  ({ container }: { container: inversify.Container }) =>
  async (req: Request<{ UploadPresignedURLParams: any }>, res: Response) => {
    const logger = container.get<Logger>(LOGGER);
    const UploadFileUseCase =
      container.get<UploadFileUseCase>(UPLOAD_FILE_USE_CASE);
    const bucketName = container.get<string>(S3_BUCKET_NAME);
    const { files } = req.body;

    try {
      const uploadResult = await UploadFileUseCase.execute({
        bucketName,
        files,
      });

      if (!uploadResult.success) {
        const { error } = uploadResult;

        if (error instanceof ObjectStoreUnexpectedError) {
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

      res.status(201).send(uploadResult.data);
    } catch (error) {
      logger.error(
        "Unexpected error caught in upload file handler",
        error as Error
      );
      res.status(500).send({
        name: new UnexpectedError().name,
        message: unexpectedErrorMessage,
      });
    }
  };
