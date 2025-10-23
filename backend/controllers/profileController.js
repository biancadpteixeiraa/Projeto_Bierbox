const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      "SELECT id, nome_completo, email, cpf, foto_perfil_url, data_criacao FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error.message);
    res.status(500).json({ success: false, message: "Erro interno do servidor ao buscar perfil." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { nome_completo, senha_atual, nova_senha } = req.body;
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    }
    const user = userResult.rows[0];
    let updatedFields = [];
    let queryParams = [];
    let paramIndex = 1;
    if (nome_completo !== undefined) {
      updatedFields.push(`nome_completo = $${paramIndex++}`);
      queryParams.push(nome_completo);
    }
    if (nova_senha !== undefined) {
      if (!senha_atual) {
        return res.status(400).json({ success: false, message: "Senha atual é obrigatória para alterar a senha." });
      }
      const isMatch = await bcrypt.compare(senha_atual, user.senha_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Senha atual incorreta." });
      }
      const salt = await bcrypt.genSalt(10);
      const nova_senha_hash = await bcrypt.hash(nova_senha, salt);
      updatedFields.push(`senha_hash = $${paramIndex++}`);
      queryParams.push(nova_senha_hash);
    }
    if (updatedFields.length === 0) {
      return res.status(400).json({ success: false, message: "Nenhum campo válido para atualização fornecido." });
    }
    const updateQuery = `UPDATE users SET ${updatedFields.join(", ")} WHERE id = $${paramIndex} RETURNING id, nome_completo, email, cpf, foto_perfil_url, data_criacao`;
    queryParams.push(userId);
    const updatedUserResult = await pool.query(updateQuery, queryParams);
    res.json({ success: true, message: "Perfil atualizado com sucesso!", user: updatedUserResult.rows[0] });
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error.message);
    res.status(500).json({ success: false, message: "Erro interno do servidor ao atualizar perfil." });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;

    const activeSubscriptions = await pool.query(
      "SELECT id FROM assinaturas WHERE utilizador_id = $1 AND status = 'ATIVA'",
      [userId]
    );

    if (activeSubscriptions.rows.length > 0) {
      return res.status(403).json({ success: false, message: "Não é possível excluir a conta: existem assinaturas ativas." });
    }

    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado para exclusão." });
    }
    res.json({ success: true, message: "Conta excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir conta do usuário:", error.message);
    res.status(500).json({ success: false, message: "Erro interno do servidor ao excluir conta." });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.userId;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Nenhum arquivo de imagem enviado." });
    }

    const foto_perfil_url = req.file.path;

    const result = await pool.query(
      "UPDATE users SET foto_perfil_url = $1 WHERE id = $2 RETURNING id, nome_completo, email, cpf, foto_perfil_url, data_criacao",
      [foto_perfil_url, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado para atualizar foto." });
    }

    res.json({ success: true, message: "Foto de perfil atualizada com sucesso!", user: result.rows[0] });
  } catch (error) {
    console.error("Erro ao fazer upload da foto de perfil:", error);
    res.status(500).json({ success: false, message: "Erro ao fazer upload da foto de perfil.", erro: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  uploadProfilePhoto,
};
