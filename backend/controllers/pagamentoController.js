// === substitua apenas a função criarPreferencia temporariamente por esta ===
exports.criarPreferencia = async (req, res) => {
  try {
    // 1) Log básico para Render
    console.log("[DEBUG PAY] Endpoint /criar-preferencia chamado");

    // 2) Headers e token (mostra se Authorization está chegando)
    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || null;
    console.log("[DEBUG PAY] Authorization header:", authHeader ? "[PRESENT]" : "[MISSING]");

    // 3) userId setado pelo middleware (se não estiver setado vai mostrar undefined)
    const userIdFromReq = req.userId;
    console.log("[DEBUG PAY] req.userId:", userIdFromReq);

    // 4) Mostrar o body recebido
    console.log("[DEBUG PAY] Body recebido:", req.body);

    // 5) Se tiver token, decodifique no cliente (eu não faço verificação aqui).
    //    Apenas para ajudar: diga ao frontend para verificar em jwt.io o payload do token.
    //    Aqui vamos consultar o usuário no banco para confirmar qual user existe para esse id.
    let userRow = null;
    if (userIdFromReq) {
      const ur = await pool.query("SELECT id, email, nome_completo FROM users WHERE id = $1", [userIdFromReq]);
      userRow = ur.rows;
      console.log("[DEBUG PAY] Resultado users WHERE id=req.userId:", userRow);
    } else {
      console.warn("[DEBUG PAY] req.userId indefinido — verifique se o middleware de auth está sendo aplicado nesta rota.");
    }

    // 6) Listar todos os endereços da tabela (curto) e filtrar por utilizador_id
    const all = await pool.query("SELECT id, utilizador_id, rua, numero, cidade, estado, cep, criado_em FROM enderecos ORDER BY criado_em DESC LIMIT 50");
    console.log("[DEBUG PAY] Últimos 50 enderecos (geral):", all.rows.length);

    // 7) Endereços do userId do token (se houver userId)
    let enderecosDoUser = [];
    if (userIdFromReq) {
      const er = await pool.query("SELECT id, utilizador_id, rua, numero, cidade, estado, cep, criado_em FROM enderecos WHERE utilizador_id = $1 ORDER BY criado_em DESC", [userIdFromReq]);
      enderecosDoUser = er.rows;
      console.log(`[DEBUG PAY] Enderecos para utilizador_id=${userIdFromReq}:`, enderecosDoUser.length);
    }

    // 8) Resposta útil para você ver direto no Postman (NÃO CRIA NADA)
    return res.status(200).json({
      debug: true,
      authHeaderPresent: !!authHeader,
      authHeaderSample: authHeader ? (authHeader.length > 60 ? authHeader.slice(0,60) + "..." : authHeader) : null,
      reqUserId: userIdFromReq || null,
      userRow,
      enderecos_disponiveis_por_reqUserId: enderecosDoUser,
      ultimos_enderecos_geral: all.rows.slice(0,10) // só para visualizar algumas linhas
    });
  } catch (err) {
    console.error("[DEBUG PAY] erro no debug criarPreferencia:", err);
    return res.status(500).json({ debug: true, error: err.message });
  }
};
