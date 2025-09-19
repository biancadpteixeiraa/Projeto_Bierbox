// controllers/assinaturaController.js
const pool = require('../config/db');

const assinaturaController = {
  // Listar todas as assinaturas do usuário autenticado
  listarAssinaturas: async (req, res) => {
    try {
      const userId = req.userId;

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
           b.imagem_principal AS box_imagem_url,
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
           p.codigo_rastreio AS ultimo_codigo_rastreio
         FROM assinaturas a
         LEFT JOIN boxes b ON a.box_id = b.id
         LEFT JOIN LATERAL (
            SELECT status_pedido, codigo_rastreio
            FROM pedidos
            WHERE assinatura_id = a.id
            ORDER BY criado_em DESC
            LIMIT 1
         ) p ON true
         WHERE a.utilizador_id = $1
         ORDER BY a.data_inicio DESC`,
        [userId]
      );

      return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Erro ao listar assinaturas:', error);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  },

  // Detalhes de uma assinatura (com endereço e info de pagamento/pedido)
  obterDetalhesAssinatura: async (req, res) => {
    try {
      const userId = req.userId;
      const { id } = req.params;

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

           -- dados da box (se box_id estiver preenchido)
           b.nome AS box_nome,
           b.descricao_curta AS box_descricao,
           b.imagem_principal AS box_imagem_url,

           CASE 
             WHEN b.id IS NOT NULL AND a.plano_id = 'PLANO_MENSAL' THEN b.preco_mensal_4_un
             WHEN b.id IS NOT NULL AND a.plano_id = 'PLANO_ANUAL' THEN b.preco_anual_4_un
             WHEN a.plano_id = 'PLANO_MENSAL' THEN COALESCE(a.valor_assinatura, 80.00)
             WHEN a.plano_id = 'PLANO_ANUAL' THEN COALESCE(a.valor_assinatura, 70.00)
             ELSE a.valor_assinatura
           END AS box_preco,

           -- Endereco de entrega ligado na assinatura (se houver)
           e.rua, e.numero, e.complemento, e.bairro, e.cidade, e.estado, e.cep,

           -- último pedido (LATERAL)
           p.id AS pedido_id,
           p.status_pedido,
           p.codigo_rastreio,
           p.valor_frete AS pedido_valor_frete,
           p.valor_assinatura AS pedido_valor_assinatura,
           p.valor_total AS pedido_valor_total,
           p.data_pagamento AS pedido_data_pagamento

         FROM assinaturas a
         LEFT JOIN boxes b ON a.box_id = b.id
         LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id
         LEFT JOIN LATERAL (
           SELECT id, status_pedido, codigo_rastreio, valor_frete, valor_assinatura, valor_total, data_pagamento
           FROM pedidos
           WHERE assinatura_id = a.id
           ORDER BY criado_em DESC
           LIMIT 1
         ) p ON true
         WHERE a.id = $1 AND a.utilizador_id = $2
         LIMIT 1`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Assinatura não encontrada ou não pertence ao usuário.' });
      }

      return res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Erro ao obter detalhes da assinatura:', error);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  },

  // Cancelar assinatura (mesma lógica, atualiza status + opção de chamar MP no futuro)
  cancelarAssinatura: async (req, res) => {
    try {
      const userId = req.userId;
      const { id } = req.params;

      const assinaturaResult = await pool.query(
        `SELECT id, status, id_assinatura_mp FROM assinaturas WHERE id = $1 AND utilizador_id = $2`,
        [id, userId]
      );

      if (assinaturaResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Assinatura não encontrada ou não pertence ao usuário.' });
      }

      const assinatura = assinaturaResult.rows[0];

      if (assinatura.status === 'CANCELADA') {
        return res.status(400).json({ success: false, message: 'Assinatura já está cancelada.' });
      }

      // Se existir id_assinatura_mp e quiser cancelar no Mercado Pago, podemos integrar aqui:
      if (assinatura.id_assinatura_mp) {
        console.log(`(Simulação) Cancelamento no Mercado Pago para id: ${assinatura.id_assinatura_mp}`);
        // TODO: integração Real com Mercado Pago: chamar endpoint de cancelamento de preapproval/subscription
      }

      const updateResult = await pool.query(
        `UPDATE assinaturas SET status = 'CANCELADA', data_cancelamento = NOW(), atualizado_em = NOW() WHERE id = $1 RETURNING *`,
        [id]
      );

      return res.status(200).json({ success: true, message: 'Assinatura cancelada com sucesso.', data: updateResult.rows[0] });

    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  }
};

module.exports = assinaturaController;
