import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import i18n from '@/lib/i18n';
import ProfileWizard from '../ProfileWizard';

export default function ProfileWizardExample() {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <ProfileWizard />
        <Toaster position="top-right" />
      </I18nextProvider>
    </ThemeProvider>
  );
}
