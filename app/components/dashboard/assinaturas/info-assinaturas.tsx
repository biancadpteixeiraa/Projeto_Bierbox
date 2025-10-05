'use client';
import Link from "next/link";
import Button from "../../ui/button";
import { useParams, usePathname } from "next/navigation";


export default function InfoAssinaturas() {
    const pathname = usePathname();
    const params = useParams();
    const id = params.id as string; 

    const assinaturas = [
        {
            assinaturaid: 1,
            nome: "Combo Ouro",
            plano: "Plano Mensal",
            img: "/plano.png",
            src: `/dashboard/${id}/assinaturas/assinaturaid`
        },
        {
            assinaturaid: 2,
            nome: "Combo Prata",
            plano: "Plano Anual",
            img: "/plano.png",
            src: `/dashboard/${id}/assinaturas/assinaturaid`
        },
        {
            assinaturaid: 3,
            nome: "Combo Bonze",
            plano: "Plano Mensal",
            img: "/plano.png",
            src: `/dashboard/${id}/assinaturas/assinaturaid`
        },
        {
            assinaturaid: 4,
            nome: "Combo Prata",
            plano: "Plano Anual",
            img: "/plano.png",
            src: `/dashboard/${id}/assinaturas/assinaturaid`
        },
        {
            assinaturaid: 5,
            nome: "Combo Prata",
            plano: "Plano Mensal",
            img: "/plano.png",
            src: `/dashboard/${id}/assinaturas/assinaturaid`
        }
    ];

    return (
        <div className="px-8 lg:px-12 h-screen max-w-screen-2xl">
            <h1 className="text-brown-tertiary text-lg font-secondary font-bold">Minha(s) Assinatura(s):</h1>
            <div className="flex pt-8">
                <div className="lg:w-8/12 w-full">
                    {assinaturas.map((assinatura) => (
                        <div key={assinatura.assinaturaid} className="py-8 border-t border-gray-primary flex items-center justify-between pb-8">
                            <img   
                            alt=""
                            src={assinatura.img}
                            className="md:size-36 size-28 object-cover rounded-md border border-yellow-tertiary"
                            />
                            <div className="flex flex-col">
                                <h1 className="text-brown-primary text-xl font-secondary font-semibold">{assinatura.nome}</h1>
                                <p className="text-yellow-primary text-sm font-secondary font-bold py-3">{assinatura.plano}</p>
                                <Link href={assinatura.src} className="">
                                    <Button variant="quaternary" className="w-full py-1 rounded md:text-sm text-xs font-secondary font-semibold">Ver Mais</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}