// services/pagamentos.ts
import api from "./api";

export async function criarPreferenciaPagamento(
  token: string,
  plano_id: "PLANO_MENSAL" | "PLANO_ANUAL", 
  box_id: string,
  endereco_entrega_id: string,
  valor_frete: number,
) {
  const response = await api.post(
    "/pagamentos/criar-preferencia",
    {
      plano_id, 
      box_id,
      endereco_entrega_id,
      valor_frete,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; 
}
