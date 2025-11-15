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

export async function addBox(token: string, payload: any) {
  const response = await api.post(
    `/api/admin/boxes/`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  return response.data;
}

export async function updateBox(token: string, boxId: string, payload: any) {
  const response = await api.put(
    `/api/admin/boxes/${boxId}`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  return response.data;
}

export async function deleteBox(token: string, boxId: string) {
    const response = await api.delete(`/api/admin/boxes/${boxId}`, {
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

export async function updateUsuario(token: string, userId: string, nome_completo: string, email: string, role: string, ativo: boolean){
    const response = await api.put(`/api/admin/users/${userId}`, 
        {nome_completo, email, role, ativo},
        {headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function deleteUsuario(token: string, userId: string) {
    const response = await api.delete(`/api/admin/users/${userId}`, {
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

export async function updatePedido(token: string, pedidoId: string, status_pedido: string, codigo_rastreio: string){
    const response = await api.put(`/api/admin/pedidos/${pedidoId}`, 
        {status_pedido, codigo_rastreio},
        { headers: { Authorization: `Bearer ${token}` },
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
    const response = await api.get(`/api/admin/assinaturas/${assinaturaId}`, 
        {headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function cancelarAssinatura(token: string, assinaturaId: string,){
    const response = await api.put(`/api/admin/assinaturas/${assinaturaId}/cancelar`, 
        {},
        { headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function pausarAssinatura(token: string, assinaturaId: string,){
    const response = await api.put(`/api/admin/assinaturas/${assinaturaId}/pausar`, 
        {},
        { headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function reativarAssinatura(token: string, assinaturaId: string,){
    const response = await api.put(`/api/admin/assinaturas/${assinaturaId}/reativar`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}


