import type { Metadata } from 'next';
import RegistrationForm from './_sections/RegistrationForm/RegistrationForm';

export const metadata: Metadata = {
  title: 'Create Account — Minecraft Game',
  description: 'Join 12,000+ players. Create your account in under a minute.',
};

export default function RegisterPage() {
  return <RegistrationForm />;
}
