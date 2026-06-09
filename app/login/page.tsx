import type { Metadata } from 'next';
import LoginForm from './_sections/LoginForm/LoginForm';

export const metadata: Metadata = {
  title: 'Log In — Minecraft Game',
  description: 'Sign in to continue building. Use the email and password you registered with.',
};

export default function LoginPage() {
  return <LoginForm />;
}
