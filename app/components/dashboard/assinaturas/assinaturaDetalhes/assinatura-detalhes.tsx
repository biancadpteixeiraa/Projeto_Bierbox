'use client'
import { Icon } from "@iconify/react";
import Button from "@/app/components/ui/button";
import AssinaturaForm from "@/app/components/forms/form-assinatura";
import { useAuth } from "@/app/context/authContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAssinaturaDetalhes } from "@/app/services/assinaturas";
import { toast } from "react-toastify";
import { AssinaturaDetalhesSkeleton } from "@/app/components/ui/skeletons";

type AssinaturaDetalhe = {
  id: string;
  plano_id: string;
  status: string;
  box_nome: string;
  box_imagem_url: string;
  valor_assinatura: string;
  data_inicio: string;
  forma_pagamento: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_estado: string;
  endereco_cep: string;
  endereco_complemento?: string;
};

export default function AssinaturaDetalhes(){

    const { token } = useAuth();
    const params = useParams();
    const assinaturaid = params.assinaturaid as string;

    const [assinatura, setAssinatura] = useState<AssinaturaDetalhe | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAssinatura = async () => {
        if (!token) return;
        try {
        const data = await getAssinaturaDetalhes(token, assinaturaid);
        setAssinatura(data.data);
        } catch (error) {
        toast.error("Erro ao carregar assinatura.");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssinatura();
    }, [token, assinaturaid]);

    if (loading) return <AssinaturaDetalhesSkeleton />
    if (!assinatura) return <div className="px-8 lg:px-12">Assinatura não encontrada.</div>;

    const planoFormatado =
        assinatura.plano_id === "PLANO_MENSAL" ? "Plano Mensal" : "Plano Anual";

    return (
        <div className="pl-8 lg:pl-12 h-full flex flex-col max-w-screen-2xl">
            <h1 className="text-brown-tertiary text-xl font-secondary font-bold">Detalhes da Assinatura:</h1>
            <div className="flex flex-col lg:flex-row pt-8 h-full pb-8">
                <div className="lg:border-t border-gray-primary lg:w-8/12 xl:pr-32 pr-8 pt-6 pb-12">
                    <div key={assinatura.id} className="flex items-center gap-8 pb-10">
                        <img   
                        alt=""
                        src={assinatura.box_imagem_url}
                        className="size-36 object-cover rounded-lg border border-yellow-tertiary"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-yellow-primary text-xl font-secondary font-semibold">{assinatura.box_nome}</h1>
                            <p className="text-brown-primary text-2xl font-secondary font-bold py-4">R${assinatura.valor_assinatura}</p>
                            <span className="bg-green-primary text-white text-center uppercase sm:px-10 px-4 sm:text-sm text-xs font-bold py-1 rounded-full text-nowrap">{planoFormatado}</span>
                        </div>
                    </div>
                    <div>
                        <AssinaturaForm assinatura={assinatura} onEnderecoAtualizado={fetchAssinatura}/>
                    </div>
                </div>
                <div className="hidden lg:block h-[880px] w-1 border-gray-primary border-l" />
                <div className="flex flex-col items-center justify-between lg:w-5/12 w-full pb-20 lg:px-8 pr-8">
                    <div className="flex flex-col items-center">
                        <div className="size-38 rounded-full bg-yellow-secondary flex items-center justify-center text-beige-primary">
                            <Icon icon="ri:truck-fill" className="text-7xl"/>
                        </div>
                        <a href="https://melhorrastreio.com.br/?_gl=1*pzuhw7*_gcl_au*NzA0MTY3NjAyLjE3NTMyOTIzMzk." 
                        target="_blank" 
                        rel="noopener noreferrer"
                        >
                            <Button variant="senary" className="mt-6 px-6 py-3 font-medium text-base rounded-none uppercase">
                                Acompanhar Entrega
                            </Button>
                        </a>
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