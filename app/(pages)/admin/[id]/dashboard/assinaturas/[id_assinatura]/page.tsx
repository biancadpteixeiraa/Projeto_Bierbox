"use client";
import DetalhesAssinatura from "@/app/components/admin/dashboard/assinaturas/detalhes-assinatura/detalhes-assinatura";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";



export default function Page() {

    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string; 

    const modoParam = searchParams.get("modo");
    const modo = modoParam === "editar" ? "editar" : "ver";

    return(
        <div className="max-w-5xl h-full px-6 md:px-12 py-16">
            <div className="flex gap-4 items-center">
                <Link href={`/admin/${id}/dashboard/assinaturas`} className="text-brown-tertiary hover:text-brown-quaternary font-semibold">
                    <ArrowLeft size={28} />
                </Link>
                <h1 className="font-secondary text-2xl text-brown-tertiary font-bold">Detalhes da Assinatura:</h1>
            </div>
            <DetalhesAssinatura modo={modo}/>
        </div>
    );
}