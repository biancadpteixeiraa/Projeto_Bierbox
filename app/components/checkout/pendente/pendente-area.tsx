"use client";

import Link from "next/link";
import Button from "../../ui/button";
import { useAuth } from "@/app/context/authContext";


export default function PendenteArea() {
    const { user} = useAuth(); 


    return (
        <div className="py-28 max-w-7xl mx-auto px-6">
            <div className="w-full flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 hidden lg:block">
                    <img src="/PagamentoPendente.png" 
                    alt="" 
                    className="w-full"/>
                </div>
                <div className="lg:w-1/2 flex flex-col lg:pl-16">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-brown-tertiary font-extrabold md:text-start text-center">PAGAMENTO PENDENTE!</h1>
                    <div className="lg:hidden block flex justify-center">
                        <img src="/PagamentoPendente.png" 
                        alt="" 
                        className="w-auto max-h-[400px] image-cover image-center"/>
                    </div>
                    <p className="text-lg md:text-xl w-full lg:w-3/4 leading-tight tracking-wide">Seu pagamento está sendo processado e no momento encontra-se em análise. Assim que for aprovado, sua assinatura será ativada e nós começaremos a preparar sua box.</p>
                    
                    <div className="flex flex-col lg:flex-row gap-4 mt-12">
                        <Link href={`/dashboard/${user?.id}`}>
                            <Button variant="primary" className="px-5 lg:py-1 py-2 text-base lg:text-lg w-full lg:w-2/4 font-medium">
                                Ver Minhas Assinaturas
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