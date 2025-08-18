'use client'
import Button from "../ui/button";
import Input from "../ui/input";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";

export default function LoginForm(){
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, senha);
        // O redirecionamento ocorre no contexto após o login
    };

    return(
        <form className="w-full flex flex-col gap-8">
            <div >
                <label htmlFor="email" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Informe seu e-mail:
                </label>
                <Input
                id="email"
                placeholder="E-mail aqui"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="senha" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Digite sua senha:
                </label>
                <Input
                id="senha"
                placeholder="Senha aqui"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                />
                <button className="font-secondary underline text-gray-quaternary text-sm pb-10 pt-6">
                    Esqueci minha senha!
                </button>
            </div>
            <Button 
            onClick={handleSubmit}
            className="w-full py-4 font-medium text-lg">
                Entrar
            </Button>
        </form>
    );
}