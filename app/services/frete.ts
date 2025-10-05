import api from "./api";

export async function calculoFrete(cep_destino: string) {
  const response = await api.post(
    "/frete/calcular",
    { cep_destino },
  );
  return response.data;
}