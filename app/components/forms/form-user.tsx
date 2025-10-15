'use client'
import Button from "../ui/button";
import Input from "../ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { getUserInfo, updateUserInfo } from "@/app/services/user";
import { toast } from "react-toastify";
import { IMaskInput } from 'react-imask';
import { Icon } from "@iconify/react";

export default function UserForm() {
  const { token, logout } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const data = await getUserInfo(token);
        if (data.success) {
          setNome(data.user.nome_completo);
          setEmail(data.user.email);
          setCpf(data.user.cpf);
        } else {
          toast.error("Não foi possível carregar perfil.");
          if (data.message?.toLowerCase().includes("token")) {
            logout();
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro inesperado ao carregar perfil.");
      } finally {
        toast.dismiss();
      }
    };

    fetchProfile();
  }, [token, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (senhaAtual.trim() !== "" && novaSenha.trim() === "") {
      toast.warning("Preencha a nova senha para alterar sua senha.");
      return;
    }

    if (senhaAtual.trim() === "" && novaSenha.trim() !== "") {
      toast.warning("Informe sua senha atual para alterar a senha.");
      return;
    }

    if (novaSenha.trim() !== "") {
      const senhaValida = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(novaSenha);
      if (!senhaValida) {
        toast.warning("A nova senha deve ter ao menos 8 caracteres, incluindo letras e números.");
        return;
      }
    }

    const payload: any = {};
    if (nome.trim() !== "") payload.nome_completo = nome;
    if (novaSenha.trim() !== "") {
      payload.senha_atual = senhaAtual;
      payload.nova_senha = novaSenha;
    }

    if (Object.keys(payload).length === 0) {
      toast.info("Nenhuma alteração para salvar.");
      return;
    }

    try {
      const response = await updateUserInfo(token, payload);
      if (response.success) {
        toast.success("Perfil atualizado com sucesso!");
        setNome(response.user.nome_completo);
        setSenhaAtual("");
        setNovaSenha("");
      } else {
        toast.error("Não foi possível atualizar perfil.");
        console.error("Erro: ", response.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao atualizar perfil.");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col lg:justify-between lg:h-full pb-20"
    >
      <div className="flex flex-col gap-5 pb-10 xl:pb-20">
        <div>
          <div className="pb-1">
            <label htmlFor="nome" className="font-secondary text-gray-tertiary text-xs">
              Nome Completo
            </label>
          </div>
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome aqui"
            className="px-5"
          />
        </div>

        <div>
          <div className="pb-1">
            <label htmlFor="email" className="font-secondary text-gray-tertiary text-xs">
              E-mail
            </label>
          </div>
          <Input
            id="email"
            value={email}
            readOnly
            placeholder="Email aqui"
            className="px-5 bg-gray-50/50 cursor-not-allowed text-gray-tertiary/45"
          />
        </div>

        <div>
          <div className="pb-1">
            <label htmlFor="cpf" className="font-secondary text-gray-tertiary text-xs">
              CPF cadastrado
            </label>
          </div>
          <IMaskInput
            id="cpf"
            mask="000.000.000-00"
            type="text"
            value={cpf}
            className="text-xs sm:text-sm w-full py-3 
            rounded-xl border border-gray-tertiary/35
            px-5 bg-gray-50/50 cursor-not-allowed text-gray-tertiary/45"
            placeholder="CPF aqui"
          />
        </div>

        <div>
          <div className="pb-1">
            <label htmlFor="senha" className="font-secondary text-gray-tertiary text-xs">
              Insira sua senha atual:
            </label>
          </div>
          <div className="relative">
            <Input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha atual aqui"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
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
        </div>

        <div className="">
          <div className="pb-1">
            <label htmlFor="novaSenha" className="font-secondary text-gray-tertiary text-xs">
              Insira sua nova senha:
            </label>
          </div>
          <Input
            id="novaSenha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="Sua senha nova aqui"
            className="px-5"
          />
          <p className="font-secondary text-gray-quaternary text-xs pt-2">
          Crie uma senha com mais de 8 dígitos contendo números e letras.
        </p>
        </div>
      </div>

      <Button 
        type="submit"
        variant="quaternary"
        className="w-full py-3 font-medium text-lg"
      >
        Atualizar meus Dados
      </Button>
      
    </form>
  );
}
