import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

export const API_TIMEOUT_MS = 12000;

type RetryableConfig = InternalAxiosRequestConfig & {
  __retryCount?: number;
};

const isRetryableAxiosError = (error: AxiosError): boolean => {
  if (!error.response) return true;
  return [429, 502, 503, 504].includes(error.response.status);
};

const attachGetRetry = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RetryableConfig | undefined;
      if (!config) {
        return Promise.reject(error);
      }

      const method = (config.method || 'get').toLowerCase();
      if (method !== 'get' && method !== 'head') {
        return Promise.reject(error);
      }

      const retryCount = config.__retryCount ?? 0;
      if (!isRetryableAxiosError(error) || retryCount >= 1) {
        return Promise.reject(error);
      }

      const nextRetryCount = retryCount + 1;
      config.__retryCount = nextRetryCount;
      await new Promise((resolve) => setTimeout(resolve, 300 * nextRetryCount));
      return instance.request(config);
    },
  );
};

export const createApiClient = (config: AxiosRequestConfig = {}): AxiosInstance => {
  const instance = axios.create({
    ...config,
    timeout: config.timeout ?? API_TIMEOUT_MS,
  });
  attachGetRetry(instance);
  return instance;
};

export const apiAxios = Object.assign(createApiClient(), {
  isAxiosError: axios.isAxiosError,
}) as AxiosInstance & { isAxiosError: typeof axios.isAxiosError };

export default apiAxios;

export const apiFetch: typeof fetch = (input, init) => {
  return fetch(input, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(API_TIMEOUT_MS),
  });
};
