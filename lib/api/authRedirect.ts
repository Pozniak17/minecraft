let suppressAuthRedirect = false;

export function setSuppressAuthRedirect(value: boolean) {
  suppressAuthRedirect = value;
}

export function isAuthRedirectSuppressed() {
  return suppressAuthRedirect;
}
