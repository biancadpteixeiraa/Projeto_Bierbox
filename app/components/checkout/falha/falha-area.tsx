"use client";
import Button from "../../ui/button";
import Link from "next/link";


export default function FalhaArea() {


    return (
        <div className="py-28 max-w-7xl mx-auto px-6">
            <div className="w-full flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 hidden lg:block">
                    <img src="/PagamentoFalha.png" 
                    alt="" 
                    className="w-full"/>
                </div>
                <div className="lg:w-1/2 flex flex-col lg:pl-16">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-red-600 font-extrabold md:text-start text-center">OPS, ALGO DEU ERRADO!</h1>
                    <div className="lg:hidden block">
                        <img src="/PagamentoFalha.png" 
                        alt="" 
                        className="w-full"/>
                    </div>
                    <p className="text-lg md:text-xl w-full !leading-tight tracking-wide">Não foi possível processar seu pagamento. Isso pode acontecer por diversos motivos, como dados incorretos ou uma recusa do seu banco. Mas não se preocupe, sua assinatura não foi criada e nenhum valor foi cobrado.</p>
                    
                    <div className="flex flex-col lg:flex-row gap-4 mt-12">
                        <Link href="/checkout">
                            <Button variant="primary" className="px-5 py-2 text-base lg:text-lg w-full font-medium">
                                Tentar novamente!
                            </Button>
                        </Link>
                        <Link href="/planos">
                            <Button variant="tertiary" className="px-4 py-2 text-base lg:text-lg w-full border-2 font-medium">
                                Escolher outra box
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}