import type { ApiV1 } from '../shared/ipcTypes';

declare global {
  interface Window {
    api: { v1: ApiV1 };
  }
}

export {};
