/**
 * Environment Variables
 */
export const ALLOW_ORIGINS = "ALLOW_ORIGINS" as const;
export const LOG_LEVEL = "LOG_LEVEL" as const;
export const AUTH0_AUDIENCE = "AUTH0_AUDIENCE" as const;
export const AUTH0_ISSUE_BASE_URL = "AUTH0_ISSUE_BASE_URL" as const;
export const DATABASE_HOST = "DATABASE_HOST" as const;
export const DATABASE_PASSWORD = "DATABASE_PASSWORD" as const;

/**
 * Utilities
 */
export const LOGGER = "LOGGER" as const;
export const REDIS_CLIENT = "REDIS_CLIENT" as const;

/**
 * Database Client
 */
export const DB_CLIENT = "DB_CLIENT" as const;

/**
 * Repositories
 */
export const USER_REPOSITORY = "USER_REPOSITORY" as const;

/**
 * Use Cases
 */
export const REGISTER_USER_USE_CASE = "REGISTER_USER_USE_CASE" as const;
export const FIND_USER_USE_CASE = "FIND_USER_USE_CASE" as const;
