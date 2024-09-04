import type {
  MultipleUploadPresignedURLResponse,
  OneUploadPresignedURLResponse,
  ,
} from "@/generated/api/@types";
import { UnexpectedError, type DatabaseError } from "@/util/error-util";
import type { Result } from "@/util/result-util";
import type { UseCase } from "./interfaces";
import type { Logger } from "@/domain/support/logger";
import {
  ObjectStoreUnexpectedError,
  type ObjectStorage,
} from "@/domain/support/object-storage";
export class InvalidFormatError extends Error {
  override name = "InvalidFormatError" as const;
}

export type UploadFileUseCaseInput = {
  bucketName: string;
  files: UploadPresignedURLParams["files"];
};
export type UploadFileUseCaseOutput = MultipleUploadPresignedURLResponse;
export type UploadFileUseCaseException =
  | DatabaseError
  | UnexpectedError
  | ObjectStoreUnexpectedError
  | InvalidFormatError;

export type UploadFileUseCaseResult = Result<
  UploadFileUseCaseOutput,
  UploadFileUseCaseException
>;
export type UploadFileUseCase = UseCase<
  UploadFileUseCaseInput,
  UploadFileUseCaseOutput,
  UploadFileUseCaseException
>;
export type UploadFileUseCaseProps = {
  readonly storage: ObjectStorage;
  readonly logger: Logger;
};

export class UploadFileUseCaseImpl implements UploadFileUseCase {
  readonly #storage: ObjectStorage;
  readonly #logger: Logger;

  constructor({ storage, logger }: UploadFileUseCaseProps) {
    this.#storage = storage;
    this.#logger = logger;
  }

  async execute({
    bucketName,
    files,
  }: UploadFileUseCaseInput): Promise<UploadFileUseCaseResult> {
    this.#logger.debug("Executing upload file use case");
    try {
      const uploadPromises = files.map(async (file) => {
        const fileType = getType(file.fileName);
        if (!fileType) {
          throw new InvalidFormatError(
            `Invalid file format for ${file.fileName}`
          );
        }

        const key = `${getPath(fileType)}/${Date.now()}-${file.fileName}`;

        const uploadResult = await this.#storage.uploadObjectToStorage({
          bucket: bucketName,
          key: key,
          stream: file.content as Buffer, // Assuming file.content is a Buffer
        });

        if (!uploadResult.success) {
          throw uploadResult.error;
        }

        const uploadResponse: OneUploadPresignedURLResponse = {
          fileName: file.fileName,
          uploadUrl: key, // This should be the actual URL, you might need to construct it
          fileType: fileType,
        };

        return uploadResponse;
      });

      const uploadResults = await Promise.all(uploadPromises);

      const response: MultipleUploadPresignedURLResponse = {
        files: uploadResults,
      };

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      this.#logger.error("Error in upload file use case", error);

      if (error instanceof InvalidFormatError) {
        return {
          success: false,
          error: error,
        };
      }

      if (error instanceof ObjectStoreUnexpectedError) {
        return {
          success: false,
          error: error,
        };
      }

      // For any other unexpected errors
      return {
        success: false,
        error: new UnexpectedError(
          "An unexpected error occurred during file upload"
        ),
      };
    }
  }
}
function randomUUID() {
  throw new Error("Function not implemented.");
}
