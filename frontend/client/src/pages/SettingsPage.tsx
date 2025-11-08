import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Globe, Trash2, Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all local data? This cannot be undone.')) {
      localStorage.clear();
      toast.success('Local data cleared');
    }
  };

  const handleExportData = () => {
    //todo: remove mock functionality
    const data = { profiles: [], settings: {} };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
  a.download = 'nest-data-export.json';
    a.click();
    toast.success('Data exported');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('nav.settings')}</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-toggle-theme"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Current Language</Label>
                <p className="text-sm text-muted-foreground">
                  {i18n.language === 'en' ? 'English' : 'हिंदी'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
                data-testid="button-change-language"
              >
                <Globe className="mr-2 h-4 w-4" />
                Switch
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or clear your local data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportData}
              data-testid="button-export-data"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleResetData}
              data-testid="button-reset-data"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reset All Data
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Offline Mode</CardTitle>
            <CardDescription>Manage offline capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-save Drafts</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save form data locally
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-autosave" />
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 dark:text-amber-200">
                Drafts are stored locally and will be synced when you're back online
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
