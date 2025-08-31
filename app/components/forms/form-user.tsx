'use client'
import Button from "../ui/button";
import Input from "../ui/input";
import { useState } from "react";
import { useAuth } from "@/app/context/authContext";

export default function UserForm(){


    return(
        <form className="w-full flex flex-col gap-8">
            <div>
                <label htmlFor="nome" className="pb-2 font-secondary text-gray-tertiary text-base">
                    Nome Completo
                </label>
                <Input
                id="nome"
                placeholder="Nome aqui"
                />
            </div>
            <div>
                <label htmlFor="email" className="pb-2 font-secondary text-gray-tertiary text-base">
                    E-mail
                </label>
                <Input
                id="email"
                placeholder="Email aqui"
                />
            </div>
            <div>
                <label htmlFor="cpf" className="pb-2 font-secondary text-gray-tertiary text-base">
                    CPF cadastrado
                </label>
                <Input
                id="cpf"
                placeholder="CPF aqui"
                />
            </div>
            <div>
                <label htmlFor="senha" className="pb-2 font-secondary text-gray-tertiary text-base">
                    Insira sua senha atual:
                </label>
                <Input
                id="senha"
                placeholder="Senha aqui"
                />
            </div>
            <div className="pb-36">
                <label htmlFor="novaSenha" className="pb-2 font-secondary text-gray-tertiary text-base">
                    Insira sua nova senha:
                </label>
                <Input
                id="novaSenha"
                placeholder="Confirme sua senha aqui"
                />
            </div>
            <Button 
                variant="quaternary"
                className="w-full py-4 font-medium text-xl">
                Atualizar meus Dados
            </Button>
        </form>
    );
}