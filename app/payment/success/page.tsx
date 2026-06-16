import type { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentResult from '@/app/payment/_sections/PaymentResult/PaymentResult';

export const metadata: Metadata = {
  title: 'Payment successful — Minecraft Game',
  description: 'Your payment has been completed.',
};

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentResult status="success" />
    </Suspense>
  );
}
