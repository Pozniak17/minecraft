import { http } from './http';
import type { AddToCartInput, OrderItem } from './types';

export async function getOrderItems() {
  const { data } = await http.get<OrderItem[]>('/cart/items');
  return data;
}

export async function addToCart(input: AddToCartInput) {
  const { data } = await http.post('/cart/add', input);
  return data;
}

export async function changeItemAmount(itemId: string, amount: number) {
  const { data } = await http.post(`/cart/items/${itemId}`, { amount });
  return data;
}

export async function removeFromCart(itemId: string) {
  const { data } = await http.post(`/cart/items/${itemId}/remove`, {});
  return data;
}
