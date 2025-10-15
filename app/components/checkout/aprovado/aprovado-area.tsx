"use client";

import Button from "../../ui/button";
import Link from "next/link";
import { useAuth } from "@/app/context/authContext";


export default function AprovadoArea() {
    const { user} = useAuth(); 
    

    return (
        <div className="py-28 max-w-7xl mx-auto px-6">
            <div className="w-full flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 hidden lg:block">
                    <img src="/PagamentoAprovado.png" 
                    alt="" 
                    className="w-full"/>
                </div>
                <div className="lg:w-1/2 flex flex-col lg:pl-16">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-brown-tertiary font-extrabold md:text-start text-center">PAGAMENTO APROVADO!</h1>
                    <div className="lg:hidden block">
                        <img src="/PagamentoAprovado.png" 
                        alt="" 
                        className="w-full"/>
                    </div>
                    <p className="text-lg md:text-xl w-full lg:w-3/4 !leading-tight tracking-wide">Sua assinatura foi finalizada com sucesso! Nossa equipe está preparando tudo para a box chegar em breve. </p>
                    
                    <div className="flex flex-col lg:flex-row gap-4 mt-12">
                        <Link href={`/dashboard/${user?.id}`}>
                            <Button variant="primary" className="px-5 lg:py-1 py-2 text-base lg:text-lg w-full lg:w-2/4 font-medium">
                                Ver Detalhes do Pedido
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="tertiary" className="px-4 lg:py-1 py-2 text-base lg:text-lg w-full lg:w-[35%] border-2 font-medium">
                                Voltar ao início
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}