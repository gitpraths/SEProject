import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';
import type { UserRole } from '@/hooks/useAuth';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<UserRole>('volunteer');
  const [showOTP, setShowOTP] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      toast.error('Please fill in all fields');
      return;
    }

    //todo: remove mock functionality
    const mockUser = {
      id: '1',
      name: email.split('@')[0],
      email,
      role
    };
    
    toast.success('Login successful!');
    onLogin(mockUser);
    setLocation('/dashboard');
  };

  const handleSendOTP = () => {
    if (!phone) {
      toast.error('Please enter phone number');
      return;
    }
    
    //todo: remove mock functionality
    setShowOTP(true);
    toast.success('OTP sent: 123456', { duration: 4000 });
  };

  const handleOTPLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp !== '123456') {
      toast.error('Invalid OTP');
      return;
    }

    //todo: remove mock functionality
    const mockUser = {
      id: '2',
      name: `User-${phone}`,
      email: `${phone}@phone.user`,
      role
    };
    
    toast.success('Login successful!');
    onLogin(mockUser);
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img 
            src="/attached_assets/Gemini_Generated_Image_q1vobuq1vobuq1vo (1).png" 
            alt="NEST Logo" 
            className="h-16 w-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('appName')}</h1>
          <p className="text-muted-foreground">Humanitarian Aid & Management System</p>
        </div>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>{t('auth.login')}</CardTitle>
            <CardDescription>Sign in to continue to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        data-testid="input-password"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">{t('auth.role')}</Label>
                    <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                      <SelectTrigger data-testid="select-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volunteer">{t('auth.volunteer')}</SelectItem>
                        <SelectItem value="ngo_staff">{t('auth.ngoStaff')}</SelectItem>
                        <SelectItem value="admin">{t('auth.admin')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" data-testid="button-login">
                    {t('auth.loginButton')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handleOTPLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('auth.phone')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        data-testid="input-phone"
                      />
                    </div>
                  </div>

                  {!showOTP && (
                    <Button type="button" onClick={handleSendOTP} className="w-full" variant="outline" data-testid="button-send-otp">
                      {t('auth.sendOTP')}
                    </Button>
                  )}

                  {showOTP && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp">OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          data-testid="input-otp"
                        />
                        <p className="text-xs text-muted-foreground">Mock OTP: 123456</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role-otp">{t('auth.role')}</Label>
                        <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="volunteer">{t('auth.volunteer')}</SelectItem>
                            <SelectItem value="ngo_staff">{t('auth.ngoStaff')}</SelectItem>
                            <SelectItem value="admin">{t('auth.admin')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="submit" className="w-full" data-testid="button-verify-otp">
                        {t('auth.verifyOTP')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </>
                  )}
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <a href="/register" className="text-sm text-primary hover:underline">
                {t('auth.noAccount')} {t('auth.register')}
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
