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

export async function addBox(token: string, nome: string, descricao_curta: string, descricao_longa: string, especificacao: string, preco_mensal_4_un: number, preco_anual_4_un: number, preco_mensal_6_un: number, preco_anual_6_un: number, ativo: boolean, imagem_principal_url: string) {
    const response = await api.post("/api/admin/boxes", 
        {  nome, descricao_curta, descricao_longa, especificacao, preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un, ativo, imagem_principal_url},
        {headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}

export async function updateBox(token: string, nome: string, descricao_curta: string, descricao_longa: string, especificacao: string, preco_mensal_4_un: number, preco_anual_4_un: number, preco_mensal_6_un: number, preco_anual_6_un: number, ativo: boolean, imagem_principal_url: string) {
    const response = await api.put("/api/admin/boxes", 
        {  nome, descricao_curta, descricao_longa, especificacao, preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un, ativo, imagem_principal_url},
        {headers: { Authorization: `Bearer ${token}` },
    });
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
    const response = await api.get(`/api/admin/assinaturas/${assinaturaId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}