
"use client";
import ProdutosArea from "@/app/components/admin/dashboard/produtos/produtos-area";
import Link from "next/link";
import { useParams } from "next/navigation";


export default function Page() {

    const params = useParams();
    const id = params.id as string; 

    return(
        <div className="max-w-6xl h-full px-6 md:px-12 py-16">
            <div className="flex justify-between md:pr-10">
                <h1 className="font-secondary text-2xl text-brown-tertiary font-bold">Produtos (Boxes)</h1>
                <Link href={`/admin/${id}/dashboard/produtos/novaBox`}>
                    <button className="bg-yellow-tertiary rounded-xl py-3 px-6 text-brown-primary text-xl font-semibold hover:bg-yellow-tertiary/80">
                        + Adicionar nova Box
                    </button>
                </Link>
            </div>
            <ProdutosArea />
        </div>
    );
}