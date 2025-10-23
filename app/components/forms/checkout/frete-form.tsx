"use client";

import CheckoutCard from "../../ui/checkout-card";
import Button from "../../ui/button";
import { IMaskInput } from 'react-imask';
import { toast } from "react-toastify";
import { calculoFrete } from "@/app/services/frete";
import { useEffect, useState } from "react";
import { useCheckout } from "@/app/context/checkoutContext";

type FreteOpcao = {
  nome: string;
  empresa: string;
  prazo: string;
  preco: string;
};

export default function FreteForm() {
  const { step, setStep, formData, setFormData, handleEdit } = useCheckout();

  const data = formData.frete;
  const cep = formData.endereco?.cep || "";
  const disabled = step !== "frete";

  const [isLoading, setIsLoading] = useState(false);
  const [frete, setFrete] = useState<FreteOpcao[]>([]);

  useEffect(() => {
    if (cep && cep.length === 9) handleCalcularFrete();
  }, [cep]);

  const handleCalcularFrete = async () => {
    if (!cep) {
      toast.warning("Digite um CEP válido.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await calculoFrete(cep);
      if (result.success) {
        setFrete(result.opcoes);
      } else {
        toast.error(result.message || "Erro ao calcular frete.");
        setFrete([]);
      }
    } catch (error) {
      toast.error("Erro ao calcular frete.");
      console.error(error);
      setFrete([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFrete = (opcao: FreteOpcao) => {
    setFormData((prev) => ({
      ...prev,
      frete: { tipo: opcao.nome, preco: opcao.preco },
    }));
  };

  const handleNext = () => {
    if (!data.tipo) {
      toast.warning("Selecione uma opção de frete.");
      return;
    }
    setStep("resumo");
  };


  return (
    <div>
      <div className="w-full hidden lg:flex items-center justify-between pb-5 ">
        <h1 className="hidden lg:block font-secondary text-brown-tertiary font-bold text-lg">
          Frete
        </h1>
        <button
          onClick={() => handleEdit("frete")}
          className={`
          ${disabled ? "block" : 'hidden'} 
          text-xs text-brown-tertiary underline underline-offset-2`}
          >
          Editar
        </button>
      </div>
      <CheckoutCard disabled={disabled} className="h-[440px] justify-between">
        <div className="flex flex-col gap-8 pb-14">
            <div className="flex flex-col items-start justify-center">
              <label htmlFor="cepFrete" className="text-brown-tertiary font-semibold">Informe seu CEP:</label>
              <IMaskInput
                  mask="00000-000"
                  type="text"
                  disabled
                  readOnly
                  className="text-xs sm:text-sm w-full py-2 px-3 bg-transparent text-brown-tertiary/75 placeholder:text-brown-tertiary/75 rounded-lg border border-brown-tertiary"
                  placeholder="CEP"
                  value={cep}
                  id="cepFrete"
                />
            </div>
            {isLoading && (
              <p className="text-sm text-brown-tertiary">Calculando opções de frete...</p>
            )}
            {!isLoading && frete.length === 0 && (
              <div>
                <p className="text-sm text-brown-tertiary">Nenhuma opção de frete calculada.</p>
              </div>
            )}
            {!isLoading && frete.length > 0 && (
              <div className="flex flex-col gap-3">
                {frete.map((opcao) => {
                  const isUnavailable =
                    !opcao.preco || opcao.preco.toLowerCase() === "indisponível";
                  return (
                    <div
                      key={opcao.nome}
                      className={`flex items-center p-3 text-brown-tertiary rounded-lg shadow-[0px_2px_14px_0px_rgb(0,0,0,0.1)]
                        ${isUnavailable ? "opacity-60 cursor-not-allowed" : "cursor-default hover:bg-beige-primary/30 transition-colors"}
                      `}
                    >
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            name="frete"
                            value={opcao.nome}
                            checked={data.tipo === opcao.nome}
                            onChange={() => handleSelectFrete(opcao)}
                            disabled={disabled || isLoading || isUnavailable}
                            className={`
                            size-4 appearance-none rounded-full border border-brown-tertiary checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white
                            ${isUnavailable ? "cursor-not-allowed" : "cursor-pointer"}`}
                          />
                          <div className="flex flex-col items-start">
                            <h2 className="font-primary text-[10px]">
                              {opcao.nome} ({opcao.empresa})
                            </h2>
                            <p className="text-[10px] font-medium">
                              Até {opcao.prazo || "-"} dias úteis
                            </p>
                          </div>
                        </div>
                        <div>
                          {isUnavailable ? (
                            <p className="text-[10px] font-bold text-gray-500">Indisponível</p>
                          ) : (
                            <p className="text-[10px] font-bold">
                              R$ {opcao.preco}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
        <Button
          variant="quaternary"
          onClick={handleNext}
          disabled={disabled || !data.tipo}
          className="py-2 font-medium"
        >
          Avançar
        </Button>
      </CheckoutCard>
    </div>
  );
}
