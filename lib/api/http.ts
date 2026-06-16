import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Клієнт для авторизованих запитів: на 401 один раз оновлює токен і повторює,
// інакше відправляє користувача на /login.
export const http = axios.create({ baseURL: '/api' });

let refreshing: Promise<boolean> | null = null;

function tryRefresh(): Promise<boolean> {
  if (!refreshing) {
    refreshing = axios
      .post('/api/auth/refresh')
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

http.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const ok = await tryRefresh();
      if (ok) return http(original);

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
