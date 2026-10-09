import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'finance' | 'engineer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  company: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  canAccessRoute: (requiredRole?: UserRole[]) => boolean;
}

const STORAGE_KEY_USER = 'kirchat_auth_user';
const STORAGE_KEY_USERS_DB = 'kirchat_registered_users';

const DEFAULT_USERS: (User & { password?: string })[] = [
  {
    id: 'user-001',
    name: 'Kidus Mesay',
    email: 'kidusmesayt@gmail.com',
    role: 'admin',
    company: 'Kirchat Ethiopia PLC',
    avatarUrl: '/src/assets/images/avatar_kidus_mesay_1791480077267.jpg',
    createdAt: '2024-01-15',
    password: 'password123',
  },
  {
    id: 'user-002',
    name: 'Abebe Kebede',
    email: 'abebe@kirchat.et',
    role: 'finance',
    company: 'Kirchat Ethiopia PLC',
    createdAt: '2024-06-20',
    password: 'password123',
  },
  {
    id: 'user-003',
    name: 'Hana Tesfaye',
    email: 'hana@kirchat.et',
    role: 'engineer',
    company: 'Kirchat Ethiopia PLC',
    createdAt: '2025-02-10',
    password: 'password123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize DB and current session
  useEffect(() => {
    try {
      const storedDb = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (!storedDb) {
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(DEFAULT_USERS));
      }

      const activeSession = localStorage.getItem(STORAGE_KEY_USER);
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        // If prior session was placeholder Sarah Chen, migrate seamlessly to Kidus Mesay
        if (parsed.name === 'Sarah Chen' || parsed.id === 'user-001') {
          const kidusUser = DEFAULT_USERS[0];
          setUser(kidusUser);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(kidusUser));
        } else {
          setUser(parsed);
        }
      } else {
        // Default to logged-in Kidus Mesay (Admin)
        const initialUser = DEFAULT_USERS[0];
        setUser(initialUser);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(initialUser));
      }
    } catch {
      setUser(DEFAULT_USERS[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // Smooth natural latency

    try {
      const dbRaw = localStorage.getItem(STORAGE_KEY_USERS_DB);
      const db: (User & { password?: string })[] = dbRaw ? JSON.parse(dbRaw) : DEFAULT_USERS;
      
      const found = db.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) {
        setIsLoading(false);
        return { success: false, error: 'No account found with this email address.' };
      }

      if (password && found.password && found.password !== password) {
        setIsLoading(false);
        return { success: false, error: 'Incorrect password. Try "password123" for demo accounts.' };
      }

      const userSession: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        company: found.company,
        avatarUrl: found.avatarUrl,
        createdAt: found.createdAt,
      };

      setUser(userSession);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSession));
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Authentication service encountered an unexpected error.' };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 450));

    try {
      const dbRaw = localStorage.getItem(STORAGE_KEY_USERS_DB);
      const db: (User & { password?: string })[] = dbRaw ? JSON.parse(dbRaw) : DEFAULT_USERS;

      const existing = db.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
      if (existing) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email already exists. Please log in.' };
      }

      const newUser: User & { password?: string } = {
        id: `user-${Date.now()}`,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        role: data.role || 'viewer',
        company: data.company.trim() || 'Kirchat Ethiopia PLC',
        createdAt: new Date().toISOString().split('T')[0],
        password: data.password || 'password123',
      };

      const updatedDb = [...db, newUser];
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(updatedDb));

      const userSession: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        company: newUser.company,
        createdAt: newUser.createdAt,
      };

      setUser(userSession);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSession));
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Failed to create user account. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const canAccessRoute = (requiredRoles?: UserRole[]) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (user.role === 'admin') return true; // Admins have root access
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        canAccessRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
