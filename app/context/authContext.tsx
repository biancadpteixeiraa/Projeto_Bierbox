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
  register: (
    nome_completo: string,
    email: string,
    cpf: string,
    senha: string,
    data_nascimento: string
  ) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, nova_senha: string) => Promise<void>;
  token: string | null;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function getErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message || fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
          router.push(`/`);
        }
      } else {
        toast.error(response.data.message || "Falha ao realizar login, tente novamente!");
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(getErrorMessage(error, "Falha no login. Verifique suas credenciais!"));
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome_completo: string, email: string, cpf: string, senha: string, data_nascimento: string) => {
    setLoading(true);
    try {
      const response = await api.post('/users/register', {
        nome_completo,
        email,
        cpf,
        senha,
        data_nascimento
      });

      if (response.data.success) {
        toast.success(response.data.message || "Cadastro realizado com sucesso!");
        await login(email, senha);
      } else {
        toast.error(response.data.message || "Falha no cadastro. Tente novamente.");
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error(getErrorMessage(error, "Falha no cadastro. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoading(false);
    router.push('/');
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await api.post("/users/forgot-password", { email });
      if (response.data.success) {
        toast.success("E-mail para redefinir senha enviado! Não se esqueça de checar sua caixa de spam!");
      } else {
        toast.error(response.data.message || "Erro ao solicitar recuperação de senha.");
      }
    } catch (error: any) {
      console.error("Erro no forgotPassword:", error);
      toast.error(getErrorMessage(error, "Erro ao solicitar recuperação de senha."));
    }
  };

  const resetPassword = async (token: string, nova_senha: string) => {
    try {
      const response = await api.post("/users/reset-password", { token, nova_senha });
      if (response.data.success) {
        toast.success(response.data.message || "Senha redefinida com sucesso!");
        router.push("/login");
      } else {
        toast.error(response.data.message || "Erro ao redefinir senha.");
      }
    } catch (error: any) {
      console.error("Erro ao redefinir Senha:", error);
      toast.error(getErrorMessage(error, "Erro ao redefinir senha."));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        login,
        loading,
        register,
        logout,
        forgotPassword,
        resetPassword,
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
