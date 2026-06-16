import type { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentResult from '@/app/payment/_sections/PaymentResult/PaymentResult';

export const metadata: Metadata = {
  title: 'Payment failed — Minecraft Game',
  description: 'Your payment did not go through.',
};

export default function PaymentFailedPage() {
  return (
    <Suspense>
      <PaymentResult status="failed" />
    </Suspense>
  );
}
