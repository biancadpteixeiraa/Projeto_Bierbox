'use client'
import { Icon } from "@iconify/react";
import Button from "../ui/button";
import Input from "../ui/input";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";

export default function CadastroForm(){
    const { register } = useAuth();

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [termos, setTermos] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (senha !== confirmSenha) {
        setError('As senhas não coincidem.');
        return;
        }
        if (senha.length < 8) {
        setError('A senha deve ter pelo menos 8 caracteres.');
        return;
        }
        if (!termos) {
        setError('Você precisa aceitar os termos.');
        return;
        }

        setError(null);

        await register(nomeCompleto, email, cpf, senha);
    };

    return(
        <form className="w-full flex flex-col gap-8">
            <div >
                <label htmlFor="nomeCompleto" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Informe seu nome completo:
                </label>
                <Input
                type="text"
                id="nomeCompleto"
                placeholder="Nome aqui"
                value={nomeCompleto}
                onChange={e => setNomeCompleto(e.target.value)} 
                required
                />
            </div>
            <div>
                <label htmlFor="email" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Qual é seu e-mail?
                </label>
                <Input
                type="email"
                id="email"
                placeholder="E-mail aqui"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                />
            </div> 
            <div>
                <label htmlFor="cpf" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Informe seu CPF:
                </label>
                <Input
                type="text"
                placeholder="CPF aqui"
                id="cpf"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                required
                />
            </div> 
            <div className="flex flex-col">
                <div className="flex justfy-between pb-2">
                    <label htmlFor="senha" className="font-secondary text-gray-tertiary text-sm w-full">
                        Crie uma senha:
                    </label>
                    <button
                    type="button"
                    className="flex items-center"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    >
                        <Icon icon={mostrarSenha ? "mdi:eye-off" : "mdi:eye"} className="text-gray-tertiary text-base" />
                        <p className="pl-2 text-gray-tertiary text-sm">{mostrarSenha ? "Hide" : "Show"}</p>
                    </button>
                </div>
                <Input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha aqui"
                id="senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                />
                <p className="font-secondary text-gray-quaternary text-xs pt-2">
                    Crie uma senha com mais de 8 dígitos contendo números e letras.
                </p>
            </div> 
            <div>
                <label htmlFor="confirmSenha" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Confirme sua senha:
                </label>
                <Input
                placeholder="Confirme sua senha aqui"
                id="confirmSenha"
                value={confirmSenha}
                onChange={e => setConfirmSenha(e.target.value)}
                required
                />
            </div> 
            <div className="flex items-center pb-6 gap-2">
                <input
                type="checkbox"
                checked={termos}
                onChange={e => setTermos(e.target.checked)}
                className="size-3 appearance-none rounded-sm border-2 border-gray-primary bg-beige-primary checked:border-indigo-600 checked:bg-indigo-600"
                />
                <p className="font-secondary text-gray-quaternary text-sm">
                    Estou de acordo com os <span className="underline">Termos de Uso</span> e <span className="underline">Políticas de Privacidade.</span>
                </p>
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}

            <Button onClick={handleSubmit} className="w-full py-4 font-medium text-lg">
                Realizar cadastro
            </Button>
        </form>
    );
}