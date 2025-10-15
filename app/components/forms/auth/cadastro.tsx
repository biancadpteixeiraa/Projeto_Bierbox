'use client'
import { Icon } from "@iconify/react";
import Button from "../../ui/button";
import Input from "../../ui/input";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { IMaskInput } from 'react-imask';
import { toast } from "react-toastify";

export default function CadastroForm() {
  const { register, loading } = useAuth();

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState(''); 
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [errors, setErrors] = useState<{ 
    nomeCompleto?: string; 
    email?: string; 
    cpf?: string; 
    dataNascimento?: string;
    senha?: string; 
    confirmSenha?: string; 
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!nomeCompleto) newErrors.nomeCompleto = "Nome é obrigatório.";
    if (!email) newErrors.email = "Email é obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Informe um email válido.";
    if (!cpf) newErrors.cpf = "CPF é obrigatório.";
    if (!dataNascimento) newErrors.dataNascimento = "Data de Nascimento é obrigatória.";
    if (!senha) newErrors.senha = "Senha é obrigatória.";
    else {
      const senhaValida = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(senha);
      if (!senhaValida) {
        newErrors.senha = "A senha deve ter pelo menos 8 caracteres e conter letras e números.";
      }
    }
    if (senha !== confirmSenha) newErrors.confirmSenha = "Senhas não coincidem.";

    setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
      const primeiraMensagem = Object.values(newErrors)[0];
      toast.error(primeiraMensagem);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const formattedDate = dataNascimento ? new Date(dataNascimento).toISOString().split("T")[0] : "";

    await register(nomeCompleto, email, cpf, senha, formattedDate);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <div>
        <label htmlFor="nomeCompleto" className="pb-2 font-secondary text-gray-tertiary text-xs sm:text-sm">
          Informe seu nome completo:
        </label>
        <Input
          type="text"
          id="nomeCompleto"
          placeholder="Nome aqui"
          value={nomeCompleto}
          onChange={e => setNomeCompleto(e.target.value)}
        />
        {errors.nomeCompleto && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.nomeCompleto}</p>}
      </div>
      <div>
        <label htmlFor="email" className="pb-2 font-secondary text-gray-tertiary text-xs sm:text-sm">
          Qual é seu e-mail?
        </label>
        <Input
          type="email"
          id="email"
          placeholder="E-mail aqui"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="cpf" className="pb-2 font-secondary text-gray-tertiary text-xs sm:text-sm">
          Informe seu CPF:
        </label>
        <IMaskInput
          id="cpf"
          mask="000.000.000-00"
          type="text"
          value={cpf}
          onAccept={(value: string) => setCpf(value)}
          className="text-xs sm:text-sm w-full p-3 bg-transparent 
          text-gray-tertiary/75 placeholder:text-gray-tertiary/75 rounded-xl border border-gray-tertiary/35"
          placeholder="CPF aqui"
        />
        {errors.cpf && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.cpf}</p>}
      </div>
      <div>
        <label htmlFor="dataNascimento" className="pb-2 font-secondary text-gray-tertiary text-xs sm:text-sm">
          Informe sua Data de Nascimento:
        </label>
        <Input
          className="uppercase"
          type="date"
          id="dataNascimento"
          value={dataNascimento}
          onChange={e => setDataNascimento(e.target.value)}
        />
        {errors.dataNascimento && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.dataNascimento}</p>}
      </div>
      <div className="flex flex-col">
        <div className="flex pb-2">
          <label htmlFor="senha" className="font-secondary text-gray-tertiary text-xs sm:text-sm w-full">
            Crie uma senha:
          </label>
        </div>
          <div className="relative">
          <Input
            id="senha"
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha aqui"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute inset-y-0 right-3 flex items-center"
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            <Icon icon={mostrarSenha ? "mdi:eye-off" : "mdi:eye"} className="text-gray-tertiary/75 hover:text-gray-tertiary/55 text-base" />
          </button>
        </div>
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
        disabled={loading}
        className="mt-4 w-full py-4 font-medium text-lg flex items-center justify-center"
      >
        {loading ? (
          <span className="animate-spin rounded-full border-4 border-beige-primary border-t-transparent w-6 h-6"></span>
        ) : (
          "Realizar cadastro"
        )}
      </Button>
    </form>
  );
}
