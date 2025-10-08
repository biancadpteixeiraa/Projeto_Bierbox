"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getBoxById } from "@/app/services/boxes";
import { calculoFrete } from "@/app/services/frete";
import { toast } from "react-toastify";

type CheckoutStep = "endereco" | "frete" | "resumo";

type Endereco = {
  id?: string;
  rua: string;
  cep: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  estado: string;
  is_padrao: boolean;
};

type Frete = {
  tipo: string;
  preco: string;
};

type CheckoutData = {
  boxId: string;
  plano: "mensal" | "anual";
  quantidade: 4 | 6;
};

interface CheckoutContextType {
  step: CheckoutStep;
  setStep: (step: CheckoutStep) => void;

  box: any;
  checkoutData: CheckoutData | null;
  endereco: Endereco;
  setEndereco: (data: Endereco) => void;
  frete: Frete;
  setFrete: (data: Frete) => void;

  calcularFrete: (cep: string) => Promise<void>;
  opcoesFrete: any[];
  loadingFrete: boolean;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState<CheckoutStep>("endereco");
  const [box, setBox] = useState<any>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [endereco, setEndereco] = useState<Endereco>({
    id: "",
    rua: "",
    cep: "",
    numero: "",
    bairro: "",
    complemento: "",
    cidade: "",
    estado: "",
    is_padrao: false,
  });
  const [frete, setFrete] = useState<Frete>({ tipo: "", preco: "" });

  const [loadingFrete, setLoadingFrete] = useState(false);
  const [opcoesFrete, setOpcoesFrete] = useState<any[]>([]);

    useEffect(() => {
    const syncCheckoutData = async () => {
        try {
        const saved = localStorage.getItem("checkoutData");
        if (saved) {
            const parsed: CheckoutData = JSON.parse(saved);

        if (!checkoutData || parsed.boxId !== checkoutData.boxId) {
            setCheckoutData(parsed);
            const res = await getBoxById(parsed.boxId);
            if (res.success) setBox(res.box);
            else toast.error("Erro ao carregar box.");
        }
        }
        } catch (err) {
        console.error("Erro ao sincronizar checkoutData:", err);
        toast.error("Erro ao carregar dados do checkout.");
        }
    };

    syncCheckoutData();
    }, []);


  const calcularFrete = async (cep: string) => {
    if (!cep) {
      toast.warning("Informe um CEP válido.");
      return;
    }
    try {
      setLoadingFrete(true);
      const data = await calculoFrete(cep);
      if (data.success) {
        setOpcoesFrete(data.opcoes);
      } else {
        toast.error(data.message || "Erro ao calcular frete.");
        setOpcoesFrete([]);
      }
    } catch (err) {
      toast.error("Erro ao calcular frete.");
      console.error(err);
      setOpcoesFrete([]);
    } finally {
      setLoadingFrete(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        step,
        setStep,
        box,
        checkoutData,
        endereco,
        setEndereco,
        frete,
        setFrete,
        calcularFrete,
        opcoesFrete,
        loadingFrete,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout deve ser usado dentro de CheckoutProvider");
  return context;
};
