import type { RedisClientType } from "redis";
import type { Logger } from "@/domain/support/logger";
import {
  RedisUnexpectedError,
  type RedisCacheResult,
  type RedisClient,
} from "@/domain/support/redis";

export class RedisServiceImpl implements RedisClient {
  #client: RedisClientType;
  readonly #logger: Logger;

  constructor({ client, logger }: { client: RedisClientType; logger: Logger }) {
    this.#client = client;
    this.#logger = logger;

    this.#client.on("error", (err) => {
      this.#logger.error("Redis Client Error", err);
    });

    this.#client.connect().catch((err) => {
      this.#logger.error("Failed to connect to Redis", err);
    });
  }

  async set(key: string, value: string): Promise<RedisCacheResult<void>> {
    this.#logger.debug("set cache", { key, value });
    try {
      await this.#client.set(key, value);
      return { success: true, data: undefined };
    } catch (error) {
      this.#logger.error("Failed to set cache", error as Error);
      return {
        success: false,
        error: new RedisUnexpectedError(),
      };
    }
  }

  async get(key: string): Promise<RedisCacheResult<string | null>> {
    this.#logger.debug("get cache", { key });
    try {
      const value = await this.#client.get(key);
      return { success: true, data: value };
    } catch (error) {
      this.#logger.error("Failed to get cache", error as Error);
      return {
        success: false,
        error: new RedisUnexpectedError(),
      };
    }
  }

  async del(key: string): Promise<RedisCacheResult<void>> {
    this.#logger.debug("delete cache", { key });
    try {
      await this.#client.del(key);
      return { success: true, data: undefined };
    } catch (error) {
      this.#logger.error("Failed to delete cache", error as Error);
      return {
        success: false,
        error: new RedisUnexpectedError(),
      };
    }
  }
}
