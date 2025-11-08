import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import i18n from '@/lib/i18n';
import SettingsPage from '../SettingsPage';

export default function SettingsPageExample() {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <div className="min-h-screen bg-background">
          <SettingsPage />
        </div>
        <Toaster position="top-right" />
      </I18nextProvider>
    </ThemeProvider>
  );
}
