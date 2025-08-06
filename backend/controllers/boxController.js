// backend/controllers/boxController.js
const pool = require('../config/db');

// Função para buscar todas as boxes (já existia)
const getAllBoxes = async (req, res) => {
  try {
    const allBoxes = await pool.query(
      "SELECT id, nome, preco_mensal_4_un, preco_anual_4_un, imagem_principal_url FROM boxes WHERE ativo = true ORDER BY id ASC"
    );
    res.status(200).json(allBoxes.rows);
  } catch (error) {
    console.error('Erro ao buscar as boxes:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- NOVA FUNÇÃO PARA BUSCAR UMA BOX POR ID ---
const getBoxById = async (req, res) => {
  try {
    // 1. Pega o ID que veio como parâmetro na URL
    const { id } = req.params;

    // 2. Executa o comando SQL para selecionar a box com aquele ID específico
    const box = await pool.query("SELECT * FROM boxes WHERE id = $1 AND ativo = true", [id]);

    // 3. Verifica se a box não foi encontrada (nenhuma linha retornada)
    if (box.rows.length === 0) {
      return res.status(404).json({ message: 'Box não encontrada.' });
    }

    // 4. Se encontrou, envia os dados da box como resposta
    res.status(200).json(box.rows[0]);

  } catch (error) {
    console.error('Erro ao buscar a box:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Exporta a nova função junto com a antiga
module.exports = {
  getAllBoxes,
  getBoxById, // Adicione esta linha
};
