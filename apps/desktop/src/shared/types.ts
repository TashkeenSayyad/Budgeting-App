export type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'DB_ERROR'
  | 'CONFLICT'
  | 'UNKNOWN';

export interface AppError {
  code: ErrorCode;
  message: string;
}

export interface Pagination {
  limit: number;
  offset: number;
}
