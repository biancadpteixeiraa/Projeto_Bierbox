const pool = require("../config/db");

const getAllBoxes = async (req, res) => {
  try {
    const allBoxes = await pool.query(
      "SELECT id, nome, descricao_curta, preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un, imagem_principal_url, especificacao, imagem_url_2, imagem_url_3, imagem_url_4, imagem_url_5 FROM boxes WHERE ativo = true ORDER BY id ASC"
    );

    const formattedBoxes = allBoxes.rows.map(box => {
      const imagens = [box.imagem_principal_url];
      if (box.imagem_url_2) imagens.push(box.imagem_url_2);
      if (box.imagem_url_3) imagens.push(box.imagem_url_3);
      if (box.imagem_url_4) imagens.push(box.imagem_url_4);
      if (box.imagem_url_5) imagens.push(box.imagem_url_5);

      const { imagem_url_2, imagem_url_3, imagem_url_4, imagem_url_5, ...rest } = box;
      return { ...rest, imagens };
    });

    res.status(200).json({ success: true, boxes: formattedBoxes });
  } catch (error) {
    console.error("Erro ao buscar as boxes:", error.message);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

const getBoxById = async (req, res) => {
  try {
    const { id } = req.params;

    const boxResult = await pool.query(
      "SELECT id, nome, descricao_curta, descricao_longa, especificacao, preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un, imagem_principal_url, imagem_url_2, imagem_url_3, imagem_url_4, imagem_url_5 FROM boxes WHERE id = $1 AND ativo = true",
      [id]
    );

    if (boxResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Box não encontrada." });
    }

    const box = boxResult.rows[0];

    const imagens = [box.imagem_principal_url];
    if (box.imagem_url_2) imagens.push(box.imagem_url_2);
    if (box.imagem_url_3) imagens.push(box.imagem_url_3);
    if (box.imagem_url_4) imagens.push(box.imagem_url_4);
    if (box.imagem_url_5) imagens.push(box.imagem_url_5);

    const { imagem_url_2, imagem_url_3, imagem_url_4, imagem_url_5, ...rest } = box;

    res.status(200).json({ success: true, box: { ...rest, imagens } });

  } catch (error) {
    console.error("Erro ao buscar a box:", error.message);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

module.exports = {
  getAllBoxes,
  getBoxById,
};
