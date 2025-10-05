'use client'
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import Button from "../../ui/button";
import Input from "../../ui/input";
import { Icon } from "@iconify/react";

export default function NovaSenha() {
  const { resetPassword} = useAuth();
  const { token } = useParams<{ token: string }>();
  const [loadingRecover, setLoadingRecover] = useState(false);
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [errors, setErrors] = useState<{ senha?: string; confirmSenha?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!senha) newErrors.senha = "Senha é obrigatória.";
    else if (senha.length < 8) newErrors.senha = "Senha deve ter pelo menos 8 caracteres.";
    if (senha !== confirmSenha) newErrors.confirmSenha = "Senhas não coincidem.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoadingRecover(true);
    await resetPassword(token, senha);
    setLoadingRecover(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <div className="flex flex-col">
          <div className="flex justify-between pb-2">
            <label htmlFor="senha" className="font-secondary text-gray-tertiary text-xs sm:text-sm w-full">
              Crie uma nova senha:
            </label>
            <button
              type="button"
              className="flex items-center"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              <Icon icon={mostrarSenha ? "mdi:eye-off" : "mdi:eye"} className="text-gray-tertiary text-base" />
              <p className="pl-2 text-gray-tertiary text-xs sm:text-sm">{mostrarSenha ? "Hide" : "Show"}</p>
            </button>
          </div>
          <Input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha aqui"
            id="senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
          <p className="font-secondary text-gray-quaternary text-xs pt-2">
            Crie uma senha com mais de 8 dígitos contendo números e letras.
          </p>
          {errors.senha && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.senha}</p>}
        </div>
        <div>
          <label htmlFor="confirmSenha" className="pb-2 font-secondary text-gray-tertiary text-xs sm:text-sm">
            Confirme sua senha:
          </label>
          <Input
            placeholder="Confirme sua senha aqui"
            id="confirmSenha"
            type="password"
            value={confirmSenha}
            onChange={e => setConfirmSenha(e.target.value)}
          />
          {errors.confirmSenha && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.confirmSenha}</p>}
        </div>
        <Button
          variant="quaternary"
          type="submit"
          disabled={loadingRecover}
          className="mt-4 w-full py-4 font-medium text-lg flex items-center justify-center"
        >
          {loadingRecover ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            "Redefinir Senha"
          )}
        </Button>
      </form>
  );
}
