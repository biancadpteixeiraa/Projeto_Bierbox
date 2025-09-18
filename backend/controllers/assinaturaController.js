const pool = require("../config/db");

const assinaturaController = {
    // Listar todas as assinaturas do usuário autenticado
    listarAssinaturas: async (req, res) => {
        try {
            const userId = req.userId; // ID do usuário autenticado

            const result = await pool.query(
                `SELECT 
                    a.id, 
                    a.plano_id, 
                    a.status, 
                    a.data_inicio, 
                    a.data_fim, 
                    a.data_atualizacao, 
                    a.id_assinatura_mp, 
                    b.nome AS box_nome, 
                    b.descricao AS box_descricao, 
                    b.preco AS box_preco, 
                    b.imagem_url AS box_imagem_url
                FROM assinaturas a
                JOIN boxes b ON a.plano_id = b.id::text -- Assumindo que plano_id na assinatura é o id da box
                WHERE a.utilizador_id = $1
                ORDER BY a.data_inicio DESC`,
                [userId]
            );

            res.status(200).json({ success: true, data: result.rows });
        } catch (error) {
            console.error("Erro ao listar assinaturas:", error);
            res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    },

    // Obter detalhes de uma assinatura específica
    obterDetalhesAssinatura: async (req, res) => {
        try {
            const userId = req.userId;
            const { id } = req.params; // ID da assinatura vindo da URL

            const result = await pool.query(
                `SELECT 
                    a.id, 
                    a.plano_id, 
                    a.status, 
                    a.data_inicio, 
                    a.data_fim, 
                    a.data_atualizacao, 
                    a.id_assinatura_mp, 
                    b.nome AS box_nome, 
                    b.descricao AS box_descricao, 
                    b.preco AS box_preco, 
                    b.imagem_url AS box_imagem_url
                FROM assinaturas a
                JOIN boxes b ON a.plano_id = b.id::text
                WHERE a.id = $1 AND a.utilizador_id = $2`,
                [id, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: "Assinatura não encontrada ou não pertence ao usuário." });
            }

            res.status(200).json({ success: true, data: result.rows[0] });
        } catch (error) {
            console.error("Erro ao obter detalhes da assinatura:", error);
            res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    },

    // Cancelar uma assinatura
    cancelarAssinatura: async (req, res) => {
        try {
            const userId = req.userId;
            const { id } = req.params; // ID da assinatura a ser cancelada
            const { motivo_cancelamento } = req.body; // Motivo opcional

            // Primeiro, verificar se a assinatura existe e pertence ao usuário
            const assinaturaResult = await pool.query(
                "SELECT id, status, id_assinatura_mp FROM assinaturas WHERE id = $1 AND utilizador_id = $2",
                [id, userId]
            );

            if (assinaturaResult.rows.length === 0) {
                return res.status(404).json({ success: false, message: "Assinatura não encontrada ou não pertence ao usuário." });
            }

            const assinatura = assinaturaResult.rows[0];

            if (assinatura.status === "CANCELADA") {
                return res.status(400).json({ success: false, message: "Assinatura já está cancelada." });
            }

            // Lógica para cancelar no Mercado Pago (se houver um id_assinatura_mp)
            if (assinatura.id_assinatura_mp) {
                // Aqui você chamaria a API do Mercado Pago para cancelar a preapproval
                // Ex: const mpResult = await mercadopago.preapproval.cancel({ id: assinatura.id_assinatura_mp });
                // Por enquanto, vamos apenas logar e seguir com a atualização local
                console.log(`Simulando cancelamento no Mercado Pago para ID: ${assinatura.id_assinatura_mp}`);
            }

            // Atualizar o status da assinatura no banco de dados
            const result = await pool.query(
                "UPDATE assinaturas SET status = \'CANCELADA\', data_fim = NOW(), data_atualizacao = NOW(), motivo_cancelamento = $1 WHERE id = $2 RETURNING *",
                [motivo_cancelamento || "Cancelado pelo usuário", id]
            );

            res.status(200).json({ success: true, message: "Assinatura cancelada com sucesso.", data: result.rows[0] });

        } catch (error) {
            console.error("Erro ao cancelar assinatura:", error);
            res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    },
};

module.exports = assinaturaController;
