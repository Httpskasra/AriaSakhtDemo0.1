export interface ApiErrorPayload {
  message?: string | string[];
  statusCode?: number;
  code?: string;
}

export interface ApiErrorInfo {
  status?: number;
  code?: string;
  message: string;
  retryable: boolean;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';
