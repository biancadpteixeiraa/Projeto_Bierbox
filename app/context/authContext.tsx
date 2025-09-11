'use client'
import { useState, createContext, useEffect, useContext } from 'react';
import api from '../services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface User {
  id: string;
  nome_completo: string;
  email: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
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
  const [loading, setLoading] = useState(true); // true apenas no carregamento inicial
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const response = await api.post('/users/login', { email, senha });

      if (response.data.success) {
        const { token, user } = response.data;

        setToken(token);
        setUser(user);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        const redirect = localStorage.getItem("redirectAfterAuth");
        if (redirect) {
          localStorage.removeItem("redirectAfterAuth");
          router.push(redirect);
        } else {
          router.push(`/dashboard/${user.id}`);
        }
      } else {
        toast.error("Falha ao realizar login, tente novamente!");
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Falha no login. Verifique suas credenciais!');
    } finally {
      setLoading(false);
    }
  };

const register = async (nome_completo: string, email: string, cpf: string, senha: string) => {
  setLoading(true);
  try {
    const response = await api.post('/users/register', {
      nome_completo,
      email,
      cpf,
      senha,
    });

    if (response.data.success) {
      toast.success("Cadastro realizado com sucesso!");
      await login(email, senha);
    } else {
      toast.error("Falha no cadastro. Tente novamente.");
      console.error(response.data.message);
    }
  } catch (error) {
    console.error('Erro no cadastro:', error);
    toast.error("Falha no cadastro. Tente novamente.");
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoading(false); // garante que não fique travado
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        login,
        loading,
        register,
        logout,
        token,
        user
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
