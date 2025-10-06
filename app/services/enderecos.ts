import api from "./api";

export async function getEnderecos(token: string) {
  const response = await api.get("/api/enderecos", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function addEndereco(token: string, cep: string, rua: string, numero: string, bairro: string, complemento: string, cidade: string, estado: string, is_padrao: boolean) {
  const response = await api.post(
    "/api/enderecos",
    { cep, rua, numero, bairro, complemento, cidade, estado, is_padrao },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function updateEndereco(token: string, id: string, cep: string, rua: string, numero: string, bairro: string, complemento: string, cidade: string, estado: string, is_padrao: boolean) {
  const response = await api.put(
    `/api/enderecos/${id}`,
    { cep, rua, numero, bairro, complemento, cidade, estado, is_padrao },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function deleteEndereco(token: string, id: string) {
  const response = await api.delete(`/api/enderecos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}