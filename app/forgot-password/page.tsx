import type { Metadata } from 'next';
import ForgotPasswordForm from './_sections/ForgotPasswordForm/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password — Minecraft Game',
  description:
    'Enter the email you registered with. We will send a one-time link to set a new password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
