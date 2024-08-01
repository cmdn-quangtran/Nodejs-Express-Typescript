import type { Result } from "../util/result-util";

export type UseCaseExecuteResult<T, E extends Error> = Result<T, E>;

export type UseCase<Input, Output, Exception extends Error> = {
  execute(input: Input): Promise<UseCaseExecuteResult<Output, Exception>>;
};
