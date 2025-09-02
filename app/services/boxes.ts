import api from "./api";

export async function getBoxes() {
  const response = await api.get("/boxes");
  return response.data;
}

export async function getBoxById(id: number) {
  const response = await api.get(`/boxes/${id}`);
  return response.data;
}