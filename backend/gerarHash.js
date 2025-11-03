const bcrypt = require('bcryptjs');

async function gerarNovoHash() {
    const novaSenha = 'admin_bierbox_0210'; 
    
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    console.log('Sua nova senha é:', novaSenha);
    console.log('\nCopie este hash para o banco de dados:\n');
    console.log(senhaHash);
}

gerarNovoHash();
