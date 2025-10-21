"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getBoxById } from "@/app/services/boxes";

type Step = "endereco" | "frete" | "resumo";

type FormData = {
  endereco: {
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
  frete: {
    tipo: string;
    preco: string;
  };
};

type CheckoutData = {
  boxId: string;
  plano: "mensal" | "anual";
  quantidade: 4 | 6;
};

interface CheckoutContextProps {
  step: Step;
  setStep: (s: Step) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  checkoutData: CheckoutData | null;
  setCheckoutData: React.Dispatch<React.SetStateAction<CheckoutData | null>>;
  box: any;
  loading: boolean;
  handleEdit: (targetStep: Step) => void;
  clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<Step>("endereco");
  const [formData, setFormData] = useState<FormData>({
    endereco: {
      id: "",
      rua: "",
      cep: "",
      numero: "",
      bairro: "",
      complemento: "",
      cidade: "",
      estado: "",
      is_padrao: false,
    },
    frete: { tipo: "", preco: "" },
  });

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [box, setBox] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleEdit = (targetStep: Step) => setStep(targetStep);

  useEffect(() => {
    const saved = sessionStorage.getItem("checkoutData");
    if (saved) {
      setCheckoutData(JSON.parse(saved));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (checkoutData) {
      sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    }
  }, [checkoutData]);

  useEffect(() => {
    if (!checkoutData) {
      setBox(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getBoxById(checkoutData.boxId)
      .then((res) => { if (res.success) setBox(res.box); })
      .catch(() => setBox(null))
      .finally(() => setLoading(false));

  }, [checkoutData]);

  const clearCheckout = () => {
    sessionStorage.removeItem("checkoutData");
    setCheckoutData(null);
    setBox(null);
    setStep("endereco");
    setFormData({
      endereco: {
        id: "",
        rua: "",
        cep: "",
        numero: "",
        bairro: "",
        complemento: "",
        cidade: "",
        estado: "",
        is_padrao: false,
      },
      frete: { tipo: "", preco: "" },
    });
  };

  return (
    <CheckoutContext.Provider
      value={{
        step,
        setStep,
        formData,
        setFormData,
        checkoutData,
        setCheckoutData,
        box,
        loading,
        handleEdit,
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout deve ser usado dentro de CheckoutProvider");
  return context;
}
