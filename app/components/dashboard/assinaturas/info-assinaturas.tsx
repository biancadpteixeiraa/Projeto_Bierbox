'use client';
import Link from "next/link";
import Button from "../../ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { toast } from "react-toastify";
import { getAssinaturas } from "@/app/services/assinaturas";
import { AssinaturasListSkeleton } from "../../ui/skeletons";

type Assinatura = {
  id: string;
  plano_id: string;
  status: string;
  box_nome: string;
  box_imagem_url: string;
};

export default function InfoAssinaturas() {
    const { token } = useAuth();

    const params = useParams();
    const id = params.id as string; 

    const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchAssinaturas = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
        const data = await getAssinaturas(token);
        const lista = Array.isArray(data.data) ? data.data : [];

        const ordemStatus: Record<string, number> = { 
            ATIVA: 1, 
            PENDENTE: 2, 
            CANCELADA: 3 
        };

        const assinaturasOrdenadas = lista.sort(
            (a: Assinatura, b: Assinatura) => {
            const ordemA = ordemStatus[a.status] || 99;
            const ordemB = ordemStatus[b.status] || 99;
            return ordemA - ordemB;
            }
        );

        setAssinaturas(assinaturasOrdenadas);
        } catch (err) {
        console.error("Erro ao buscar Assinaturas:", err);
        toast.error("Erro ao carregar Assinaturas. Tente novamente.");
        } finally {
        setLoading(false);
        }
    };
    fetchAssinaturas();
    }, [token]);

    const getStatusColor = (status: string) => {
        switch (status) {
        case "ATIVA":
            return "bg-[#00B05B] text-white";
        case "PENDENTE":
            return "bg-yellow-primary text-white";
        case "CANCELADA":
            return "bg-[#CD5656] text-white";
        default:
            return "bg-gray-100 text-gray-700 border border-gray-300";
        }
    };


    if (loading) return <div><AssinaturasListSkeleton/></div>

    return (
        <div className="px-8 lg:px-12 h-screen max-w-screen-2xl">
            <h1 className="text-brown-tertiary text-lg font-secondary font-bold">Minha(s) Assinatura(s):</h1>
            <div className="flex pt-8">
                <div className="lg:w-8/12 w-full">
                {assinaturas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto pt-20">
                        <h1 className="text-brown-tertiary md:text-2xl text-xl font-secondary font-bold pb-10">
                        Você ainda não tem Assinaturas Ativas!
                        </h1>
                        <img
                        src="/NoAddress.png"
                        alt="Sem Assinaturas"
                        className="md:w-[550px] w-auto mx-auto md:mb-6 pb-20"
                        />
                        <Link href="\planos">
                            <Button
                            className="w-full mb-20 md:text-lg text-sm"
                            variant="quaternary"
                            >
                            Assinar Agora!
                            </Button>
                        </Link>
                    </div>
                ) : (
                    assinaturas.map((assinatura) => {
                    const planoFormatado =
                        assinatura.plano_id === "PLANO_MENSAL" ? "Plano Mensal" : "Plano Anual";

                    return (
                        <div
                        key={assinatura.id}
                        className="py-6 border-t border-gray-primary flex items-center justify-between pb-8"
                        >
                            <div className="flex flex-col items-center relative">
                                <img
                                    alt=""
                                    src={assinatura.box_imagem_url}
                                    className="md:size-36 size-28 object-cover rounded-md border border-yellow-tertiary"
                                />
                                <p
                                className={`w-24 text-[10px] font-secondary font-bold px-3 py-1 rounded-full text-center uppercase absolute -bottom-3 ${getStatusColor(
                                    assinatura.status
                                )}`}
                                >{assinatura.status}
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-brown-primary text-xl font-secondary font-semibold">
                                {assinatura.box_nome}
                                </h1>
                                <p className="text-yellow-primary text-sm font-secondary font-bold py-3">
                                {planoFormatado}
                                </p>
                                <Link href={`/dashboard/${id}/assinaturas/${assinatura.id}`}>
                                <Button
                                    variant="quaternary"
                                    className="w-36 py-1 rounded md:text-sm text-xs font-secondary font-semibold"
                                >
                                    Ver Mais
                                </Button>
                                </Link>
                            </div>
                        </div>
                    );
                })
            )}
            </div>
        </div>
    </div>
  );
}