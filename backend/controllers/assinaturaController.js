const pool = require("../config/db");

const assinaturaController = {
    // Listar todas as assinaturas do usuário autenticado
    listarAssinaturas: async (req, res) => {
        try {
            const userId = req.userId; // ID do usuário autenticado
            console.log("[DEBUG] Listando assinaturas para userId:", userId);

            const result = await pool.query(
                `SELECT 
                    a.id,
                    a.plano_id,
                    a.status,
                    a.data_inicio,
                    a.data_cancelamento,
                    a.criado_em,
                    a.atualizado_em,
                    a.id_assinatura_mp,
                    a.valor_assinatura,
                    a.valor_frete,
                    a.box_id,
                    -- box info (se existir)
                    b.nome AS box_nome,
                    b.imagem_principal_url AS box_imagem_url,
                    -- preço: se box existe usa preços da box; senão usa fallback por plano
                    CASE 
                        WHEN b.id IS NOT NULL AND a.plano_id = 'PLANO_MENSAL' THEN b.preco_mensal_4_un
                        WHEN b.id IS NOT NULL AND a.plano_id = 'PLANO_ANUAL' THEN b.preco_anual_4_un
                        WHEN a.plano_id = 'PLANO_MENSAL' THEN COALESCE(a.valor_assinatura, 80.00)
                        WHEN a.plano_id = 'PLANO_ANUAL' THEN COALESCE(a.valor_assinatura, 70.00)
                        ELSE a.valor_assinatura
                    END AS box_preco,
                    -- último pedido (status) via subquery lateral
                    p.status_pedido AS ultimo_status_pedido,
                    p.codigo_rastreio AS ultimo_codigo_rastreio,
                    -- informações do endereço de entrega
                    e.rua AS endereco_rua,
                    e.numero AS endereco_numero,
                    e.complemento AS endereco_complemento,
                    e.bairro AS endereco_bairro,
                    e.cidade AS endereco_cidade,
                    e.estado AS endereco_estado,
                    e.cep AS endereco_cep
                FROM assinaturas a
                LEFT JOIN boxes b ON a.box_id = b.id
                LEFT JOIN LATERAL (
                    SELECT status_pedido, codigo_rastreio
                    FROM pedidos
                    WHERE assinatura_id = a.id
                    ORDER BY criado_em DESC
                    LIMIT 1
                ) p ON true
                LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id -- CORRIGIDO AQUI: 'enderecos'
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
            console.log("[DEBUG] Buscando detalhes da assinatura:", id, "para userId:", userId);

            const result = await pool.query(
                `SELECT 
                    a.id,
                    a.plano_id,
                    a.status,
                    a.data_inicio,
                    a.data_cancelamento,
                    a.criado_em,
                    a.atualizado_em,
                    a.id_assinatura_mp,
                    a.valor_assinatura,
                    a.valor_frete,
                    a.box_id,
                    b.nome AS box_nome,
                    b.imagem_principal_url AS box_imagem_url,
                    CASE 
                        WHEN b.id IS NOT NULL AND a.plano_id = 'PLANO_MENSAL' THEN b.preco_mensal_4_un
                        WHEN b.id IS NOT NULL AND a.plano_id = 'PLANO_ANUAL' THEN b.preco_anual_4_un
                        WHEN a.plano_id = 'PLANO_MENSAL' THEN COALESCE(a.valor_assinatura, 80.00)
                        WHEN a.plano_id = 'PLANO_ANUAL' THEN COALESCE(a.valor_assinatura, 70.00)
                        ELSE a.valor_assinatura
                    END AS box_preco,
                    p.status_pedido AS ultimo_status_pedido,
                    p.codigo_rastreio AS ultimo_codigo_rastreio,
                    -- informações do endereço de entrega
                    e.rua AS endereco_rua,
                    e.numero AS endereco_numero,
                    e.complemento AS endereco_complemento,
                    e.bairro AS endereco_bairro,
                    e.cidade AS endereco_cidade,
                    e.estado AS endereco_estado,
                    e.cep AS endereco_cep
                FROM assinaturas a
                LEFT JOIN boxes b ON a.box_id = b.id
                LEFT JOIN LATERAL (
                    SELECT status_pedido, codigo_rastreio
                    FROM pedidos
                    WHERE assinatura_id = a.id
                    ORDER BY criado_em DESC
                    LIMIT 1
                ) p ON true
                LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id -- CORRIGIDO AQUI: 'enderecos'
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
            console.log("[DEBUG] Cancelando assinatura:", id, "para userId:", userId);

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
};

module.exports = assinaturaController;
