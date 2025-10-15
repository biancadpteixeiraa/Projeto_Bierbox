"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { addToCarrinho, getCarrinho, removeFromCarrinho } from "../services/shoppingCart";
import { useAuth } from "./authContext";
import { toast } from "react-toastify";

interface CartItem {
  id: string;
  box_id: string;
  nome: string;
  tipo_plano: string;
  preco_unitario: string;
  imagem_principal_url: string;
  quantidade: number;
}

interface Carrinho {
  itens: CartItem[];
  total?: number;
}

interface CarrinhoContextProps {
  carrinho: Carrinho | null;
  loadCarrinho: () => Promise<void>;
  addItem: (box_id: string, quantidade: number, tipo_plano: 'mensal'|'anual') => Promise<void>;
  removeItem: (box_id: string) => Promise<void>;
  loading: boolean;
}

const CarrinhoContext = createContext<CarrinhoContextProps | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
  const [loading, setLoading] = useState(true); 

  const loadCarrinho = async () => {
    if (!token) {
      setCarrinho(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getCarrinho(token);
      if (data.success) {
        setCarrinho(data.carrinho);
      } else {
        toast.error(data.message || "Erro ao carregar carrinho!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao carregar carrinho!");
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarrinho();
  }, [token]);

  const addItem = async (box_id: string, quantidade: number, tipo_plano: 'mensal'|'anual') => {
  if (!token) return;

  const itemExistente = carrinho?.itens.find(
    (item) => item.box_id === box_id
  );

  if (itemExistente) {
    toast.warning("Essa Box já está no seu carrinho!");
    return;
  }

  try {
    const data = await addToCarrinho(token, box_id, quantidade, tipo_plano);
    if (data.success) {
      setCarrinho(data.carrinho);
      toast.success("Box adicionada ao carrinho!");
    } else {
      toast.error(data.message || "Erro ao adicionar Box ao carrinho!");
      console.error("Erro ao adicionar Box ao carrinho:", data.message);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro inesperado ao adicionar Box!");
  }
};


  const removeItem = async (box_id: string) => {
    if (!token) return;
    const data = await removeFromCarrinho(token, box_id);
    if (data.success){
      setCarrinho(data.carrinho)
      toast.success("Box removida do carrinho com sucesso!")
    } else {
      toast.error("Erro ao remover Box do carrinho!")
      console.error("Erro ao remover Box do carrinho: " + data.message);
    }
  };

  return (
    <CarrinhoContext.Provider value={{ carrinho, loadCarrinho, addItem, removeItem, loading }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho must be used within a CarrinhoProvider");
  }
  return context;
}
