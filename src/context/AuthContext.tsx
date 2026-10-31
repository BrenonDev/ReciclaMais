import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services/container';

interface AuthValue {
  isAuthenticated: boolean;
  signIn(email: string, password: string): Promise<boolean>;
  signOut(): void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(() => authService.isAuthenticated());

  const signIn = useCallback(async (email: string, password: string) => {
    const valid = await authService.signIn(email, password);
    setAuthenticated(valid);
    return valid;
  }, []);

  const signOut = useCallback(() => {
    authService.signOut();
    setAuthenticated(false);
  }, []);

  const value = useMemo(() => ({ isAuthenticated, signIn, signOut }), [isAuthenticated, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth precisa estar dentro de AuthProvider.');
  return value;
}
