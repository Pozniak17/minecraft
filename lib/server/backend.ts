import axios, { type AxiosRequestConfig } from 'axios';

export const backend = axios.create({
  baseURL: process.env.BACKEND_API_URL ?? 'https://api.minecraftsgame.com/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Будує конфіг із Bearer-заголовком для авторизованих запитів до бекенду.
export function backendAuth(token: string | null): AxiosRequestConfig {
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}
