'use client';

const PURCHASE_SUCCESS_KEY = 'purchase-success-pending';

export function notifyPurchaseSuccess() {
  sessionStorage.setItem(PURCHASE_SUCCESS_KEY, String(Date.now()));
}

export function hasPurchaseSuccessPending(): boolean {
  return sessionStorage.getItem(PURCHASE_SUCCESS_KEY) !== null;
}

export function clearPurchaseSuccess() {
  sessionStorage.removeItem(PURCHASE_SUCCESS_KEY);
}
