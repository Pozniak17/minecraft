import axios, { type AxiosRequestConfig } from 'axios';

export const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? 'https://api.minecraftsgame.com/api/v1';

export const backend = axios.create({
  baseURL: BACKEND_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Будує конфіг із Bearer-заголовком для авторизованих запитів до бекенду.
export function backendAuth(token: string | null): AxiosRequestConfig {
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}
