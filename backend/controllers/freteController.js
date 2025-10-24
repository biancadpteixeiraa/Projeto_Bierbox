const axios = require("axios");

const calcularFrete = async (req, res) => {
  try {
    const { cep_destino } = req.body;

    if (!cep_destino) {
      return res.status(400).json({
        success: false,
        message: "CEP de destino é obrigatório",
      });
    }

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
          width: 30, 
          height: 15, 
          length: 40, 
          weight: 2, 
          insurance_value: 50,
          quantity: 1,
        },
      ],
    };

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        "User-Agent": "BierBox (biancadpteixeira@gmail.com)", 
      },
    };

    const response = await axios.post(
      "https://melhorenvio.com.br/api/v2/me/shipment/calculate",
      dadosParaCalcular,
      config
     );

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
