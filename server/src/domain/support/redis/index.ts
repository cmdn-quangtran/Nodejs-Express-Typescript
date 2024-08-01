export class RedisUnexpectedError extends Error {
  override name = "RedisUnexpectedError";

  override message = "Unexpected error occurred with Redis";
}

export type RedisCacheResult<T> =
  | { success: true; data: T }
  | { success: false; error: RedisUnexpectedError };

export type RedisClient = {
  set: (key: string, value: string) => Promise<RedisCacheResult<void>>;
  get: (key: string) => Promise<RedisCacheResult<string | null>>;
  del: (key: string) => Promise<RedisCacheResult<void>>;
};
