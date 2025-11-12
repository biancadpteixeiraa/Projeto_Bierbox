import api from "./api";

export async function getAssinaturas(token: string) {
  const response = await api.get("/api/assinaturas", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getAssinaturaDetalhes(token: string, id: string) {
  const response = await api.get(`/api/assinaturas/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function cancelarAssinatura(token: string, id: string) {
  const response = await api.post(
    `/api/assinaturas/${id}/cancelar`,
    {},
    { headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data;
}

export async function updateEnderecoAssinatura(token: string, id: string, novo_endereco_id: string) {
  const response = await api.put(
    `/api/assinaturas/${id}/alterar-endereco`,
    { novo_endereco_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function addAssinatura(token: string, box_id: number, tipo_plano: 'mensal' | 'anual', endereco_id: number) {
  const response = await api.post(
    "/api/assinaturas",
    { box_id, tipo_plano, endereco_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function finalizarAssinaturaPendente(token: string, id: string) {
  const response = await api.post(
    `/api/assinaturas/${id}/finalizar-pagamento`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}