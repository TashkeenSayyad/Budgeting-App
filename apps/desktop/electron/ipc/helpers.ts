import type { Result } from '../../src/shared/types';

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function fail(message: string): Result<never> {
  return { ok: false, error: { code: 'UNKNOWN', message } };
}
