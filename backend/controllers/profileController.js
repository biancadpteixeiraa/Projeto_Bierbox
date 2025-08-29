const pool = require("../config/db");
const bcrypt = require("bcryptjs"); // Importa o bcryptjs para lidar com senhas

// Função para obter os dados do perfil do usuário logado
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      "SELECT id, nome_completo, email, cpf, foto_perfil_url, data_criacao FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado."
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        nome_completo: user.nome_completo,
        email: user.email,
        cpf: user.cpf,
        foto_perfil_url: user.foto_perfil_url,
        data_criacao: user.data_criacao
      }
    });

  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao buscar perfil."
    });
  }
};

// Função para atualizar os dados do perfil do usuário logado
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { nome_completo, senha_atual, nova_senha } = req.body;

    // Primeiro, busca o usuário para verificar a senha atual e obter dados existentes
    const userResult = await pool.query("SELECT id, nome_completo, senha_hash FROM users WHERE id = $1", [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    }

    const user = userResult.rows[0];
    let updatedFields = [];
    let queryParams = [];
    let paramIndex = 1;

    // Atualiza nome_completo se fornecido
    if (nome_completo !== undefined) {
      updatedFields.push(`nome_completo = $${paramIndex++}`);
      queryParams.push(nome_completo);
    }

    // Atualiza senha se nova_senha e senha_atual forem fornecidas
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

    // Se não houver campos para atualizar, retorna erro
    if (updatedFields.length === 0) {
      return res.status(400).json({ success: false, message: "Nenhum campo válido para atualização fornecido." });
    }

    // Constrói e executa a query de atualização
    const updateQuery = `UPDATE users SET ${updatedFields.join(', ')} WHERE id = $${paramIndex} RETURNING id, nome_completo, email, cpf, foto_perfil_url, data_criacao`;
    queryParams.push(userId);

    const updatedUserResult = await pool.query(updateQuery, queryParams);

    res.json({
      success: true,
      message: "Perfil atualizado com sucesso!",
      user: {
        id: updatedUserResult.rows[0].id,
        nome_completo: updatedUserResult.rows[0].nome_completo,
        email: updatedUserResult.rows[0].email,
        cpf: updatedUserResult.rows[0].cpf,
        foto_perfil_url: updatedUserResult.rows[0].foto_perfil_url,
        data_criacao: updatedUserResult.rows[0].data_criacao
      }
    });

  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error.message);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao atualizar perfil."
    });
  }
};

module.exports = {
  getProfile,
  updateProfile // Exporta a nova função
};
