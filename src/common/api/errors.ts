export type AppErrorCode =
  | "NETWORK_ERROR"
  | "HTTP_ERROR"
  | "PARSE_ERROR"
  | "UNKNOWN_ERROR"
  | "NOT_FOUND"
  | "CREDENTIALS_SIGNIN_ERROR";

export type AppError = {
  code: AppErrorCode;
  message: string;
  status?: number;
  cause?: unknown;
};

export function createAppError(
  code: AppErrorCode,
  message: string,
  options?: { status?: number; cause?: unknown },
): AppError {
  return {
    code,
    message,
    status: options?.status,
    cause: options?.cause,
  };
}
