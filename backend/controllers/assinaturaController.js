const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const assinaturaController = {
    listarAssinaturas: async (req, res) => {
        try {
            const userId = req.userId;
            const result = await pool.query(
                `SELECT 
                    a.id, a.plano_id, a.status, a.data_inicio, a.data_cancelamento, a.id_assinatura_mp,
                    a.valor_assinatura, a.valor_frete, a.box_id, b.nome AS box_nome, b.imagem_principal_url AS box_imagem_url,
                    CASE 
                        WHEN b.id IS NOT NULL AND a.plano_id = 'PLANO_MENSAL' THEN b.preco_mensal_4_un
                        WHEN b.id IS NOT NULL AND a.plano_id = 'PLANO_ANUAL' THEN b.preco_anual_4_un
                        ELSE a.valor_assinatura
                    END AS box_preco,
                    p.status_pedido AS ultimo_status_pedido, p.codigo_rastreio AS ultimo_codigo_rastreio,
                    e.rua AS endereco_rua, e.numero AS endereco_numero, e.complemento AS endereco_complemento,
                    e.bairro AS endereco_bairro, e.cidade AS endereco_cidade, e.estado AS endereco_estado, e.cep AS endereco_cep,
                    a.forma_pagamento
                FROM assinaturas a
                LEFT JOIN boxes b ON a.box_id = b.id
                LEFT JOIN LATERAL (
                    SELECT status_pedido, codigo_rastreio FROM pedidos WHERE assinatura_id = a.id ORDER BY criado_em DESC LIMIT 1
                ) p ON true
                LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id
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

    obterDetalhesAssinatura: async (req, res) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            if (!isUuid(id)) {
                return res.status(400).json({ success: false, message: "ID de assinatura inválido." });
            }
            const result = await pool.query(
                `SELECT 
                    a.id, a.plano_id, a.status, a.data_inicio, a.data_cancelamento, a.id_assinatura_mp,
                    a.valor_assinatura, a.valor_frete, a.box_id, b.nome AS box_nome, b.imagem_principal_url AS box_imagem_url,
                    CASE 
                        WHEN b.id IS NOT NULL AND a.plano_id = 'PLANO_MENSAL' THEN b.preco_mensal_4_un
                        WHEN b.id IS NOT NULL AND a.plano_id = 'PLANO_ANUAL' THEN b.preco_anual_4_un
                        ELSE a.valor_assinatura
                    END AS box_preco,
                    p.status_pedido AS ultimo_status_pedido, p.codigo_rastreio AS ultimo_codigo_rastreio,
                    e.rua AS endereco_rua, e.numero AS endereco_numero, e.complemento AS endereco_complemento,
                    e.bairro AS endereco_bairro, e.cidade AS endereco_cidade, e.estado AS endereco_estado, e.cep AS endereco_cep,
                    a.forma_pagamento
                FROM assinaturas a
                LEFT JOIN boxes b ON a.box_id = b.id
                LEFT JOIN LATERAL (
                    SELECT status_pedido, codigo_rastreio FROM pedidos WHERE assinatura_id = a.id ORDER BY criado_em DESC LIMIT 1
                ) p ON true
                LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id
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

    cancelarAssinatura: async (req, res) => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            if (!isUuid(id)) {
                return res.status(400).json({ success: false, message: "ID de assinatura inválido." });
            }
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
            if (assinatura.id_assinatura_mp) {
                console.log(`Simulando cancelamento no Mercado Pago para ID: ${assinatura.id_assinatura_mp}`);
            }
            const result = await pool.query(
                "UPDATE assinaturas SET status = 'CANCELADA', data_cancelamento = NOW(), atualizado_em = NOW() WHERE id = $1 RETURNING *",
                [id]
            );
            res.status(200).json({ success: true, message: "Assinatura cancelada com sucesso.", data: result.rows[0] });
        } catch (error) {
            console.error("Erro ao cancelar assinatura:", error);
            res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    },

    /**
     * @desc Altera o endereço de entrega de uma assinatura existente.
     * @route PUT /api/assinaturas/:id/alterar-endereco
     * @access Privado
     */
    alterarEnderecoAssinatura: async (req, res) => {
        const { id: assinaturaId } = req.params;
        const { novo_endereco_id } = req.body;
        const utilizadorId = req.userId;

        if (!isUuid(assinaturaId) || !isUuid(novo_endereco_id)) {
            return res.status(400).json({ success: false, message: "IDs de assinatura e/ou endereço inválidos." });
        }

        try {
            // 1. Verificar se a assinatura pertence ao usuário
            const assinaturaResult = await pool.query(
                "SELECT id FROM assinaturas WHERE id = $1 AND utilizador_id = $2",
                [assinaturaId, utilizadorId]
            );

            if (assinaturaResult.rows.length === 0) {
                return res.status(404).json({ success: false, message: "Assinatura não encontrada ou não pertence ao usuário." });
            }

            // 2. Verificar se o novo endereço pertence ao usuário
            const enderecoResult = await pool.query(
                "SELECT id FROM enderecos WHERE id = $1 AND utilizador_id = $2",
                [novo_endereco_id, utilizadorId]
            );

            if (enderecoResult.rows.length === 0) {
                return res.status(404).json({ success: false, message: "Endereço de destino não encontrado ou não pertence ao usuário." });
            }

            // 3. Atualizar a assinatura com o novo ID de endereço
            const updateResult = await pool.query(
                "UPDATE assinaturas SET endereco_entrega_id = $1, atualizado_em = NOW() WHERE id = $2 RETURNING *",
                [novo_endereco_id, assinaturaId]
            );

            res.status(200).json({
                success: true,
                message: "Endereço da assinatura atualizado com sucesso!",
                data: updateResult.rows[0],
            });

        } catch (error) {
            console.error("Erro ao alterar endereço da assinatura:", error);
            res.status(500).json({ success: false, message: "Erro interno do servidor." });
        }
    },
};

module.exports = assinaturaController;
