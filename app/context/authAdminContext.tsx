'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '../services/api';

interface AdminUser {
  id: string;
  nome_completo: string;
  email: string;
  role: 'admin';
}

interface AdminAuthContextProps {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  loading: boolean;
  loginAdmin: (email: string, senha: string) => Promise<void>;
  logoutAdmin: () => void;
  token: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextProps | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');
    if (storedToken) setToken(storedToken);
    if (storedUser) setAdmin(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const loginAdmin = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const response = await api.post('/api/admin/login', { email, senha });

      if (response.data.success) {
        const { token, user } = response.data;
        setToken(token);
        setAdmin(user);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        router.push(`/admin/${user.id}/dashboard`);
        console.log('Login de admin bem-sucedido:', user);
      } else {
        toast.error(response.data.message || 'Falha no login de admin.');
      }
    } catch (error: any) {
      console.error('Erro no login de admin:', error);
      toast.error('Erro ao realizar login de administrador!');
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!token,
        admin,
        loading,
        loginAdmin,
        logoutAdmin,
        token,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
}
