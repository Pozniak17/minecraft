import type { Metadata } from 'next';
import ForgotPasswordForm from './_sections/ForgotPasswordForm/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  description:
    'Enter the email you registered with. We will send a one-time link to set a new password.',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
