import { useState, useEffect } from 'react';

export type UserRole = 'volunteer' | 'ngo_staff' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export function useAuth() {
  // Avoid accessing localStorage during SSR. Rehydrate on the client.
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      // ignore
    }
  }, []);

  const login = (userData: AuthUser) => {
    try {
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (e) {
      // ignore
    }
    setUser(userData);
  };

  const logout = () => {
    try {
      localStorage.removeItem('auth_user');
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  return { user, login, logout };
}
