import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import Navbar from '../Navbar';

export default function NavbarExample() {
  const mockUser = {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'volunteer' as const
  };

  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <div className="min-h-screen bg-background">
          <Navbar user={mockUser} onLogout={() => console.log('Logout clicked')} />
          <div className="p-6">
            <p className="text-muted-foreground">Page content goes here...</p>
          </div>
        </div>
      </I18nextProvider>
    </ThemeProvider>
  );
}
