import type { Metadata } from 'next';
import RegistrationForm from './_sections/RegistrationForm/RegistrationForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join 12,000+ players. Create your account in under a minute.',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <RegistrationForm />;
}
