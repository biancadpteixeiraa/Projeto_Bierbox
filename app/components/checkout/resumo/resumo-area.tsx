"use client";
import { useState } from "react";
import Button from "../../ui/button";


export default function ResumoArea() {

    const [statusCompra, setStatusCompra] = useState("Pendente");

    return (
        <div className="py-28 max-w-7xl mx-auto px-6">
            {
            statusCompra === "Aprovado" && (
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
                        
                        <div className="text-lg md:text-xl mt-8">
                            <p>Detalhes do Pedido:</p>
                            <ul className="list-disc list-inside mt-4 leading-tight">
                                <li>Produto: Box Mensal</li>
                                <li>Valor: R$ 79,90</li>
                                <li>Data de Entrega: 15/09/2024</li>
                                <li>Endereço: Rua Exemplo, 123, Cidade, Estado</li>
                                <li>Tipo de Cobrança: Cartão de Crédito</li>
                            </ul>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4 mt-12">
                            <Button variant="primary" className="px-5 lg:py-1 py-2 text-base lg:text-lg w-full lg:w-2/4 font-medium">
                                Ver Detalhes do Pedido
                            </Button>
                            <Button variant="tertiary" className="px-4 lg:py-1 py-2 text-base lg:text-lg w-full lg:w-[35%] border-2 font-medium">
                                Voltar ao início
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {
            statusCompra === "Rejeitado" && (
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
                        
                        <div className="text-lg md:text-xl mt-6">
                            <p>Detalhes do Pedido:</p>
                            <ul className="list-disc list-inside mt-4 leading-tight">
                                <li>Produto: Box Mensal</li>
                                <li>Valor: R$ 79,90</li>
                                <li>Data de Entrega: 15/09/2024</li>
                                <li>Endereço: Rua Exemplo, 123, Cidade, Estado</li>
                                <li>Tipo de Cobrança: Cartão de Crédito</li>
                            </ul>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4 mt-12">
                            <Button variant="primary" className="px-5 lg:py-1 py-2 text-base lg:text-lg w-full lg:w-1/2 font-medium">
                                Tentar novamente!
                            </Button>
                            <Button variant="tertiary" className="px-4 lg:py-1 py-2 text-base lg:text-lg w-full lg:w-1/2 border-2 font-medium">
                                Escolher outra box
                            </Button>
                        </div>
                    </div>
                </div>
                )
            } 
            {
            statusCompra === "Pendente" && (
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
                        
                        <div className="text-lg md:text-xl mt-8">
                            <p>Detalhes do Pedido:</p>
                            <ul className="list-disc list-inside mt-4 leading-tight">
                                <li>Produto: Box Mensal</li>
                                <li>Valor: R$ 79,90</li>
                                <li>Data de Entrega: 15/09/2024</li>
                                <li>Endereço: Rua Exemplo, 123, Cidade, Estado</li>
                                <li>Tipo de Cobrança: Cartão de Crédito</li>
                            </ul>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-4 mt-12">
                            <Button variant="primary" className="px-4 lg:py-1 py-2 text-base lg:text-lg w-full lg:w-2/4 font-medium">
                                Ver Minhas Assinaturas
                            </Button>
                            <Button variant="tertiary" className="px-4 lg:py-1 py-2 text-base lg:text-lg w-full lg:w-[35%] border-2 font-medium">
                                Voltar ao início
                            </Button>
                        </div>
                    </div>
                </div>
                )
            }
        </div>
    );
}