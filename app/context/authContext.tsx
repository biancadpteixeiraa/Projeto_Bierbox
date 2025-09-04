'use client'
import { useState, createContext, useEffect, useContext } from 'react';
import api from '../services/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  nome_completo: string;
  email: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome_completo: string, email: string, cpf: string, senha: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await api.post('/users/login', { email, senha });

      if (response.data.success) {
        const { token, user } = response.data;

        setToken(token);
        setUser(user);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        router.push(`/dashboard/${user.id}`);
        alert(response.data.message || 'Login realizado com sucesso!');
      } else {
        alert(response.data.message || 'Falha no login.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Falha no login. Verifique suas credenciais.');
    }
  };

  const register = async (nome_completo: string, email: string, cpf: string, senha: string) => {
    try {
      const response = await api.post('/users/register', {
        nome_completo,
        email,
        cpf,
        senha,
      });
      alert(response.data.message || 'Cadastro realizado com sucesso!');
      router.push('/login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert('Falha no cadastro. Tente novamente.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
    alert('Logout realizado.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, register, logout, token, user }}>
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
