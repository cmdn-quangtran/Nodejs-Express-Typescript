import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { Readable } from "stream";
import type {
  ObjectStorage,
  UploadObjectToStorageParams,
  UploadObjectToStorageResult,
} from "@/domain/support/object-storage";
import type { Logger } from "@/domain/support/logger";

export class ObjectStorageImpl implements ObjectStorage {
  readonly #client: S3Client;

  readonly #logger: Logger;

  constructor({ client, logger }: { client: S3Client; logger: Logger }) {
    this.#client = client;
    this.#logger = logger;
  }

  async uploadObjectToStorage({
    bucket,
    key,
    stream,
  }: UploadObjectToStorageParams): Promise<UploadObjectToStorageResult> {
    try {
      const s3UploadFile = new Upload({
        client: this.#client,
        params: {
          Bucket: bucket,
          Key: key,
          Body: stream as Readable,
        },
        partSize: 1024 * 1024 * 10,
      });

      s3UploadFile.on("httpUploadProgress", (progress) => {
        console.log(progress);
      });
      await s3UploadFile.done();

      return {
        success: true,
        data: {
          upload: s3UploadFile,
        },
      };
    } catch (error) {
      this.#logger.debug("Failed to upload stream to S3");
      return {
        success: false,
        error: error as Error,
      };
    }
  }
}
