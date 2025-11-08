import { Switch, Route, Redirect } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfileWizard from './pages/ProfileWizard';
import ProfilesListPage from './pages/ProfilesListPage';
import ResourcesPage from './pages/ResourcesPage';
import MatchesPage from './pages/MatchesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import LoadingScreen from './components/LoadingScreen';
import { useState, useEffect } from 'react';

function AuthenticatedLayout({ children, user, onLogout }: any) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar role={user.role} />
        <main className="flex-1 overflow-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  const { user, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/login">
          <LoginPage onLogin={login} />
        </Route>
        <Route>
          <Redirect to="/login" />
        </Route>
      </Switch>
    );
  }

  return (
    <AuthenticatedLayout user={user} onLogout={logout}>
      <Switch>
        <Route path="/dashboard">
          <DashboardPage userName={user.name} userRole={user.role} />
        </Route>
        <Route path="/profiles/create">
          <ProfileWizard />
        </Route>
        <Route path="/profiles/all">
          <ProfilesListPage />
        </Route>
        <Route path="/resources/shelters">
          <ResourcesPage type="shelters" />
        </Route>
        <Route path="/resources/jobs">
          <ResourcesPage type="jobs" />
        </Route>
        <Route path="/matches">
          <MatchesPage />
        </Route>
        <Route path="/reports">
          <ReportsPage />
        </Route>
        <Route path="/settings">
          <SettingsPage />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </AuthenticatedLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <Router />
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'rounded-xl',
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))'
              }
            }}
          />
        </I18nextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
