"use client"
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import Button from "@/app/components/ui/button";
import { PlansCarousel } from "@/app/components/ui/plans-Carousel/plans-carousel";
import { getBoxById } from "@/app/services/boxes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { useCarrinho } from "@/app/context/cartContext";

interface Box {
    id: number;
    nome: string;
    descricao_curta: string;
    descricao_longa: string;
    preco_mensal_4_un: string;
    preco_anual_4_un: string;
    preco_mensal_6_un: string;
    preco_anual_6_un: string;
    imagem_principal_url: string;
}

export default function Page(){ 

    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [boxData, setBoxData] = useState<Box | null>(null);
    const { addItem } = useCarrinho();
    
    useEffect(() => {
        if (!id) return;

        getBoxById(Number(id)).then((data) => {
            if (data.success) {
                setBoxData(data.box);
                console.log("Dados da caixa:", data.box);
            } else {
                console.error("Falha ao buscar dados da caixa:", data.message);
            }
        }).catch((error) => {
            console.error("Erro ao chamar getBoxById:", error);
        });
    }, 
    []);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert("Por favor, faça login para adicionar itens ao carrinho.");
            return;
        }
        if (!boxData) {
            alert("Box não carregada ainda.");
            return;
        }

        await addItem(boxData.id, 1);
        alert("Item adicionado ao carrinho!");
    };
    
    return( 
        <div> 
            <Header/>
            <PlansCarousel className=""> 
                <div className="h-96 w-full flex items-center justify-center gap-6 p-6 "> 
                    <div className="bg-blue-300 h-full w-full flex items-center justify-center">boxData X</div> 
                    <div className="bg-yellow-300 h-full w-full flex items-center justify-center">boxData X</div> 
                </div> 
            </PlansCarousel> 
            <div className="p-14">
                <img src={boxData?.imagem_principal_url} className="w-64 h-64 object-cover mt-8"/> 
                <h2 className="text-2xl font-bold mt-8">Detalhes da Box: {boxData?.nome || " - "}</h2> 
                <p className="mt-4">{boxData?.descricao_longa || " - "}</p> 
                <p className="mt-2 font-semibold">Preço 4 unidades: R$ {boxData?.preco_mensal_4_un || " - "}</p> 
                <p className="mt-2 font-semibold">Preço Anual 4 unidades: R$ {boxData?.preco_anual_4_un || " - "}</p>
                <p className="mt-2 font-semibold">Preço 6 unidades: R$ {boxData?.preco_mensal_6_un || " - "}</p> 
                <p className="mt-2 font-semibold">Preço Anual 6 unidades: R$ {boxData?.preco_anual_6_un || " - "}</p>
                <Button className="mt-6 w-48" onClick={handleAddToCart}>Adicionar ao Carrinho</Button>
            </div>
            <Footer/> 
        </div> 
        ); 
}