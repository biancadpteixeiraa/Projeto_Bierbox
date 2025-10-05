import api from "./api";

export async function getBoxes() {
  console.log("BaseURL:", api.defaults.baseURL);
  const response = await api.get("/boxes");
  return response.data;
}

export async function getBoxById(id: string) {
  const response = await api.get(`/boxes/${id}`);
  return response.data;
}
