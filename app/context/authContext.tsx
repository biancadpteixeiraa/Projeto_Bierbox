'use client'
import { useState, createContext, useEffect, useContext } from 'react';
import api from '../services/api';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (email: string, senha: string) => Promise<void>;
    register: (nome_completo: string, email: string, cpf: string, senha: string) => Promise<void>;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            alert('Token recuperado do localStorage');
        }
    }, []);

      const login = async (email: string, senha: string) => {
    try {
      const response = await api.post('/users/login', { email, senha });
      const token = response.data.token;

      setToken(token);
      localStorage.setItem('token', token);
      router.push('/dashboard');
      alert('Login realizado com sucesso!');
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
            alert('Cadastro realizado com sucesso!');
            console.log(response.data.message);
            router.push('/login');
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert('Falha no cadastro. Tente novamente.');
        }
    };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    router.push('/');
    alert('Logout realizado.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, register, logout, token }}>
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


