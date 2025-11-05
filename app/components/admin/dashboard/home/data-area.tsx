"use client";

import DataCard from "@/app/components/ui/data-card";
import ReceitaChart from "../../charts/dashboard/receita";
import AssinaturasChart from "../../charts/dashboard/assinaturas";
import UltimosPedidosTable from "../../tables/ultimos-pedidos";
import UltimosUsuariosTable from "../../tables/ultimos-usuarios";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { getEstatisticasDash} from "@/app/services/admin";

type Kpis = {
  receitaTotal: number;
  assinaturasAtivas: number;
  novosClientes30d: number;
  pedidosNoMes: number;
};

type ReceitaMensal = { mes: string; receita: string }[];
type AssinaturasPorPlano = { plano_id: string; total: string }[];
type UltimoPedido = { id: string; cliente_nome: string; valor_total: number; criado_em: string; status_pedido: string }[];
type UltimoUsuario = { id: string; nome_completo: string; email: string; data_criacao: string }[];

type DataStats = {
  kpis: Kpis;
  receitaMensal: ReceitaMensal;
  assinaturasPorPlano: AssinaturasPorPlano;
  ultimosPedidos: UltimoPedido;
  ultimosUsuarios: UltimoUsuario;
};


export default function DataArea() {

  const { token } = useAdminAuth();
  const [dataStats, setDataStats] = useState<DataStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await getEstatisticasDash(token);
        console.log("Resposta da API:", res.data);

        if (res?.data) {
          setDataStats(res.data);
        }
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (loading) {
    return <p className="text-center text-brown-tertiary mt-20">Carregando estatísticas...</p>;
  }

  if (!dataStats) {
    return <p className="text-center text-brown-tertiary mt-20">Nenhum dado disponível</p>;
  }

  const { kpis, receitaMensal, assinaturasPorPlano, ultimosPedidos, ultimosUsuarios } = dataStats;
        

    return(
        <div className="w-full h-full pt-12">
            <div className="flex flex-wrap lg:flex-row items-center gap-5 w-full">
                <DataCard className="md:w-60 pl-5 pr-1 w-full">
                    <p className="text-brown-tertiary text-lg">Receita Total Bruta</p>
                    <h2 className="font-secondary text-xl text-brown-tertiary font-bold mt-3">{kpis.receitaTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</h2>
                </DataCard>
                <DataCard className="md:w-60 pl-5 pr-1 w-full">
                    <p className="text-brown-tertiary text-lg">Assinaturas Ativas</p>
                    <h2 className="font-secondary text-xl text-brown-tertiary font-bold mt-3">{kpis.assinaturasAtivas}</h2>
                </DataCard>
                <DataCard className="md:w-60 pl-5 pr-1 w-full">
                    <p className="text-brown-tertiary text-lg">Novos nos últimos 30 dias</p>
                    <h2 className="font-secondary text-xl text-brown-tertiary font-bold mt-3">{kpis.novosClientes30d}</h2>
                </DataCard>
                <DataCard className="md:w-60 pl-5 pr-1 w-full">
                    <p className="text-brown-tertiary text-lg">Pedidos do Mês</p>
                    <h2 className="font-secondary text-xl text-brown-tertiary font-bold mt-3">{kpis.pedidosNoMes}</h2>
                </DataCard>
            </div>
            <div className="pt-10 flex flex-col lg:flex-row gap-5 md:pr-10">
                <DataCard className="flex-1 h-[237px] py-4 pr-6 pl-3 2xl:min-w-[500px]">
                    <p className="text-brown-tertiary text-lg pl-1">Receita por mês - R$</p>
                    <ReceitaChart data={receitaMensal}/>
                </DataCard>
                <DataCard className="flex-1 h-[237px] py-4 pr-8 2xl:min-w-[500px]">
                    <p className="text-brown-tertiary text-lg">Assinaturas por plano</p>
                    <AssinaturasChart data={assinaturasPorPlano} />
                </DataCard>
            </div>
            <div className="pt-10 flex flex-col lg:flex-row gap-5 md:pr-10">
                <DataCard className="flex-1 h-[237px] p-4 2xl:min-w-[500px] justify-start">
                    <p className="text-brown-tertiary text-lg pb-2">Últimos Pedidos</p>
                    <UltimosPedidosTable data={ultimosPedidos}/>
                </DataCard>
                <DataCard className="flex-1 h-[237px] p-4 2xl:min-w-[500px] justify-start">
                    <p className="text-brown-tertiary text-lg pb-2">Últimos usuários</p>
                    <UltimosUsuariosTable data={ultimosUsuarios}/>
                </DataCard>
            </div>
        </div>
    );
}