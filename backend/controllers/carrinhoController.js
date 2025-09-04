const pool = require("../config/db");

const getCarrinhoCompleto = async (usuario_id) => {
  const carrinhoResult = await pool.query(
    "SELECT id, usuario_id FROM carrinhos WHERE usuario_id = $1",
    [usuario_id]
  );

  if (carrinhoResult.rows.length === 0) {
    return null; 
  }

  const carrinho = carrinhoResult.rows[0];

  const itensDoCarrinho = await pool.query(
    `SELECT
       ci.id,
       ci.box_id,
       b.nome,
       b.imagem_principal_url,
       ci.quantidade_cervejas AS quantidade,
       ci.tipo_plano,
       ci.preco_unitario
     FROM carrinho_itens ci
     JOIN boxes b ON ci.box_id = b.id
     WHERE ci.carrinho_id = $1
     ORDER BY ci.data_adicao ASC`,
    [carrinho.id]
  );

  const total_itens = itensDoCarrinho.rows.length;

  return {
    id: carrinho.id,
    usuario_id: carrinho.usuario_id,
    total_itens: total_itens,
    itens: itensDoCarrinho.rows,
  };
};

// @desc    Adicionar um item ao carrinho
// @route   POST /carrinho/adicionar
// @access  Privado
const adicionarItem = async (req, res) => {
  const { box_id, quantidade, tipo_plano } = req.body;
  const usuario_id = req.userId;

  try {
    let carrinhoResult = await pool.query(
      "SELECT id FROM carrinhos WHERE usuario_id = $1",
      [usuario_id]
    );
    let carrinho_id;

    if (carrinhoResult.rows.length === 0) {
      const novoCarrinho = await pool.query(
        "INSERT INTO carrinhos (usuario_id) VALUES ($1) RETURNING id",
        [usuario_id]
      );
      carrinho_id = novoCarrinho.rows[0].id;
    } else {
      carrinho_id = carrinhoResult.rows[0].id;
    }

    const itemExistente = await pool.query(
      "SELECT id FROM carrinho_itens WHERE carrinho_id = $1 AND box_id = $2",
      [carrinho_id, box_id]
    );

    if (itemExistente.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Esta box já está na sua geladeira.",
        erro: "Item já existe no carrinho",
      });
    }

    // Lógica para determinar a coluna de preço com base em tipo_plano e quantidade
    let precoColumnName;
    if (tipo_plano === "mensal") {
      if (quantidade === 4) {
        precoColumnName = "preco_mensal_4_un";
      } else if (quantidade === 6) {
        precoColumnName = "preco_mensal_6_un";
      } else {
        return res.status(400).json({
          success: false,
          message: "Quantidade de cervejas inválida para o plano mensal.",
          erro: "Quantidade inválida",
        });
      }
    } else if (tipo_plano === "anual") {
      if (quantidade === 4) {
        precoColumnName = "preco_anual_4_un";
      } else if (quantidade === 6) {
        precoColumnName = "preco_anual_6_un";
      } else {
        return res.status(400).json({
          success: false,
          message: "Quantidade de cervejas inválida para o plano anual.",
          erro: "Quantidade inválida",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Tipo de plano inválido.",
        erro: "Tipo de plano inválido",
      });
    }

    const boxInfo = await pool.query(
      `SELECT ${precoColumnName} FROM boxes WHERE id = $1`,
      [box_id]
    );

    if (boxInfo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Box não encontrada.",
        erro: "Box ID inválido",
      });
    }
    const preco_unitario = boxInfo.rows[0][precoColumnName];

    await pool.query(
      "INSERT INTO carrinho_itens (carrinho_id, box_id, quantidade_cervejas, tipo_plano, preco_unitario) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [carrinho_id, box_id, quantidade, tipo_plano, preco_unitario]
    );

    const carrinhoAtualizado = await getCarrinhoCompleto(usuario_id);

    res.status(201).json({
      success: true,
      message: "Item adicionado/atualizado no carrinho com sucesso!",
      carrinho: carrinhoAtualizado,
    });
  } catch (error) {
    console.error("Erro ao adicionar item ao carrinho:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao adicionar item ao carrinho",
      erro: error.message,
    });
  }
};

// @desc    Ver todos os itens do carrinho
// @route   GET /carrinho
// @access  Privado
const verCarrinho = async (req, res) => {
  const usuario_id = req.userId;

  try {
    const carrinho = await getCarrinhoCompleto(usuario_id);

    if (!carrinho) {
      return res.status(200).json({
        success: true,
        carrinho: {
          id: null,
          usuario_id: usuario_id,
          total_itens: 0,
          itens: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      carrinho: carrinho,
    });
  }
  catch (error) {
    console.error("Erro ao buscar o carrinho:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar carrinho",
      erro: error.message,
    });
  }
};

// @desc    Remover um item do carrinho
// @route   DELETE /carrinho/remover/:box_id
// @access  Privado
const removerItem = async (req, res) => {
  const box_id_param = req.params.box_id;
  const usuario_id = req.userId;

  try {
    const carrinhoResult = await pool.query(
      "SELECT id FROM carrinhos WHERE usuario_id = $1",
      [usuario_id]
    );

    if (carrinhoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Carrinho não encontrado para este usuário.",
        erro: "Carrinho inexistente",
      });
    }
    const carrinho_id = carrinhoResult.rows[0].id;

    const deleteResult = await pool.query(
      `DELETE FROM carrinho_itens
       WHERE carrinho_id = $1 AND box_id = $2 RETURNING id`,
      [carrinho_id, box_id_param]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Item não encontrado no carrinho ou não autorizado a remover.",
        erro: "Item não encontrado ou não autorizado",
      });
    }

    const carrinhoAtualizado = await getCarrinhoCompleto(usuario_id);

    res.status(200).json({
      success: true,
      message: "Item removido do carrinho com sucesso!",
      carrinho: carrinhoAtualizado,
    });
  }
  catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao remover item do carrinho",
      erro: error.message,
    });
  }
};

module.exports = {
  adicionarItem,
  verCarrinho,
  removerItem,
};
