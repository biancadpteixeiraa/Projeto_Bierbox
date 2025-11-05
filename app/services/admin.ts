import api from "./api";

export async function getEstatisticasDash(token: string) {
  const response = await api.get("/api/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getBoxes(token: string) {
    const response = await api.get("/api/admin/boxes", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getBoxDetalhes(token: string, boxId: string) {
    const response = await api.get(`/api/admin/boxes/${boxId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getUsuarios(token: string) {
    const response = await api.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getUsuarioDetalhes(token: string, userId: string) {
    const response = await api.get(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getPedidos(token: string) {
    const response = await api.get("/api/admin/pedidos", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getPedidoDetalhes(token: string, pedidoId: string) {
    const response = await api.get(`/api/admin/pedidos/${pedidoId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getAssinaturas(token: string) {
    const response = await api.get("/api/admin/assinaturas", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function getAssinaturaDetalhes(token: string, assinaturaId: string) {
    const response = await api.get(`/api/admin/assinaturas/${assinaturaId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}