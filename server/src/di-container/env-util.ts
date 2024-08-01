export class NotFoundEnvError extends Error {
  constructor(envName: string) {
    super(`Environment variable ${envName} was not found.`);
    this.name = "EnvVarNotFoundError";
  }
}

/**
 * Check the existence of an environment variable and return its value if it exists.
 * Throw an error if it doesn't exist.
 *
 * @param {string} envName The name of the environment variable
 * @returns {string} The value of the environment variable
 */
export const unwrapEnv = (envName: string): string => {
  const envValue = process.env[envName];
  if (envValue == null) {
    throw new NotFoundEnvError(envName);
  }
  return envValue;
};
