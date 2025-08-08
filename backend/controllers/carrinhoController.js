// backend/controllers/carrinhoController.js
const pool = require('../config/db');

// @desc    Adicionar um item ao carrinho
// @route   POST /carrinho/adicionar
// @access  Privado
const adicionarItem = async (req, res) => {
  const { box_id, quantidade_cervejas, tipo_plano } = req.body;
  const usuario_id = req.user.userId;

  try {
    let carrinhoResult = await pool.query('SELECT id FROM carrinhos WHERE usuario_id = $1', [usuario_id]);
    let carrinho_id;

    if (carrinhoResult.rows.length === 0) {
      const novoCarrinho = await pool.query('INSERT INTO carrinhos (usuario_id) VALUES ($1) RETURNING id', [usuario_id]);
      carrinho_id = novoCarrinho.rows[0].id;
    } else {
      carrinho_id = carrinhoResult.rows[0].id;
    }

    const itemExistente = await pool.query(
      'SELECT id FROM carrinho_itens WHERE carrinho_id = $1 AND box_id = $2',
      [carrinho_id, box_id]
    );

    if (itemExistente.rows.length > 0) {
      return res.status(400).json({ message: 'Esta box já está na sua geladeira.' });
    }

    const novoItem = await pool.query(
      'INSERT INTO carrinho_itens (carrinho_id, box_id, quantidade_cervejas, tipo_plano) VALUES ($1, $2, $3, $4) RETURNING *',
      [carrinho_id, box_id, quantidade_cervejas, tipo_plano]
    );

    res.status(201).json({ message: 'Item adicionado à geladeira com sucesso!', item: novoItem.rows[0] });

  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// @desc    Ver todos os itens do carrinho
// @route   GET /carrinho
// @access  Privado
const verCarrinho = async (req, res) => {
  const usuario_id = req.user.userId;

  try {
    const itensDoCarrinho = await pool.query(
      `SELECT
         ci.id,
         ci.box_id,
         b.nome,
         b.imagem_principal_url,
         ci.quantidade_cervejas,
         ci.tipo_plano
       FROM carrinho_itens ci
       JOIN boxes b ON ci.box_id = b.id
       JOIN carrinhos c ON ci.carrinho_id = c.id
       WHERE c.usuario_id = $1
       ORDER BY ci.data_adicao ASC`,
      [usuario_id]
    );

    res.status(200).json(itensDoCarrinho.rows);

  } catch (error) {
    console.error('Erro ao buscar o carrinho:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// @desc    Remover um item do carrinho
// @route   DELETE /carrinho/item/:id
// @access  Privado
const removerItem = async (req, res) => {
  const item_id = req.params.id;
  const usuario_id = req.user.userId;

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
      return res.status(404).json({ message: 'Item não encontrado no carrinho ou não autorizado a remover.' });
    }

    res.status(200).json({ message: 'Item removido da geladeira com sucesso.' });

  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  adicionarItem,
  verCarrinho,
  removerItem,
};
