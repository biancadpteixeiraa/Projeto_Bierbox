

export async function getInstagramPhotos() {
  const res = await fetch("/api/instagram");
  if (!res.ok) throw new Error("Erro ao carregar fotos do Instagram");
  return res.json();
}
