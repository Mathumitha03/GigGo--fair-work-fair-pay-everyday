import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, UserProfile, UserRole } from '../types';
import { ApiService, setAuthToken } from '../services/api';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  login: (identifier: string, password: string) => Promise<AuthResponse>;
  registerCustomer: (data: Parameters<typeof ApiService.registerCustomer>[0]) => Promise<AuthResponse>;
  registerWorker: (data: Parameters<typeof ApiService.registerWorker>[0]) => Promise<AuthResponse>;
  logout: () => void;
  refreshUserProfile: () => Promise<UserProfile | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('role-selection');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthSuccess = async (authRes: AuthResponse): Promise<AuthResponse> => {
    const t = authRes.accessToken || (authRes as any).token;
    setToken(t);
    setAuthToken(t);
    if (authRes.user) {
      setUser(authRes.user);
    }
    try {
      const profile = await ApiService.getCurrentUser();
      setUser(profile);
    } catch (e) {
      if (authRes.user) setUser(authRes.user);
    }
    return authRes;
  };

  const login = async (identifier: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const authRes = await ApiService.login(identifier, password);
      return await handleAuthSuccess(authRes);
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check credentials.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCustomer = async (data: Parameters<typeof ApiService.registerCustomer>[0]): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const authRes = await ApiService.registerCustomer(data);
      return await handleAuthSuccess(authRes);
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWorker = async (data: Parameters<typeof ApiService.registerWorker>[0]): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const authRes = await ApiService.registerWorker(data);
      return await handleAuthSuccess(authRes);
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    setError(null);
    setRole('role-selection');
  };

  const refreshUserProfile = async (): Promise<UserProfile | null> => {
    if (!token) return null;
    try {
      const profile = await ApiService.getCurrentUser();
      setUser(profile);
      return profile;
    } catch (err) {
      return null;
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        error,
        setError,
        login,
        registerCustomer,
        registerWorker,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
