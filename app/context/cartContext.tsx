"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { addToCarrinho, getCarrinho, removeFromCarrinho } from "../services/shoppingCart";
import { useAuth } from "./authContext";
import { toast } from "react-toastify";

interface CartItem {
  id: number;
  box_id: number;
  nome: string;
  preco_unitario: string;
  imageSrc: string;
  quantidade: number;
}

interface Carrinho {
  itens: CartItem[];
  total?: number;
}

interface CarrinhoContextProps {
  carrinho: Carrinho | null;
  loadCarrinho: () => Promise<void>;
  addItem: (box_id: number, quantidade: number, tipo_plano: 'mensal'|'anual') => Promise<void>;
  removeItem: (box_id: number) => Promise<void>;
}

const CarrinhoContext = createContext<CarrinhoContextProps | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [carrinho, setCarrinho] = useState<Carrinho | null>(null);

  const loadCarrinho = async () => {
  if (!token) return;
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
  }
};

  useEffect(() => {
    if (!token) {
      setCarrinho(null);
      return;
    }
    loadCarrinho();
  }, [token]);

  const addItem = async (box_id: number, quantidade: number, tipo_plano: 'mensal'|'anual') => {
  if (!token) return;

  const itemExistente = carrinho?.itens.find(
    (item) => item.box_id === box_id
  );

  if (itemExistente) {
    toast.warning("Esse item já está no seu carrinho!");
    return;
  }

  try {
    const data = await addToCarrinho(token, box_id, quantidade, tipo_plano);
    if (data.success) {
      setCarrinho(data.carrinho);
      toast.success("Item adicionado ao carrinho!");
    } else {
      toast.error(data.message || "Erro ao adicionar item ao carrinho!");
      console.error("Erro ao adicionar item ao carrinho:", data.message);
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro inesperado ao adicionar item!");
  }
};


  const removeItem = async (box_id: number) => {
    if (!token) return;
    const data = await removeFromCarrinho(token, box_id);
    if (data.success){
      setCarrinho(data.carrinho)
      toast.success("Item removido do carrinho com sucesso!")
    } else {
      toast.error("Erro ao remover item do carrinho!")
      console.error("Erro ao remover item do carrinho: " + data.message);
    }
  };

  return (
    <CarrinhoContext.Provider value={{ carrinho, loadCarrinho, addItem, removeItem }}>
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
