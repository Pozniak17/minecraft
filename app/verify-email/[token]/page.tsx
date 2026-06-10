import type { Metadata } from 'next';
import VerifyEmail from './_sections/VerifyEmail/VerifyEmail';

export const metadata: Metadata = {
  title: 'Verify Email — Minecraft Game',
  description: 'Activate your account to start playing.',
};

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { token } = await params;
  const { email } = await searchParams;

  return <VerifyEmail token={token} email={email ?? null} />;
}
