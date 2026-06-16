import { http } from './http';
import type { CreatePaymentInput } from './types';

export async function createPayment(input: CreatePaymentInput) {
  const { data } = await http.post('/payment/create', input);
  return data;
}
