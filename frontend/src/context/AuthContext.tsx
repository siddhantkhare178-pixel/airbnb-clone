import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserDto, Role, MarketplaceMode } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { getAccessToken, setAccessToken } from '../services/api';

export const parseJwtRoles = (token: string | null): Role[] => {
  if (!token) return [];
  try {
    const parts = token.split('.');
    if (parts.length < 2) return [];
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    // Spring Boot JWT claim: .claim("roles", user.getRoles().toString())
    // which results in "[GUEST]" or "[GUEST, HOTEL_MANAGER]"
    if (typeof payload.roles === 'string') {
      const clean = payload.roles.replace(/[\[\]]/g, '').trim();
      if (!clean) return [];
      return clean.split(',').map((r: string) => r.trim() as Role).filter(Boolean);
    } else if (Array.isArray(payload.roles)) {
      return payload.roles;
    }
    return [];
  } catch {
    return [];
  }
};

interface AuthContextType {
  user: UserDto | null;
  roles: Role[];
  isHost: boolean;
  mode: MarketplaceMode;
  setMode: (mode: MarketplaceMode) => void;
  toggleMode: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [roles, setRoles] = useState<Role[]>(() => parseJwtRoles(getAccessToken()));
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setModeState] = useState<MarketplaceMode>(() => {
    const saved = localStorage.getItem('marketplace_mode');
    return (saved === 'host') ? 'host' : 'guest';
  });

  const isHost = roles.includes('HOTEL_MANAGER');

  // Keep effective mode synced: if user is not host, mode must always be 'guest'
  const effectiveMode: MarketplaceMode = isHost ? mode : 'guest';

  const setMode = (newMode: MarketplaceMode) => {
    if (newMode === 'host' && !isHost) return;
    setModeState(newMode);
    localStorage.setItem('marketplace_mode', newMode);
  };

  const toggleMode = () => {
    if (!isHost) return;
    const next = effectiveMode === 'host' ? 'guest' : 'host';
    setMode(next);
  };

  const fetchUser = useCallback(async () => {
    try {
      const profile = await userService.getProfile();
      const currentToken = getAccessToken();
      const parsedRoles = parseJwtRoles(currentToken);
      setRoles(parsedRoles);
      setUser({ ...profile, roles: parsedRoles });
    } catch {
      setUser(null);
      setRoles([]);
      setAccessToken(null);
    }
  }, []);

  // On mount, try to restore session
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setRoles(parseJwtRoles(token));
      fetchUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    const token = getAccessToken();
    const parsedRoles = parseJwtRoles(token);
    setRoles(parsedRoles);
    await fetchUser();
  };

  const signup = async (email: string, password: string, name: string) => {
    await authService.signup({ email, password, name });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setRoles([]);
    setModeState('guest');
    localStorage.removeItem('marketplace_mode');
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        isHost,
        mode: effectiveMode,
        setMode,
        toggleMode,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
