import api from "./api";


// Buscar dados do perfil do usuário logado
export async function getUserInfo(token: string) {
  const response = await api.get("/meu-perfil", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = response.data;
  
  return data;
}


interface UpdateUserPayload {
  nome_completo?: string;
  senha_atual?: string;
  nova_senha?: string;
}

export async function updateUserInfo(token: string, data: UpdateUserPayload) {
  const response = await api.put("/meu-perfil", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Upload de foto de perfil
export async function updateUserPhoto(token: string, file: File) {
  const formData = new FormData();
  formData.append("profilePhoto", file);

  const response = await api.post("/meu-perfil/upload-foto", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}


// Excluir conta do usuário logado
export async function deleteUserAccount(token: string) {
  const response = await api.delete("/meu-perfil", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

