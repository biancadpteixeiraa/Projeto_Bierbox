import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import { PlansCarousel } from "@/app/components/ui/plans-Carousel/plans-carousel";



export default function Page(){

    const plano = {
        "id": 1,
        "nome": "Box Clássica",
        "descricao": "Cervejas leves e tradicionais.",
        "preco": "79.90",
        "imagem_url": "https://cdn.awsli.com.br/2500x2500/785/785910/produto/56164920/ado---2025-01-07t143748-743-u5pf1k1mrs.png",
        "cervejas": [
            "Cerveja 1",
            "Cerveja 2",
            "Cerveja 3",
        ],
    }

    return(
        <div>
            <Header/>
            <PlansCarousel className="">
                <div className="h-96 w-full flex items-center justify-center gap-6 p-6 ">
                    <div className="bg-blue-300 h-full w-full flex items-center justify-center">Plano X</div>
                    <div className="bg-yellow-300 h-full w-full flex items-center justify-center">Plano X</div>
                </div>
            </PlansCarousel>
            <img src={plano.imagem_url} alt={plano.nome} className="w-64 h-64 object-cover mt-8"/>
            <h2 className="text-2xl font-bold mt-8">Detalhes do Plano: {plano.nome}</h2>
            <p className="mt-4">{plano.descricao}</p>
            <p className="mt-2 font-semibold">Preço: R$ {plano.preco}</p>
            <h3 className="text-xl font-semibold mt-6">Cervejas Incluídas:</h3>
            {
                plano.cervejas.map((cerveja, index) => (
                    <div key={index}>{cerveja}</div>
                ))
            }
            <Footer/>
        </div>
    );
}