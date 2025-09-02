import api from "./api";

export async function getCarrinho(token: string) {
  const response = await api.get("/carrinho", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function addToCarrinho(token: string, box_id: number, quantidade: number) {
  const response = await api.post(
    "/carrinho/adicionar",
    { box_id, quantidade },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function removeFromCarrinho(token: string, box_id: number) {
  const response = await api.delete(`/carrinho/remover/${box_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}