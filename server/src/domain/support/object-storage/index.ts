import type { Upload } from "@aws-sdk/lib-storage/dist-types/Upload";
import type { Result } from "@/util/result-util";

export class ObjectStoreUnexpectedError extends Error {
  override name = "ObjectStoreUnexpectedError" as const;

  override message =
    "An unexpected error occurred during the operation of the object store" as const;
}

export type UploadObjectToStorageParams = {
  bucket: string;
  key: string;
  stream: NodeJS.ReadableStream | Buffer;
};

export type UploadObjectToStorageResponse = {
  upload: Upload;
};

export type UploadObjectToStorageResult = Result<
  UploadObjectToStorageResponse,
  Error
>;

export type ObjectStorage = {
  uploadObjectToStorage: (
    params: UploadObjectToStorageParams
  ) => Promise<UploadObjectToStorageResult>;
};
