import { apiClient } from './client';
import type {
  LoginInput,
  RegisterInput,
  SendCodeInput,
  VerifyCodeInput,
  RestorePasswordInput,
  ChangePasswordInput,
} from './types';

export function login(input: LoginInput) {
  return apiClient.post('/auth/login', input);
}

export function register(input: RegisterInput) {
  return apiClient.post('/auth/register', input);
}

export function sendEmailCode(input: SendCodeInput) {
  return apiClient.post('/auth/send-code', input);
}

export function verifyEmailCode(input: VerifyCodeInput) {
  return apiClient.post('/auth/verify-code', input);
}

export function logout() {
  return apiClient.post('/auth/logout');
}

export function restorePassword(input: RestorePasswordInput) {
  return apiClient.post('/auth/restore-password', input);
}

export function changePassword(input: ChangePasswordInput) {
  return apiClient.post('/auth/change-password', input);
}
