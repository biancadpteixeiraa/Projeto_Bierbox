"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DataCard from "@/app/components/ui/data-card";
import { paginate } from "@/app/lib/utils";
import { ChevronDown, Search } from "lucide-react";
import Input from "@/app/components/ui/input";
import Pagination from "@/app/components/ui/pagination";
import AssinaturasTable from "../../tables/assinaturas/assinaturas";
import useDebounce from "@/app/hooks/hooks";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { getAssinaturas } from "@/app/services/admin";

type Assinatura = {
  id_assinatura: string;
  cliente_nome: string;
  plano: string;
  box_nome: string;
  status: string;
  data_inicio: string;
}


export default function AssinaturasArea() {
  const { token } = useAdminAuth();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [loading, setLoading] = useState(false);

  const searchTerm = searchParams.get("search") || "";
  const filtroStatus = searchParams.get("status") || "";
  const filtroPlano = searchParams.get("plano") || "";

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 350);

  useEffect(() => {
    if (!token) return;

    const fetchAssinaturas = async () => {
      try {
        setLoading(true);
        const res = await getAssinaturas(token);
        console.log("Resposta da API:", res.data);
        setAssinaturas(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar assinaturas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssinaturas();
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

  const sortedAssinaturas = [...assinaturas].sort(
    (a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime()
  );

  const filteredAssinaturas = useMemo(() => {
    return sortedAssinaturas.filter((assinatura) => {
      const matchesSearch =
        assinatura.id_assinatura?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assinatura.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assinatura.plano?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assinatura.box_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assinatura.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assinatura.data_inicio?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filtroStatus
        ? assinatura.status.toLowerCase() === filtroStatus.toLowerCase()
        : true;

        const matchesPedidos = filtroPlano
        ? assinatura.box_nome.toLowerCase() === filtroPlano.toLowerCase()
        : true;

      return matchesSearch && matchesStatus && matchesPedidos;
    });
  }, [sortedAssinaturas, searchTerm, filtroStatus, filtroPlano]);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const perPage = 10;

  const paginatedAssinaturas = useMemo(() => {
    return paginate(filteredAssinaturas, currentPage, perPage);
  }, [filteredAssinaturas, currentPage]);

  const totalPages = Math.ceil(filteredAssinaturas.length / perPage);

  if (loading) {
    return <p className="text-center text-brown-tertiary mt-20">Carregando assinaturas...</p>;
  }

  if (!assinaturas.length && !loading) {
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
                <option value="ativa">Ativa</option>
                <option value="pendente">Pendente</option>
                <option value="cancelada">Cancelada</option>
                <option value="pausada">Pausada</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-primary pointer-events-none" />
            </div>

            <div className="relative w-1/2 md:w-44">
              <select
                id="pedidos"
                name="pedidos"
                className="text-sm sm:text-base w-full appearance-none border px-2 py-3 rounded-md border border-brown-primary bg-beige-primary"
                value={filtroPlano}
                onChange={(e) => updateSearchParams("plano", e.target.value)}
              >
                <option value="">Box</option>
                <option value="estação do malte">Estação do Malte</option>
                <option value="mistério na caneca">Mistério na Caneca</option>
                <option value="mestre cervejeiro">Mestre Cervejeiro</option>
                <option value="frescor do malte">Frescor do Malte</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-primary pointer-events-none" />
            </div>
          </div>
        </div>

        <AssinaturasTable dados={paginatedAssinaturas} />

        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </DataCard>
    </div>
  );
}
