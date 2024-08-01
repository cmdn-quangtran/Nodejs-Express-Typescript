export type Success<T> = {
  success: true;
  data: T;
};

export type Failure<E extends Error> = {
  success: false;
  error: E;
};

/**
 * When `Result<T, never>` is used, it is inferred as `Success<T>`.
 *
 * @see https://stackoverflow.com/questions/65492464/typescript-never-type-condition
 */
export type Result<T, E extends Error> = E[] extends never[]
  ? Success<T>
  : Success<T> | Failure<E>;
