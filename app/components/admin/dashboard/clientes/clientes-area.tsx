"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DataCard from "@/app/components/ui/data-card";
import { paginate } from "@/app/lib/utils";
import { Search } from "lucide-react";
import Input from "@/app/components/ui/input";
import Pagination from "@/app/components/ui/pagination";
import useDebounce from "@/app/hooks/hooks";
import ClienteTable from "../../tables/clientes/clientes";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { getUsuarios } from "@/app/services/admin";

type Cliente = {
  id: string;
  nome_completo: string;
  email: string;
  data_criacao: string;
  role: string;
  ativo: boolean
}

export default function ClientesArea() {
  const { token } = useAdminAuth();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  const searchTerm = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 350);

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
    if (!token) return;

    const fetchClientes = async () => {
      try {
        setLoading(true);
        const res = await getUsuarios(token);
        console.log("Resposta da API:", res.data);
        setClientes(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [token]);

  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
      updateSearchParams("search", debouncedSearch.trim());
    }
  }, [debouncedSearch]);

  const sortedClientes = [...clientes].sort(
    (a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
  );

  const filteredClientes = useMemo(() => {
    return sortedClientes.filter((assinatura) => {
      const matchesSearch =
        assinatura.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assinatura.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assinatura.data_criacao.toLowerCase().includes(searchTerm.toLowerCase());


      return matchesSearch;
    });
  }, [sortedClientes, searchTerm]);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const perPage = 10;

  const paginatedClientes = useMemo(() => {
    return paginate(filteredClientes, currentPage, perPage);
  }, [filteredClientes, currentPage]);

  const totalPages = Math.ceil(filteredClientes.length / perPage);

  if (loading) {
    return <p className="text-center text-brown-tertiary mt-20">Carregando assinaturas...</p>;
  }

  if (!clientes.length && !loading) {
    return <p className="text-center text-brown-tertiary mt-20">Nenhum dado disponível</p>;
  }

  return (
    <div className="w-full h-full pt-8 md:pr-10">
      <DataCard className="w-full p-5">
        <div className="flex items-center w-full mb-3">
          <div className="w-full relative">
            <Input
              className="w-full rounded-md border border-brown-primary pl-8 text-brown-primary placeholder:text-brown-primary"
              placeholder="Buscar"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-primary pointer-events-none" />
          </div>
        </div>

        <ClienteTable dados={paginatedClientes} />

        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </DataCard>
    </div>
  );
}
