/**
 * Error used for exhaustive checks
 *
 * In this system, we generally avoid throwing Errors, but we make an exception for exhaustive checks.
 *
 * @see https://typescriptbook.jp/reference/statements/never#%E4%BE%8B%E5%A4%96%E3%81%AB%E3%82%88%E3%82%8B%E7%B6%B2%E7%BE%85%E6%80%A7%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF
 */

export const ROLES_INVALID_ERROR_CODE = "ErrorSctRolesInvalid";

export class ExhaustiveError extends Error {
  override name = "ExhaustiveError" as const;

  constructor(value: never, message = `Unsupported type: ${value}`) {
    super(message);
  }
}

/**
 * Unexpected error
 */
export const unexpectedErrorMessage = "An unexpected error occurred.";
export class UnexpectedError extends Error {
  override name = "UnexpectedError" as const;

  constructor(message = unexpectedErrorMessage) {
    super(message);
  }
}

/**
 * Request error
 */
export const badRequestErrorMessage = "There is a problem with the request";
export class BadRequestError extends Error {
  override name = "BadRequestError" as const;

  constructor(message = badRequestErrorMessage) {
    super(message);
  }
}

/**
 * DB Error
 */
export class DatabaseError extends Error {
  override name = "DatabaseError" as const;
}

/**
 * Access Denied Error
 */
export const accessDeniedMessage = "Access Denied";
export class AccessDeniedError extends Error {
  override name = "AccessDeniedError" as const;

  constructor(message = accessDeniedMessage) {
    super(message);
  }
}

/**
 * forbiddenError
 */
export const forbiddenMessage =
  "Access to this resource on the server is denied";
export class ForbiddenError extends Error {
  override name = "ForbiddenError" as const;

  constructor(message = forbiddenMessage) {
    super(message);
  }
}
