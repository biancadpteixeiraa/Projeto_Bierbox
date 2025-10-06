import { Icon } from "@iconify/react";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import AssinaturaForm from "@/app/components/forms/form-assinatura";

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
        <div className="pl-8 lg:pl-12 h-full flex flex-col max-w-screen-2xl">
            <h1 className="text-brown-tertiary text-xl font-secondary font-bold">Detalhes da Assinatura:</h1>
            <div className="flex flex-col lg:flex-row pt-8 h-full pb-8">
                <div className="lg:border-t border-gray-primary lg:w-8/12 xl:pr-32 pr-8 pt-6 pb-12">
                    <div key={assinatura.assinaturaid} className="flex items-center gap-8 pb-10">
                        <img   
                        alt=""
                        src={assinatura.img}
                        className="size-36 object-cover rounded-lg border border-yellow-tertiary"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-yellow-primary text-xl font-secondary font-semibold">{assinatura.nome}</h1>
                            <p className="text-brown-primary text-2xl font-secondary font-bold py-4">R${assinatura.valor}</p>
                            <span className="bg-green-primary text-white text-center uppercase sm:px-10 px-4 sm:text-sm text-xs font-bold py-1 rounded-full text-nowrap">{assinatura.plano}</span>
                        </div>
                    </div>
                    <div>
                        <AssinaturaForm/>
                    </div>
                </div>
                <div className="hidden lg:block h-[880px] w-1 border-gray-primary border-l" />
                <div className="flex flex-col items-center justify-between lg:w-5/12 w-full pb-20 lg:px-8 pr-8">
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
                <div className="pr-8 block lg:hidden">
                    <Button 
                    type="submit"
                    variant="quaternary"
                    className="w-full py-3 font-medium text-lg"
                    >
                        CANCELAR MINHA ASSINATURA
                    </Button>
                </div>
            </div>
        </div>
    );
}