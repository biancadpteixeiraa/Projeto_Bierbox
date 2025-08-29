const pool = require("../config/db");

// Função para obter os dados do perfil do usuário logado
const getProfile = async (req, res) => {
  try {
    // O ID do usuário é adicionado ao objeto req pelo middleware de autenticação
    const userId = req.userId;

    // Busca os dados do usuário no banco de dados
    const result = await pool.query(
      "SELECT id, nome_completo, email, cpf, foto_perfil_url, data_criacao FROM users WHERE id = $1",
      [userId] // <<--- ESTA É A LINHA MAIS IMPORTANTE
    );

    // Verifica se o usuário foi encontrado
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado."
      });
    }

    const user = result.rows[0];

    // Retorna os dados do perfil (sem a senha!)
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

module.exports = {
  getProfile
};
