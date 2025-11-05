export async function buscarEnderecoPorCep(cep: string) {
  const cepLimpo = cep.replace(/\D/g, ""); // remove pontos e traços
  if (cepLimpo.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) return null;

    return {
      rua: data.logradouro || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      estado: data.uf || "",
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
}
