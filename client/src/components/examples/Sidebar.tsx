import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import Sidebar from '../Sidebar';

export default function SidebarExample() {
  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex h-screen bg-background">
        <Sidebar role="volunteer" />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Main Content Area</h2>
          <p className="text-muted-foreground">The sidebar navigation is on the left</p>
        </main>
      </div>
    </I18nextProvider>
  );
}
