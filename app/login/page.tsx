import type { Metadata } from 'next';
import LoginForm from './_sections/LoginForm/LoginForm';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Sign in to continue building. Use the email and password you registered with.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginForm />;
}
