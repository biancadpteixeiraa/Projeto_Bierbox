"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { addToCarrinho, getCarrinho, removeFromCarrinho } from "../services/shoppingCart";
import { useAuth } from "./authContext";

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
    const data = await getCarrinho(token);
    if (data.success) setCarrinho(data.carrinho);
  };

  useEffect(() => {
    if (!token) {
      setCarrinho(null);
      return;
    }
    loadCarrinho();
  }, [token]);

  const addItem = async (box_id: number, quantidade: number, tipo_plano: 'mensal'|'anual') => {
    console.log(token);
    console.log(box_id, quantidade, tipo_plano);
    if (!token) return;
    const data = await addToCarrinho(token, box_id, quantidade, tipo_plano);
    console.log(data);
    if (data.success) {
      setCarrinho(data.carrinho);
      alert("Item adicionado ao carrinho!");
    } else {
      alert("Erro ao adicionar item ao carrinho: " + data.message);
    }
  };

  const removeItem = async (box_id: number) => {
    if (!token) return;
    const data = await removeFromCarrinho(token, box_id);
    if (data.success) setCarrinho(data.carrinho);
    alert("Item removido do carrinho com sucesso!");
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
