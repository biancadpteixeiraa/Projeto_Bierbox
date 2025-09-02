const pool = require("../config/db");

// Função para buscar todas as boxes 
const getAllBoxes = async (req, res) => {
  try {
    const allBoxes = await pool.query(
      "SELECT id, nome, descricao_curta, preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un, imagem_principal_url FROM boxes WHERE ativo = true ORDER BY id ASC"
    );
    res.status(200).json({ success: true, boxes: allBoxes.rows });
  } catch (error) {
    console.error("Erro ao buscar as boxes:", error.message);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

const getBoxById = async (req, res) => {
  try {
    const { id } = req.params;

    // Seleciona todas as colunas relevantes para uma box específica
    const box = await pool.query(
      "SELECT id, nome, descricao_curta, descricao_longa, preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un, imagem_principal_url FROM boxes WHERE id = $1 AND ativo = true",
      [id]
    );

    if (box.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Box não encontrada." });
    }

    res.status(200).json({ success: true, box: box.rows[0] });

  } catch (error) {
    console.error("Erro ao buscar a box:", error.message);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

module.exports = {
  getAllBoxes,
  getBoxById,
};
