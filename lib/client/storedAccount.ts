const USER_EMAIL_STORAGE_KEY = 'user_email';
const PENDING_VERIFY_EMAIL_STORAGE_KEY = 'pending_verify_email';

/** Чи є локальна ознака, що користувач уже реєструвався / логінився в цьому браузері. */
export function readHasStoredAccount(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const email = window.localStorage.getItem(USER_EMAIL_STORAGE_KEY);
    const pending = window.localStorage.getItem(PENDING_VERIFY_EMAIL_STORAGE_KEY);
    return Boolean(email?.trim() || pending?.trim());
  } catch {
    return false;
  }
}
