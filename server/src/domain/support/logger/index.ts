export type AdditionalData =
  | Error
  | {
      [key: string]: unknown;
    };

export type Logger = {
  debug(message: string, data?: AdditionalData): void;
  info(message: string, data?: AdditionalData): void;
  warn(message: string, data?: AdditionalData): void;
  error(message: string, data?: AdditionalData): void;
  appendKeys(params: { [key: string]: unknown }): void;
  resetKeys(): void;
};
