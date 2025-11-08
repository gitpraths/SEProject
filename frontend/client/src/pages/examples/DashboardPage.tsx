import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import DashboardPage from '../DashboardPage';

export default function DashboardPageExample() {
  return (
    <I18nextProvider i18n={i18n}>
      <div className="min-h-screen bg-background">
        <DashboardPage userName="Sarah Johnson" userRole="volunteer" />
      </div>
    </I18nextProvider>
  );
}
