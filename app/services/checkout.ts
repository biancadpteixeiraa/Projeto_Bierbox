// services/pagamentos.ts
import api from "./api";

export async function criarPreferenciaPagamento(
  token: string,
  plano_id: "PLANO_MENSAL" | "PLANO_ANUAL", 
  box_id: string,
  endereco_entrega_id: string,
  valor_frete: number,
  quantidade_cervejas: number,
) {
  const response = await api.post(
    "/api/stripe/checkout",
    {
      plano_id, 
      endereco_entrega_id,
      valor_frete,
      box_id,
      quantidade_cervejas,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; 
}
