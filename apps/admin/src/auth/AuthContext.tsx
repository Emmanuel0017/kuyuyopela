import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface Admin {
  id: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

interface AuthContextValue {
  admin: Admin | null;
  isLoading: boolean;
  login: (admin: Admin, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('admin');
    const token = localStorage.getItem('accessToken');
    if (stored && token) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.removeItem('admin');
        localStorage.removeItem('accessToken');
      }
    }
    setIsLoading(false);
  }, []);

  function login(admin: Admin, accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('admin', JSON.stringify(admin));
    setAdmin(admin);
  }

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}