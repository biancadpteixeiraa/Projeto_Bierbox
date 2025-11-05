"use client";
import DetalhesVendas from "@/app/components/admin/dashboard/vendas/detalhes-vendas/detalhes-vendas";
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
                <Link href={`/admin/${id}/dashboard/vendas`} className="text-brown-tertiary hover:text-brown-quaternary font-semibold">
                    <ArrowLeft size={28} />
                </Link>
                <h1 className="font-secondary text-2xl text-brown-tertiary font-bold">Detalhes do Pedido:</h1>
            </div>
            <DetalhesVendas modo={modo}/>
        </div>
    );
}