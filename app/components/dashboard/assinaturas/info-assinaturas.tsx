import Link from "next/link";
import Button from "../../ui/button";


export default function InfoAssinaturas() {

    const assinaturas = [
        {
            assinaturaid: 1,
            nome: "Combo Ouro",
            plano: "Plano Mensal",
            img: "/plano.png",
            src: "/dashboard/id/assinaturas/assinaturaid"
        },
        {
            assinaturaid: 2,
            nome: "Combo Prata",
            plano: "Plano Anual",
            img: "/plano.png",
            src: "/dashboard/id/assinaturas/assinaturaid"
        }
    ];

    return (
        <div className="pl-16 py-10">
            <h1 className="text-brown-tertiary text-2xl font-secondary font-bold">Minha(s) Assinatura(s):</h1>
            <div className="flex pt-10">
                <div className="w-9/12">
                    {assinaturas.map((assinatura) => (
                        <div key={assinatura.assinaturaid} className="py-8 border-t border-gray-primary flex items-center justify-between pb-10">
                            <img   
                            alt=""
                            src={assinatura.img}
                            className="size-40 object-cover rounded-md border border-yellow-tertiary"
                            />
                            <div className="flex flex-col">
                                <h1 className="text-brown-primary text-2xl font-secondary font-medium">{assinatura.nome}</h1>
                                <p className="text-yellow-primary text-base font-secondary font-bold py-3">{assinatura.plano}</p>
                                <Link href={assinatura.src} className="text-yellow-tertiary text-sm font-secondary font-medium hover:underline mt-2">
                                    <Button variant="quaternary" className="w-full py-1 rounded">Ver Mais</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}