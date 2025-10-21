"use client";

import CheckoutCard from "../../ui/checkout-card";
import Button from "../../ui/button";
import { useAuth } from "@/app/context/authContext";
import { toast } from "react-toastify";
import { criarPreferenciaPagamento } from "@/app/services/checkout";
import { useCheckout } from "@/app/context/checkoutContext";
import { useState } from "react";


export default function ResumoFinanceiro() {
  const { token } = useAuth();
  const { formData, checkoutData, box, loading, step } = useCheckout();
  const disabled = step !== "resumo";

  const plano = checkoutData?.plano;
  const quantidade = checkoutData?.quantidade;
  const [loadingPagamento, setLoadingPagamento] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando resumo...</p>
      </div>
    );
  }

  if (!box || !checkoutData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Dados do checkout não encontrados.</p>
      </div>
    );
  }

  // Determina o preço da box conforme o plano e quantidade
  let valorBox = 0;
  if (plano === "mensal" && quantidade === 4) valorBox = parseFloat(box?.preco_mensal_4_un);
  if (plano === "mensal" && quantidade === 6) valorBox = parseFloat(box?.preco_mensal_6_un);
  if (plano === "anual" && quantidade === 4) valorBox = parseFloat(box?.preco_anual_4_un);
  if (plano === "anual" && quantidade === 6) valorBox = parseFloat(box?.preco_anual_6_un);

  const valorFrete = parseFloat(formData.frete.preco) || 0;
  const total = valorBox + valorFrete;

  const handleFinalizarPagamento = async () => {
    if (!token || !checkoutData) return;

    if (!formData.endereco.id) {
      toast.error("Por favor, salve o endereço antes de finalizar o pagamento.");
      return;
    }

    try {
      setLoadingPagamento(true);

      const planoIdApi = plano === "mensal" ? "PLANO_MENSAL" : "PLANO_ANUAL";

      const res = await criarPreferenciaPagamento(
        token,
        planoIdApi,
        checkoutData.boxId,
        formData.endereco.id,
        valorFrete
      );

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        toast.error("URL de checkout não recebida.");
      }
    } catch (error) {
      console.error("Erro ao criar preferência de pagamento:", error);
      toast.error("Não foi possível finalizar a compra. Tente novamente.");
    } finally {
      setLoadingPagamento(false);
    }
  };

  return (
    <div>
      <h1 className="hidden lg:block font-secondary text-brown-tertiary font-bold text-lg pb-5">
        Resumo Financeiro
      </h1>
      <CheckoutCard disabled={disabled} className="h-[440px] justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <img src={box?.imagens[2]} alt="imagem da box" 
            className="size-24 rounded-lg object-cover"/>
            <div className="flex flex-col items-start gap-2 pt-2">
              <h2 className="text-brown-tertiary font-bold text-xl text-nowrap">{box?.nome}</h2>
              <span className="bg-yellow-secondary text-white px-4 rounded-md text-nowrap">Plano {plano}</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-6">
            <h3 className="text-black font-semibold text-lg">Resumo Financeiro</h3>
            <div className="flex flex-col w-full text-brown-tertiary font-semibold gap-1">
              <div className="flex items-center justify-between">
                <p>Valor da Box:</p>
                <p>R$ {valorBox.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Valor do Frete:</p>
                <p>R$ {valorFrete.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Valor Total:</p>
                <p>R$ {total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="quaternary"
          disabled={disabled || loadingPagamento}
          className="py-2 flex items-center justify-center font-medium"
          onClick={handleFinalizarPagamento}
        >
          {loadingPagamento ? (
            <span className="animate-spin rounded-full border-4 border-beige-primary border-t-transparent w-5 h-5"></span>
          ) : (
            "Finalizar Pagamento"
          )}
        </Button>
      </CheckoutCard>
    </div>
  );
}
