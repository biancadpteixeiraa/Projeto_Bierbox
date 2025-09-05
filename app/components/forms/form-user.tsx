'use client'
import Button from "../ui/button";
import Input from "../ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { getUserInfo, updateUserInfo } from "@/app/services/user";
import { toast } from "react-toastify";

export default function UserForm() {
  const { token, logout } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

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
      className="w-full flex flex-col gap-8"
    >
      <div>
        <label htmlFor="nome" className="pb-2 font-secondary text-gray-tertiary text-base">
          Nome Completo
        </label>
        <Input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome aqui"
        />
      </div>

      <div>
        <label htmlFor="email" className="pb-2 font-secondary text-gray-tertiary text-base">
          E-mail
        </label>
        <Input
          id="email"
          value={email}
          readOnly
          placeholder="Email aqui"
        />
      </div>

      <div>
        <label htmlFor="cpf" className="pb-2 font-secondary text-gray-tertiary text-base">
          CPF cadastrado
        </label>
        <Input
          id="cpf"
          value={cpf}
          readOnly
          placeholder="CPF aqui"
        />
      </div>

      <div>
        <label htmlFor="senha" className="pb-2 font-secondary text-gray-tertiary text-base">
          Insira sua senha atual:
        </label>
        <Input
          id="senha"
          type="password"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
          placeholder="Senha aqui"
        />
      </div>

      <div className="pb-36">
        <label htmlFor="novaSenha" className="pb-2 font-secondary text-gray-tertiary text-base">
          Insira sua nova senha:
        </label>
        <Input
          id="novaSenha"
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          placeholder="Confirme sua senha aqui"
        />
      </div>

      <Button 
        type="submit"
        variant="quaternary"
        className="w-full py-4 font-medium text-xl"
      >
        Atualizar meus Dados
      </Button>
    </form>
  );
}
