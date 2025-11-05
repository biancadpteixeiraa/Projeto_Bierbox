"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DataCard from "@/app/components/ui/data-card";
import VendasTable from "../../tables/vendas/vendas";
import { paginate } from "@/app/lib/utils";
import { ChevronDown, Search } from "lucide-react";
import Input from "@/app/components/ui/input";
import Pagination from "@/app/components/ui/pagination";
import useDebounce from "@/app/hooks/hooks";
import { getPedidos } from "@/app/services/admin";
import { useAdminAuth } from "@/app/context/authAdminContext";

type Pedido = {
    id: string;
    assinatura_id: string;
    criado_em: string;
    valor_total: string;
    status_pedido: string;
};


export default function VendasArea() {
  const { token } = useAdminAuth();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  const searchTerm = searchParams.get("search") || "";
  const filtroStatus = searchParams.get("status") || "";
  const filtroPedidos = searchParams.get("pedidos") || "";

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 350);

  useEffect(() => {
    if (!token) return;

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const res = await getPedidos(token);
        console.log("Resposta da API:", res.data);
        setPedidos(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [token]);


  const updateSearchParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      value ? params.set(key, value) : params.delete(key);
      params.delete("page");

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
      updateSearchParams("search", debouncedSearch.trim());
    }
  }, [debouncedSearch]);

  const sortedPedidos = [...pedidos].sort(
    (a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
  );

  const filteredPedidos = useMemo(() => {
    return sortedPedidos.filter((pedido) => {
      const matchesSearch =
        pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.valor_total.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.status_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.criado_em.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filtroStatus
      ? pedido.status_pedido.toLowerCase() === filtroStatus.toLowerCase()
      : true;

      const matchesPedidos = filtroPedidos
        ? filtroPedidos === "sete"
          ? new Date(pedido.criado_em) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          : filtroPedidos === "quinze"
          ? new Date(pedido.criado_em) >= new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
          : filtroPedidos === "trinta"
          ? new Date(pedido.criado_em) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          : true
        : true;

      return matchesSearch && matchesStatus && matchesPedidos;
    });
  }, [sortedPedidos, searchTerm, filtroStatus, filtroPedidos]);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const perPage = 10;


  const paginatedPedidos = useMemo(() => {
    return paginate(filteredPedidos, currentPage, perPage);
  }, [filteredPedidos, currentPage]);

  const totalPages = Math.ceil(filteredPedidos.length / perPage);

  if (loading) {
    return <p className="text-center text-brown-tertiary mt-20">Carregando pedidos...</p>;
  }

  if (!pedidos.length && !loading) {
    return <p className="text-center text-brown-tertiary mt-20">Nenhum dado disponível</p>;
  }

  return (
    <div className="w-full h-full pt-8 md:pr-10">
      <DataCard className="w-full p-5">
        <div className="flex flex-col md:flex-row items-center justify-between w-full mb-3 gap-3">
          <div className="w-full relative">
            <Input
              className="w-full rounded-md border border-brown-primary pl-8 text-brown-primary placeholder:text-brown-primary"
              placeholder="Buscar"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-primary pointer-events-none" />
          </div>

          <div className="flex items-center w-full md:w-fit gap-3">
            <div className="relative w-1/2 md:w-44">
              <select
                id="status"
                name="status"
                className="text-sm sm:text-base w-full appearance-none border px-2 py-3 pr-10 rounded-md border-brown-primary bg-beige-primary"
                value={filtroStatus}
                onChange={(e) => updateSearchParams("status", e.target.value)}
              >
                <option value="">Status</option>
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-primary pointer-events-none" />
            </div>

            {/* Pedidos */}
            <div className="relative w-1/2 md:w-44">
              <select
                id="pedidos"
                name="pedidos"
                className="text-sm sm:text-base w-full appearance-none border px-2 py-3 rounded-md border border-brown-primary bg-beige-primary"
                value={filtroPedidos}
                onChange={(e) => updateSearchParams("pedidos", e.target.value)}
              >
                <option value="">Pedidos</option>
                <option value="sete">Últimos 7 dias</option>
                <option value="quinze">Últimos 15 dias</option>
                <option value="trinta">Últimos 30 dias</option>
                <option value="todos">Todos</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-primary pointer-events-none" />
            </div>
          </div>
        </div>

        <VendasTable dados={paginatedPedidos} />

        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </DataCard>
    </div>
  );
}
