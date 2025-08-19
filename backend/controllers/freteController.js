const axios = require("axios");

// Calcula o frete usando a API 
const calcularFrete = async (req, res) => {
  try {
    const { cep_destino } = req.body;

    if (!cep_destino) {
      return res.status(400).json({
        success: false,
        message: "CEP de destino é obrigatório",
      });
    }

    // Configuração dos dados para enviar
    const dadosParaCalcular = {
      from: {
        postal_code: "85055270",
      },
      to: {
        postal_code: cep_destino.replace(/\D/g, ""), 
      },
      products: [
        {
          id: "1",
          width: 30, // Largura da caixa em cm
          height: 15, // Altura da caixa em cm
          length: 40, // Comprimento da caixa em cm
          weight: 2, // Peso em kg 
          insurance_value: 50, // Valor do seguro (valor médio de uma box)
          quantity: 1,
        },
      ],
    };

    // Configuração para autenticação
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        "User-Agent": "BierBox (biancadpteixeira@gmail.com)", 
      },
    };

    // requisição para a API
    const response = await axios.post(
      "https://melhorenvio.com.br/api/v2/me/shipment/calculate",
      dadosParaCalcular,
      config
     );

    // Processa a resposta, filtra por PAC, SEDEX e Jadlog .Com, e envia de volta para o frontend
    const opcoesFrete = response.data
      .filter(opcao => 
        (opcao.name === "PAC" && opcao.company.name === "Correios") || 
        (opcao.name === "SEDEX" && opcao.company.name === "Correios") || 
        (opcao.name === ".Com" && opcao.company.name === "Jadlog")
      )
      .map(opcao => ({
        nome: opcao.name,
        preco: opcao.price,
        prazo: opcao.delivery_time,
        empresa: opcao.company.name
      }));


    res.json({
      success: true,
      opcoes: opcoesFrete,
    });
  } catch (error) {
    console.error("Erro ao calcular frete:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao calcular frete",
      erro: error.response?.data || error.message,
    });
  }
};

module.exports = {
  calcularFrete,
};
