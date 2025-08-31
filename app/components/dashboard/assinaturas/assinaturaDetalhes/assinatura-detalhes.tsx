import { Icon } from "@iconify/react";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";

export default function AssinaturaDetalhes(){

    const assinatura = {
        assinaturaid: 1,
        nome: "Combo Ouro",
        valor: '76,00',
        plano: "Plano Mensal",
        img: "/plano.png",
        dataInicio: "01/01/2024",
        statusEntrega: "A caminho",
        metodoPagamento: "1x de 76,00 no Cartão de Crédito",
    }

    return (
        <div className="pl-16 py-10">
                    <h1 className="text-brown-tertiary text-2xl font-secondary font-bold">Detalhes da Assinatura:</h1>
                    <div className="flex pt-10">
                        <div className="border-t border-r border-gray-primary w-9/12 pr-40 py-8">
                            <div key={assinatura.assinaturaid} className="flex items-center gap-12 pb-10">
                                <img   
                                alt=""
                                src={assinatura.img}
                                className="size-52 object-cover rounded-lg border border-yellow-tertiary"
                                />
                                <div className="flex flex-col">
                                    <h1 className="text-yellow-primary text-2xl font-secondary font-medium">{assinatura.nome}</h1>
                                    <p className="text-brown-primary text-4xl font-secondary font-bold py-4">R${assinatura.valor}</p>
                                    <span className="bg-green-primary text-white text-center uppercase px-10 text-base font-bold py-1 rounded-full">{assinatura.plano}</span>
                                </div>
                            </div>
                            <div>
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
                                        CANCELAR MINHA ASSINATURA
                                    </Button>
                                </form>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-between w-5/12 pb-20">
                            <div className="flex flex-col items-center">
                                <div className="size-38 rounded-full bg-yellow-secondary flex items-center justify-center text-beige-primary">
                                    <Icon icon="ri:truck-fill" className="text-7xl"/>
                                </div>
                                <Button variant="senary" className="mt-6 px-6 py-3 font-medium text-base rounded-none uppercase">
                                    Acompanhar Entrega
                                </Button>
                                <div className="pt-10 text-brown-primary text-base font-secondary font-medium text-center">
                                    <p>
                                        Acompanhe a entrega do <br /> seu pedido aqui!
                                    </p>
                                </div>
        
                            </div>
                        </div>
                    </div>
                </div>
    );
}