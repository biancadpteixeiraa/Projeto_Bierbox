'use client'
import Button from "../ui/button";
import Input from "../ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { getUserInfo, updateUserInfo } from "@/app/services/user";

export default function UserForm() {
  const { token, user, logout } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  // carregar dados do perfil
  useEffect(() => {
    if (!token) return;
    getUserInfo(token).then((data) => {
      if (data.success) {
        setNome(data.user.nome_completo);
        setEmail(data.user.email);
        setCpf(data.user.cpf);
      } else {
        alert(data.message || "Erro ao carregar perfil");
        if (data.message?.toLowerCase().includes("token")) {
          logout(); // se o token for inválido, desloga
        }
      }
    });
  }, [token, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload: any = {};
    if (nome !== "") payload.nome_completo = nome;
    if (novaSenha !== "") {
      payload.senha_atual = senhaAtual;
      payload.nova_senha = novaSenha;
    }

    const response = await updateUserInfo(token, payload);
    if (response.success) {
      alert(response.message || "Perfil atualizado!");
      setNome(response.user.nome_completo);
      setSenhaAtual("");
      setNovaSenha("");
    } else {
      alert(response.message || "Erro ao atualizar perfil");
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
