import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import i18n from '@/lib/i18n';
import LoginPage from '../LoginPage';

export default function LoginPageExample() {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <LoginPage onLogin={(user) => console.log('Login:', user)} />
        <Toaster position="top-right" />
      </I18nextProvider>
    </ThemeProvider>
  );
}
