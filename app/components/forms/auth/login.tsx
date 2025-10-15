'use client'
import Button from "../../ui/button";
import Input from "../../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import Link from "next/link";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; senha?: string } = {};
    
    if (!email) {
      newErrors.email = "O email é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Informe um email válido.";
    }

    if (!senha) {
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
      await login(email, senha);
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          <div className="relative">
            <Input
              id="senha"
              type={showPassword ? "text" : "password"}
              placeholder="Senha aqui"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-tertiary/75 hover:text-gray-tertiary/55"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
        </div>
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

      <Button
        type="submit"
        disabled={loadingLogin}
        className="w-full py-4 font-medium text-lg flex items-center justify-center"
        variant="quaternary"
      >
        {loadingLogin ? (
          <span className="animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-6"></span>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}
