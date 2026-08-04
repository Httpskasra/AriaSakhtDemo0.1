import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiErrorInfo, ApiErrorPayload } from '~/types/api';

const messages: Record<number, string> = {
  400: 'اطلاعات ارسال‌شده صحیح نیست.',
  401: 'برای ادامه باید وارد حساب کاربری شوید.',
  403: 'شما اجازه انجام این کار را ندارید.',
  404: 'اطلاعات موردنظر پیدا نشد.',
  409: 'این درخواست با وضعیت فعلی سازگار نیست.',
  413: 'حجم اطلاعات ارسالی بیش از حد مجاز است.',
  422: 'اطلاعات واردشده نیاز به اصلاح دارد.',
  429: 'تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.',
};

export class UserFacingApiError extends Error {
  readonly info: ApiErrorInfo;

  constructor(info: ApiErrorInfo) {
    super(info.message);
    this.name = 'UserFacingApiError';
    this.info = info;
  }
}

export function toUserFacingError(error: unknown, fallback = 'ارتباط با سرور با مشکل مواجه شد.'): UserFacingApiError {
  if (error instanceof UserFacingApiError) return error;
  const axiosError = error as AxiosError<ApiErrorPayload>;
  const status = axiosError.response?.status;
  const payload = axiosError.response?.data;
  return new UserFacingApiError({
    status,
    code: payload?.code,
    message: (typeof payload?.message === 'string' ? payload.message : undefined)
      || (status && messages[status])
      || fallback,
    retryable: !status || status >= 500 || status === 408 || status === 429,
  });
}

export interface TypedApiClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}

export function useApiClient(): TypedApiClient {
  const { $axios } = useNuxtApp();
  const client = $axios as AxiosInstance;
  const request = async <T>(operation: () => Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> => {
    try {
      return await operation();
    } catch (error) {
      throw toUserFacingError(error);
    }
  };
  return {
    get: <T>(url: string, config?: AxiosRequestConfig) => request(() => client.get<T>(url, config)),
    post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => request(() => client.post<T>(url, body, config)),
    patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => request(() => client.patch<T>(url, body, config)),
    put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => request(() => client.put<T>(url, body, config)),
    delete: <T>(url: string, config?: AxiosRequestConfig) => request(() => client.delete<T>(url, config)),
  };
}
