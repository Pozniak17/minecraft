'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './PaymentResult.module.css';

type Status = 'success' | 'failed';

const COPY: Record<Status, {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}> = {
  success: {
    eyebrow: 'Payment complete',
    title: 'Thank you for your purchase',
    subtitle:
      'Your payment went through. Privileges and crystals are delivered to your in-game nickname on the selected server.',
    primary: { label: 'Go to dashboard', href: '/dashboard' },
    secondary: { label: 'View purchase history', href: '/dashboard/history' },
  },
  failed: {
    eyebrow: 'Payment failed',
    title: 'Your payment did not go through',
    subtitle:
      'No money was charged. You can return to your cart and try again, or use a different payment method.',
    primary: { label: 'Back to cart', href: '/dashboard/cart' },
    secondary: { label: 'Back to shop', href: '/dashboard/shop' },
  },
};

export default function PaymentResult({ status }: { status: Status }) {
  const params = useSearchParams();
  // Провайдер часто додає референс платежу в query — показуємо, якщо є.
  const orderRef =
    params.get('order') ??
    params.get('order_id') ??
    params.get('id') ??
    params.get('payment_id');

  const copy = COPY[status];

  return (
    <div className={`${styles.root} ${styles[status]}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/icons/icons/logo.webp"
            alt="Minecraft game logo"
            width={200}
            height={55}
            priority
          />
        </Link>

        <div className={styles.card}>
          <span className={styles.icon} aria-hidden="true">
            {status === 'success' ? '✓' : '×'}
          </span>

          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.subtitle}>{copy.subtitle}</p>

          {orderRef && (
            <p className={styles.orderRef}>
              Reference: <span className={styles.orderRefValue}>{orderRef}</span>
            </p>
          )}

          <div className={styles.actions}>
            <Link href={copy.primary.href} className={styles.primaryBtn}>
              {copy.primary.label}
            </Link>
            <Link href={copy.secondary.href} className={styles.secondaryBtn}>
              {copy.secondary.label}
            </Link>
          </div>
        </div>

        <p className={styles.help}>
          Something looks wrong?{' '}
          <Link href="/faq" className={styles.helpLink}>
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
