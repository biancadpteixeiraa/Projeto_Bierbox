"use client";
import { createContext, useContext, useState } from "react";
import { addToCarrinho, getCarrinho, removeFromCarrinho } from "../services/shoppingCart";
import { useAuth } from "./authContext";

interface CartItem {
  id: number;
  nome: string;
  preco_unitario: string;
  imageSrc: string;
  quantidade: number;
}

interface Carrinho {
  items: CartItem[];
  total?: number;
}

interface CarrinhoContextProps {
  carrinho: Carrinho | null;
  loadCarrinho: () => Promise<void>;
  addItem: (box_id: number, quantidade: number) => Promise<void>;
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

  const addItem = async (box_id: number, quantidade: number) => {
    if (!token) return;
    const data = await addToCarrinho(token, box_id, quantidade);
    if (data.success) setCarrinho(data.carrinho);
  };

  const removeItem = async (box_id: number) => {
    if (!token) return;
    const data = await removeFromCarrinho(token, box_id);
    if (data.success) setCarrinho(data.carrinho);
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
