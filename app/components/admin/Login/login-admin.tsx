'use client'
import Button from "../../ui/button";
import Input from "../../ui/input";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import Link from "next/link";

export default function LoginAdmin() {
  const { login } = useAuth();
  const [emailAdmin, setEmailAdmin] = useState('');
  const [senhaAdmin, setSenhaAdmin] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; senha?: string } = {};
    
    if (!emailAdmin) {
      newErrors.email = "O email é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(emailAdmin)) {
      newErrors.email = "Informe um email válido.";
    }

    if (!senhaAdmin) {
      newErrors.senha = "A senha é obrigatória.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoadingLogin(true);
    try {
      await login(emailAdmin, senhaAdmin);
    } catch (error) {
      console.error("Erro ao logar", error);
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <div>
        <label
          htmlFor="email"
          className="pb-2 font-secondary text-gray-tertiary text-xs sm:text-sm"
        >
          Informe seu e-mail:
        </label>
        <Input
          id="email"
          type="email"
          placeholder="E-mail aqui"
          value={emailAdmin}
          onChange={(e) => setEmailAdmin(e.target.value)}
        />
        {errors.email && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="senha"
          className="pb-2 font-secondary text-gray-tertiary text-xs sm:text-sm"
        >
          Digite sua senha:
        </label>
        <Input
          id="senha"
          type="password"
          placeholder="Senha aqui"
          value={senhaAdmin}
          onChange={(e) => setSenhaAdmin(e.target.value)}
        />
        {errors.senha && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.senha}</p>
        )}
        <Link href="/recuperar-senha">
          <button
            type="button"
            className="font-secondary underline text-gray-quaternary text-xs sm:text-sm pb-4 pt-6"
          >
            Esqueci minha senha!
          </button>
        </Link>
      </div>

        <Link href="/admin/01/dashboard">
            <button
                type="button"
                className="w-full bg-yellow-secondary hover:bg-yellow-700 text-white font-medium py-4 px-6 rounded-lg transition duration-300"
            >
                Entrar
            </button>
        </Link>

      {/* <Button
        type="submit"
        disabled={loadingLogin}
        className="w-full py-4 font-medium text-lg flex items-center justify-center"
        variant="quaternary"
      >
        {loadingLogin ? (
          <svg
            className="animate-spin h-5 w-5 mr-3 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        ) : (
          "Entrar"
        )}
      </Button> */}
    </form>
  );
}
