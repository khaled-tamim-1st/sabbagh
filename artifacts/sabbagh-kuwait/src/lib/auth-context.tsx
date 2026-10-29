import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiClient } from './api-client';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'painter';
  painterProfile?: {
    id: number;
    name: string;
    avatarUrl?: string | null;
    avatarPublicId?: string | null;
    initials?: string;
    region: string;
    isAvailableToday: boolean;
    rating: string;
    reviews: number;
    years: number;
    isVerified: boolean;
    status: string;
    completedProjects?: number;
    responseTime?: string;
    portfolioProjects?: any[];
  } | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  quickDemoLogin: (role: 'admin' | 'painter') => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updatePainterAvailability: (isAvailable: boolean) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo Fallback Users
export const DEMO_ADMIN: AuthUser = {
  id: 1,
  email: 'admin@sabbagh-kuwait.com',
  name: 'أحمد الصالح (مدير المنصة)',
  phone: '+96590001122',
  role: 'admin',
};

export const DEMO_PAINTER: AuthUser = {
  id: 2,
  email: 'painter@sabbagh-kuwait.com',
  name: 'معلم أبو فهد الكويتي',
  phone: '+96598882233',
  role: 'painter',
  painterProfile: {
    id: 1,
    name: 'أبو فهد للأصباغ الحديثة والتشطيب',
    region: 'محافظة العاصمة وحولي',
    isAvailableToday: true,
    rating: '5.0',
    reviews: 2,
    years: 12,
    isVerified: true,
    status: 'approved',
    completedProjects: 85,
    responseTime: 'خلال 15 دقيقة',
  },
};

const TOKEN_KEY = 'token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Sync token to state & localStorage
  const saveAuth = (newToken: string | null, newUser: AuthUser | null) => {
    setToken(newToken);
    setUser(newUser);
    try {
      if (newToken && newUser) {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } catch (err) {
      console.error('Error saving auth to localStorage', err);
    }
  };

  const logout = useCallback(() => {
    saveAuth(null, null);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem(TOKEN_KEY);
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiClient.get('/auth/me');
      if (data?.user) {
        const fullUser: AuthUser = {
          ...data.user,
          painterProfile: data.painter !== undefined ? data.painter : data.user.painterProfile,
        };
        setUser(fullUser);
        localStorage.setItem(USER_KEY, JSON.stringify(fullUser));
      }
    } catch (err: any) {
      console.warn('Could not refresh user from API:', err);
      // If 401, remove token
      if (err?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Attempt API login
      const response = await apiClient.post('/auth/login', {
        email: normalizedEmail,
        password,
      });

      if (response && response.token && response.user) {
        const fullUser: AuthUser = {
          ...response.user,
          painterProfile: response.painter !== undefined ? response.painter : response.user.painterProfile,
        };
        saveAuth(response.token, fullUser);
        setIsLoading(false);
        return fullUser;
      }
      throw new Error('فشل تسجيل الدخول من الخادم');
    } catch (apiError: any) {
      console.warn('API login failed or server unreachable, evaluating demo credentials:', apiError);

      // 2. Demo credentials fallback
      if (normalizedEmail === 'admin@sabbagh-kuwait.com' && password === 'Admin@123456') {
        const demoToken = 'demo-jwt-admin-token-sabbagh-kuwait-2026';
        saveAuth(demoToken, DEMO_ADMIN);
        setIsLoading(false);
        return DEMO_ADMIN;
      }

      if (normalizedEmail === 'painter@sabbagh-kuwait.com' && password === 'Painter@123456') {
        const demoToken = 'demo-jwt-painter-token-sabbagh-kuwait-2026';
        saveAuth(demoToken, DEMO_PAINTER);
        setIsLoading(false);
        return DEMO_PAINTER;
      }

      setIsLoading(false);
      throw new Error(apiError?.message || 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور.');
    }
  };

  const quickDemoLogin = async (role: 'admin' | 'painter'): Promise<AuthUser> => {
    if (role === 'admin') {
      return login('admin@sabbagh-kuwait.com', 'Admin@123456');
    } else {
      return login('painter@sabbagh-kuwait.com', 'Painter@123456');
    }
  };

  const updatePainterAvailability = async (isAvailable: boolean): Promise<boolean> => {
    if (!user || user.role !== 'painter') return false;

    // Optimistic update
    const updatedUser: AuthUser = {
      ...user,
      painterProfile: user.painterProfile
        ? { ...user.painterProfile, isAvailableToday: isAvailable }
        : null,
    };
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

    try {
      await apiClient.patch('/painter/availability', { isAvailableToday: isAvailable });
      return true;
    } catch (err) {
      console.warn('API update availability failed, kept optimistic state:', err);
      return true; // Keep local demo state functional
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        quickDemoLogin,
        logout,
        refreshUser,
        updatePainterAvailability,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
