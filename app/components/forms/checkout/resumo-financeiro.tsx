"use client";

import CheckoutCard from "../../ui/checkout-card";
import Button from "../../ui/button";
import { useAuth } from "@/app/context/authContext";
import { toast } from "react-toastify";
import { criarPreferenciaPagamento } from "@/app/services/checkout";

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

export default function ResumoFinanceiro({
  data,
  disabled,
  box,
  checkoutData,
}: {
  data: FormData;
  disabled?: boolean;
  box: any;
  checkoutData: CheckoutData | null;
}) {
  const { token } = useAuth();
  const plano = checkoutData?.plano;
  const quantidade = checkoutData?.quantidade;

  let valorBox = 0;
  if (plano === "mensal" && quantidade === 4) valorBox = parseFloat(box?.preco_mensal_4_un);
  if (plano === "mensal" && quantidade === 6) valorBox = parseFloat(box?.preco_mensal_6_un);
  if (plano === "anual" && quantidade === 4) valorBox = parseFloat(box?.preco_anual_4_un);
  if (plano === "anual" && quantidade === 6) valorBox = parseFloat(box?.preco_anual_6_un);

  const valorFrete = parseFloat(data.frete.preco) || 0;

  const total = valorBox + (parseFloat(data.frete.preco) || 0);

  const handleFinalizarPagamento = async () => {
    if (disabled || !token || !checkoutData) return;

    if(!data.endereco.id){
      toast.error("Por favor, salve o endereço antes de finalizar o pagamento.");
      return;
    }

    try {
    const planoIdApi = plano === "mensal" ? "PLANO_MENSAL" : "PLANO_ANUAL";

    const payload = {
      plano_id: planoIdApi,
      box_id: checkoutData.boxId,
      endereco_entrega_id: data.endereco.id,
      valor_frete: valorFrete,
    };

    const res = await criarPreferenciaPagamento(
      token,
      planoIdApi,
      checkoutData.boxId,
      data.endereco.id,
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
    }
  }

  if (!box) {
    return <p className="text-center text-sm text-brown-tertiary py-10">Carregando resumo...</p>;
  }

  return (
    <div>
      <h1 className="hidden lg:block font-secondary text-brown-tertiary font-bold text-lg pb-5">
        Resumo Financeiro
      </h1>
      <CheckoutCard className="h-[440px] justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <img src={box?.imagens[2]} alt="imagem da box" 
            className="size-24 rounded-lg"/>
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
                <p>{data.frete.tipo} - R$ {valorFrete.toFixed(2)}</p>
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
          disabled={disabled}
          className="py-2 justify-end font-medium"
          onClick={handleFinalizarPagamento}
        >
          Finalizar Pagamento
        </Button>
      </CheckoutCard>
    </div>
  );
}
