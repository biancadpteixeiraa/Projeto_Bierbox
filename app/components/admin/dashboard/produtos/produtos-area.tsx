"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DataCard from "@/app/components/ui/data-card";
import { paginate } from "@/app/lib/utils";
import { Search } from "lucide-react";
import Input from "@/app/components/ui/input";
import Pagination from "@/app/components/ui/pagination";
import useDebounce from "@/app/hooks/hooks";
import ProdutosTable from "../../tables/produtos/produtos";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { getBoxes } from "@/app/services/admin";

type Produtos = {
    id: string;
    nome: string;
    imagem_principal_url: string;
    preco_mensal_4_un: number;
    preco_anual_4_un: number;
    ativo: boolean;
};

export default function ProdutosArea() {
  const { token } = useAdminAuth();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [loading, setLoading] = useState(false);

  const searchTerm = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 350);

  useEffect(() => {
    if (!token) return;

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const res = await getBoxes(token);
        console.log("Resposta da API:", res.data);
        setProdutos(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
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

  const filteredBox = useMemo(() => {
    return produtos.filter((box) => {
      const matchesSearch =
        box.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.preco_anual_4_un.toString().includes(searchTerm) ||
        box.preco_mensal_4_un.toString().includes(searchTerm)


      return matchesSearch;
    });
  }, [produtos, searchTerm]);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const perPage = 10;

  const paginatedBox = useMemo(() => {
    return paginate(filteredBox, currentPage, perPage);
  }, [filteredBox, currentPage]);

  const totalPages = Math.ceil(filteredBox.length / perPage);

  if (loading) {
    return <p className="text-center text-brown-tertiary mt-20">Carregando produtos...</p>;
  }

  if (!produtos.length && !loading) {
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

        <ProdutosTable dados={paginatedBox} />

        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </DataCard>
    </div>
  );
}
