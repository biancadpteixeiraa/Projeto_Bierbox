"use client";
import NewProduto from "@/app/components/admin/dashboard/produtos/new-produto/new-produto";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";



export default function Page() {

    const params = useParams();
    const id = params.id as string; 

    return(
        <div className="max-w-5xl h-full px-6 md:px-12 py-16">
            <div className="flex gap-4 items-center">
                <Link href={`/admin/${id}/dashboard/produtos`} className="text-brown-tertiary hover:text-brown-quaternary font-semibold">
                    <ArrowLeft size={28} />
                </Link>
                <h1 className="font-secondary text-2xl text-brown-tertiary font-bold">Adicionar nova Box:</h1>
            </div>
            <NewProduto/>
        </div>
    );
}