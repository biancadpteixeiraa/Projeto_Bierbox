"use client";
import Button from "@/app/components/ui/button";
import DataCard from "@/app/components/ui/data-card";
import Input from "@/app/components/ui/input";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { getPedidoDetalhes, updatePedido } from "@/app/services/admin";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PedidoDetalhes {
  id: string | null;
  assinatura_id: string | null;
  assinatura_id_uuid: string | null;
  endereco_entrega_id: string | null;
  id_antigo: string | null;
  utilizador_id: string | null;
  utilizador_id_uuid: string | null;
  tipo_plano: string | null;
  quantidade_cervejas: number | null;

  cliente_nome: string | null;
  cliente_email: string | null;
  cliente_cpf: string | null;

  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  is_padrao: boolean | null;

  box_nome: string | null;
  valor_assinatura: number | null;
  valor_frete: number | null;
  valor_total: string | number | null;
  status_pedido: string | null;
  codigo_rastreio: string | null;
  criado_em: string | null;
  atualizado_em: string | null;
  data_pagamento: string | null;
}

export default function DetalhesVendas({ modo }: { modo: "ver" | "editar" }) {

    const { token } = useAdminAuth();
    const params = useParams();
    const id_pedido = params.id_pedido as string; 
    const [pedido, setPedido] = useState<PedidoDetalhes | null>(null);
    const [loading, setLoading] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const isEditMode = modo === "editar";

    const [statusPedido, setStatusPedido] = useState("");
    const [codigoRastreio, setCodigoRastreio] = useState("");

  useEffect(() => {
    if (!token) return;
    
    const fetchPedido = async () =>  {
        try {
            setLoading(true);
            const data = await getPedidoDetalhes(token, id_pedido);
            setPedido(data.data);
            setStatusPedido(data.data.status_pedido || "");
            setCodigoRastreio(data.data.codigo_rastreio || "");
        } catch (error) {
            toast.error("Erro ao carregar detalhes do pedido.");
        } finally {
            setLoading(false);
        }
    }

    fetchPedido();
  }, [id_pedido, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      toast.error("Token de autenticação não encontrado.");
      return;
    }

    setSalvando(true);
    try {
      await updatePedido(token, id_pedido, statusPedido, codigoRastreio);
      toast.success("Pedido atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar pedido.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Carregando pedido...</p>;
  }

  if (!pedido) {
    return <p className="text-center mt-10 text-red-500">Pedido não encontrado.</p>;
  }

    return(
        <div className="w-full h-full pt-8 md:pr-10">
            <DataCard className="p-5">
                <form  onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-lg font-semibold text-brown-tertiary">Informações pessoais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Nome do cliente</label>
                                <Input type="text" value={pedido.cliente_nome || ""} disabled readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Email</label>
                                <Input type="email" value={pedido.cliente_email || ""} disabled readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">CPF</label>
                                <Input type="text" value={pedido.cliente_cpf || ""} disabled readOnly />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-brown-tertiary">Endereço de Entrega</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Rua</label>
                                <Input type="text" value={pedido.rua || ""} disabled readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Bairro</label>
                                <Input type="text" value={pedido.bairro || ""} disabled readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">CEP</label>
                                <Input type="text" value={pedido.cep || ""} disabled readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Número</label>
                                <Input type="text" value={pedido.numero || ""} disabled readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Complemento</label>
                                <Input type="text" value={pedido.complemento || ""} disabled readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Cidade</label>
                                <Input type="text" value={pedido.cidade || ""} disabled readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Estado</label>
                                <Input type="text" value={pedido.estado || ""} disabled readOnly />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-brown-tertiary">Detalhes da compra</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Box escolhida</label>
                                <Input type="text" value={pedido.box_nome || ""} disabled readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Tipo de Plano</label>
                                <Input type="text" value={pedido.tipo_plano || ""} readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Quantidade de Cervejas</label>
                                <Input type="text" value={pedido.quantidade_cervejas || ""} readOnly disabled/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Valor da Box</label>
                                <Input type="text" value={
                                    pedido.valor_assinatura
                                    ? `R$ ${Number(pedido.valor_assinatura).toFixed(2)}`
                                    : ""
                                } readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Valor do Frete</label>
                                <Input type="text" value={
                                    pedido.valor_frete
                                    ? `R$ ${Number(pedido.valor_frete).toFixed(2)}`
                                    : ""
                                } readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Valor Total</label>
                                <Input type="text" value={
                                    pedido.valor_total
                                    ? `R$ ${Number(pedido.valor_total).toFixed(2)}`
                                    : ""
                                } readOnly disabled/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Método de Pagamento</label>
                                <Input type="text" value="Cartão de Crédito" readOnly disabled/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-brown-tertiary">Status e Rastreio</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Status do Pedido</label>
                                <Input type="text" value={statusPedido}
                                onChange={(e) => setStatusPedido(e.target.value)}
                                readOnly={!isEditMode} disabled={!isEditMode}/>
                            </div>
                            <div>
                                <label htmlFor="">Código de Rastreio</label>
                                <Input type="text" value={codigoRastreio}
                                onChange={(e) => setCodigoRastreio(e.target.value)}
                                readOnly={!isEditMode} disabled={!isEditMode}/>
                            </div>
                        </div>
                    </div>
                    
                    {isEditMode && (
                    <div className="flex flex-col items-start mt-8">
                        <h2 className="text-lg font-semibold text-brown-tertiary">Ações do Administrador</h2>
                        <div className="w-full flex justify-end mb-8">
                            <Button type="submit" disabled={salvando} className="flex items-center justify-center">
                                {salvando ? (
                                    <span className="mx-[53px] my-[3px] animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-4"></span>
                                ) : (
                                    "Salvar Alterações"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
                </form>
            </DataCard>
        </div>
    );
}