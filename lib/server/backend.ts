import axios from 'axios';

export const backend = axios.create({
  baseURL: process.env.BACKEND_API_URL ?? 'https://api.minecraftsgame.com/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});
