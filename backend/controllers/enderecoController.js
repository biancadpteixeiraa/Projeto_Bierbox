const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

// @desc    Buscar todos os endereços do utilizador logado
// @route   GET /api/enderecos
// @access  Privado
const getEnderecos = async (req, res) => {
    const utilizadorId = req.userId;
    try {
        const { rows } = await pool.query(
            'SELECT * FROM enderecos WHERE utilizador_id = $1 ORDER BY is_padrao DESC, atualizado_em DESC',
            [utilizadorId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar endereços:', error);
        res.status(500).json({ message: 'Erro no servidor ao buscar endereços.' });
    }
};

// @desc    Adicionar um novo endereço para o utilizador logado
// @route   POST /api/enderecos
// @access  Privado
const addEndereco = async (req, res) => {
    const utilizadorId = req.userId;
    const { cep, rua, numero, complemento, bairro, cidade, estado, is_padrao } = req.body;

    if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    try {
        if (is_padrao === true) {
            await pool.query('UPDATE enderecos SET is_padrao = FALSE WHERE utilizador_id = $1', [utilizadorId]);
        }

        const { rows } = await pool.query(
            'INSERT INTO enderecos (utilizador_id, cep, rua, numero, complemento, bairro, cidade, estado, is_padrao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [utilizadorId, cep, rua, numero, complemento, bairro, cidade, estado, is_padrao || false]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Erro ao adicionar endereço:', error);
        res.status(500).json({ message: 'Erro no servidor ao adicionar endereço.' });
    }
};

// @desc    Buscar um endereço específico pelo ID
// @route   GET /api/enderecos/:id
// @access  Privado
const getEnderecoById = async (req, res) => {
    const { id } = req.params;
    const utilizadorId = req.userId;

    if (!isUuid(id)) {
        return res.status(400).json({ message: 'ID de endereço inválido.' });
    }

    try {
        const { rows } = await pool.query(
            'SELECT * FROM enderecos WHERE id = $1 AND utilizador_id = $2',
            [id, utilizadorId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Endereço não encontrado ou não pertence a este utilizador.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar endereço por ID:', error);
        res.status(500).json({ message: 'Erro no servidor ao buscar endereço.' });
    }
};

// @desc    Atualizar um endereço existente
// @route   PUT /api/enderecos/:id
// @access  Privado
const updateEndereco = async (req, res) => {
    const { id } = req.params;
    const utilizadorId = req.userId;
    const { cep, rua, numero, complemento, bairro, cidade, estado, is_padrao } = req.body;

    if (!isUuid(id)) {
        return res.status(400).json({ message: 'ID de endereço inválido.' });
    }

    if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    try {
        const { rows: enderecoExistente } = await pool.query(
            'SELECT * FROM enderecos WHERE id = $1 AND utilizador_id = $2',
            [id, utilizadorId]
        );
        if (enderecoExistente.length === 0) {
            return res.status(404).json({ message: 'Endereço não encontrado ou não pertence a este utilizador.' });
        }

        if (is_padrao === true) {
            await pool.query(
                'UPDATE enderecos SET is_padrao = FALSE WHERE utilizador_id = $1 AND id != $2',
                [utilizadorId, id]
            );
        }

        const { rows } = await pool.query(
            'UPDATE enderecos SET cep = $1, rua = $2, numero = $3, complemento = $4, bairro = $5, cidade = $6, estado = $7, is_padrao = $8, atualizado_em = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
            [cep, rua, numero, complemento, bairro, cidade, estado, is_padrao || false, id]
        );
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar endereço:', error);
        res.status(500).json({ message: 'Erro no servidor ao atualizar endereço.' });
    }
};

// @desc    Apagar um endereço existente
// @route   DELETE /api/enderecos/:id
// @access  Privado
const deleteEndereco = async (req, res) => {
    const { id } = req.params;
    const utilizadorId = req.userId;

    if (!isUuid(id)) {
        return res.status(400).json({ message: 'ID de endereço inválido.' });
    }

    try {
        const { rows: assinaturasVinculadas } = await pool.query(
            'SELECT id FROM assinaturas WHERE endereco_entrega_id = $1 AND utilizador_id = $2 AND status != $3',
            [id, utilizadorId, 'CANCELADA']
        );

        if (assinaturasVinculadas.length > 0) {
            return res.status(400).json({
                message: 'Este endereço está vinculado a uma assinatura ativa e não pode ser excluído.'
            });
        }

        const { rowCount } = await pool.query(
            'DELETE FROM enderecos WHERE id = $1 AND utilizador_id = $2',
            [id, utilizadorId]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Endereço não encontrado ou não pertence a este utilizador.' });
        }

        res.status(200).json({ message: 'Endereço apagado com sucesso.' });
    } catch (error) {
        console.error('Erro ao apagar endereço:', error);
        res.status(500).json({ message: 'Erro no servidor ao apagar endereço.' });
    }
};

module.exports = {
    getEnderecos,
    addEndereco,
    getEnderecoById,
    updateEndereco,
    deleteEndereco,
};
