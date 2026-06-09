export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  password: string; // 4–24 символи
  email?: string;
}

export interface SendCodeInput {
  email: string;
}

export interface VerifyCodeInput {
  email: string;
  email_code: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ApiErrorBody {
  detail?: string;
  [field: string]: unknown; // DRF повертає помилки по полях
}
