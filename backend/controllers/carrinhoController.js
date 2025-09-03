// backend/controllers/carrinhoController.js
const pool = require("../config/db");

// Função auxiliar para obter detalhes completos do carrinho
const getCarrinhoCompleto = async (usuario_id) => {
  const carrinhoResult = await pool.query(
    "SELECT id, usuario_id FROM carrinhos WHERE usuario_id = $1",
    [usuario_id]
  );

  if (carrinhoResult.rows.length === 0) {
    return null; // Carrinho não encontrado
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
       b.preco AS preco_unitario
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
  // CORRIGIDO: Mudado de quantidade_cervejas para quantidade
  const { box_id, quantidade, tipo_plano } = req.body;
  const usuario_id = req.userId; // CORRIGIDO: Acessando diretamente req.userId

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

    // Para obter o preco_unitario, precisamos buscar o preço da box
    const boxInfo = await pool.query(
      "SELECT preco FROM boxes WHERE id = $1",
      [box_id]
    );
    if (boxInfo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Box não encontrada.",
        erro: "Box ID inválido",
      });
    }
    const preco_unitario = boxInfo.rows[0].preco;

    await pool.query(
      "INSERT INTO carrinho_itens (carrinho_id, box_id, quantidade_cervejas, tipo_plano, preco_unitario) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [carrinho_id, box_id, quantidade, tipo_plano, preco_unitario] // CORRIGIDO: Usando 'quantidade' aqui
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
  const usuario_id = req.userId; // CORRIGIDO: Acessando diretamente req.userId

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
// @route   DELETE /carrinho/item/:id
// @access  Privado
const removerItem = async (req, res) => {
  const item_id = req.params.id;
  const usuario_id = req.userId; // CORRIGIDO: Acessando diretamente req.userId

  try {
    const deleteResult = await pool.query(
      `DELETE FROM carrinho_itens ci
       WHERE ci.id = $1
       AND EXISTS (
         SELECT 1 FROM carrinhos c
         WHERE c.id = ci.carrinho_id AND c.usuario_id = $2
       )`,
      [item_id, usuario_id]
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
