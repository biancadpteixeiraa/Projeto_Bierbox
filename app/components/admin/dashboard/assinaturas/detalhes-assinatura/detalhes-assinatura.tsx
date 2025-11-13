import Button from "@/app/components/ui/button";
import DataCard from "@/app/components/ui/data-card";
import Input from "@/app/components/ui/input";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { cancelarAssinatura, getAssinaturaDetalhes, pausarAssinatura, reativarAssinatura } from "@/app/services/admin";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface HistoricoPagamento {
  data_pagamento: string;
  valor_total: number;
  status_pedido: string;
};

interface Assinatura {
  id_assinatura: string;
  box_nome: string;
  cliente_nome: string;
  cliente_email: string;
  data_criacao_assinatura: string;
  data_inicio: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_estado: string;
  endereco_cep: string;
  endereco_complemento: string;
  forma_pagamento: string;
  historico_pagamentos: HistoricoPagamento[];
  status: string;
  valor_box: string;
};


export default function DetalhesAssinatura({ modo }: { modo: "ver" | "editar" }) {

    const isEditMode = modo === "editar";
    const { token } = useAdminAuth();
    const params = useParams();
    const id_assinatura = params.id_assinatura as string; 
    const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
    const [loading, setLoading] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [acaoAtual, setAcaoAtual] = useState<"cancelar" | "pausar" | "reativar" | null>(null);


    useEffect(() => {
        if (!token) return;
        
        const fetchAssinatura = async () =>  {
            try {
                setLoading(true);
                const data = await getAssinaturaDetalhes(token, id_assinatura);
                setAssinatura(data.data);
                console.log(data.data)
            } catch (error) {
                toast.error("Erro ao carregar detalhes da assinatura.");
            } finally {
                setLoading(false);
            }
        }

        fetchAssinatura();
    }, [id_assinatura, token]);

    async function handleAction(action: "cancelar" | "pausar" | "reativar") {
        if (!token || !assinatura) return;

        setAcaoAtual(action);
        setSalvando(true);
        try {
        let response;

        if (action === "cancelar") {
            response = await cancelarAssinatura(token, id_assinatura);
        } else if (action === "pausar") {
            response = await pausarAssinatura(token, id_assinatura);
        } else {
            response = await reativarAssinatura(token, id_assinatura);
        }

        toast.success(response.message || "Ação realizada com sucesso!");
        setAssinatura(response.data);
        } catch (error: any) {
        const message =
            error?.response?.data?.message || "Erro ao executar ação.";
        toast.error(message);
        } finally {
            setSalvando(false);
            setAcaoAtual(null);
        }
    }

    if (loading) {
        return <p className="text-center mt-10">Carregando assinatura...</p>;
    }

    if (!assinatura) {
        return <p className="text-center mt-10 text-red-500">Assinatura não encontrado.</p>;
    }

    const status = assinatura.status?.toUpperCase();

    return(
        <div className="w-full h-full pt-8 md:pr-10">
            <DataCard className="p-5">
                <form className="flex flex-col gap-6">
                    <div>
                        <h2>Informações pessoais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Nome do cliente</label>
                                <Input type="text" value={assinatura.cliente_nome || ""} readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Email</label>
                                <Input type="email" value={assinatura.cliente_email || ""} readOnly disabled/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Detalhes da compra</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Box escolhida</label>
                                <Input type="text" value={assinatura.box_nome || ""} readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Tipo de Plano</label>
                                <Input type="text" value="Plano Mensal" readOnly disabled/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Valor da Box</label>
                                <Input type="text" value={`R$ ${parseFloat(assinatura.valor_box).toFixed(2)}` || ""} readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Data de Início</label>
                                <Input type="text" value={new Date(assinatura.data_inicio).toLocaleDateString(
                                    "pt-BR"
                                ) || ""} readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Status Atual</label>
                                <Input type="text" value={status || ""} readOnly disabled/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Endereço de Entrega Atual</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Rua</label>
                                <Input type="text" value={assinatura.endereco_rua || ""} readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Bairro</label>
                                <Input type="text" value={assinatura.endereco_bairro || ""} readOnly disabled/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">CEP</label>
                                <Input type="text" value={assinatura.endereco_cep || ""} readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Número</label>
                                <Input type="text" value={assinatura.endereco_numero || ""} readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Complemento</label>
                                <Input type="text" value={assinatura.endereco_complemento || ""} readOnly disabled/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Cidade</label>
                                <Input type="text" value={assinatura.endereco_cidade || ""} readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Estado</label>
                                <Input type="text" value={assinatura.endereco_estado || ""} readOnly disabled/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Históricos de Pagamentos</h2>
                        <table className="w-2/3 mt-4 border-collapse">
                            <thead className="border border-brown-primary">
                                <tr>
                                    <th className="text-left p-2 border border-brown-primary">Data</th>
                                    <th className="text-left p-2 border border-brown-primary">Valor</th>
                                    <th className="text-left p-2 border border-brown-primary">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assinatura.historico_pagamentos?.length > 0 ? (
                                assinatura.historico_pagamentos.map((p, i) => (
                                    <tr key={i}>
                                    <td className="p-2 border border-brown-primary">
                                        {new Date(p.data_pagamento).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="p-2 border border-brown-primary">
                                        R$ {p.valor_total.toFixed(2)}
                                    </td>
                                    <td className="p-2 border border-brown-primary">
                                        {p.status_pedido}
                                    </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                    <td
                                    colSpan={3}
                                    className="p-2 border text-center border-brown-primary text-gray-500"
                                    >
                                    Nenhum pagamento registrado
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {isEditMode && (
                        <>
                        {(status === "ATIVA" || status === "PAUSADA") && (
                            <div className="flex flex-col items-start gap-4 justify-start mt-8">
                                <h2>Ações do Administrador</h2>
                                {status === "ATIVA" && (
                                <>
                                <div className="flex flex-col lg:flex-row gap-6 pb-8">
                                    <Button
                                    className="bg-red-600 text-beige-primary disabled:bg-red-600/70 hover:bg-red-600/80 font-medium text-base md:text-lg py-2 px-12 flex items-center justify-center"
                                    disabled={salvando && acaoAtual === "cancelar"}
                                    onClick={() => handleAction("cancelar")}
                                    >
                                    {acaoAtual === "cancelar" && salvando ? (
                                        <span className="mx-[53px] my-2 animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-4"></span>
                                    ) : (
                                        "Cancelar Assinatura"
                                    )}
                                    </Button>
                                    <Button
                                    className="py-2 font-medium px-14 text-base md:text-lg flex items-center justify-center"
                                    disabled={salvando && acaoAtual === "pausar"}
                                    onClick={() => handleAction("pausar")}
                                    >
                                    {acaoAtual === "pausar" && salvando ? (
                                        <span className="mx-[53px] my-2 animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-4"></span>
                                    ) : (
                                        "Pausar Assinatura"
                                    )}
                                    </Button>
                                </div>
                                </>
                                )}

                                {status === "PAUSADA" && (
                                <>
                                    <div className="flex flex-col lg:flex-row gap-6 pb-8">
                                        <Button
                                        className="bg-red-600 text-beige-primary disabled:bg-red-600/70 hover:bg-red-600/80 font-medium text-base md:text-lg py-2 px-12 flex items-center justify-center"
                                        disabled={salvando && acaoAtual === "cancelar"}
                                        onClick={() => handleAction("cancelar")}
                                        >
                                        {acaoAtual === "cancelar" && salvando ? (
                                            <span className="mx-[53px] my-2 animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-4"></span>
                                        ) : (
                                            "Cancelar Assinatura"
                                        )}
                                        </Button>
                                        <Button
                                        className="py-2 font-medium px-14 text-base md:text-lg flex items-center justify-center"
                                        disabled={salvando && acaoAtual === "reativar"}
                                        onClick={() => handleAction("reativar")}
                                        >
                                        {acaoAtual === "reativar" && salvando ? (
                                            <span className="mx-[53px] my-2 animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-4"></span>
                                        ) : (
                                            "Reativar Assinatura"
                                        )}
                                        </Button>
                                    </div>
                                </>
                                )}
                            </div>
                        )}
                        </>
                    )}

                </form>
            </DataCard>
        </div>
    );
}