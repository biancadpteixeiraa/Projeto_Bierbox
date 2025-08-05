const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          // O usuário padrão do PostgreSQL
  host: 'localhost',         // O endereço do seu banco (seu computador)
  database: 'bierbox_db',    // O nome do banco de dados que vamos criar logo em seguida
  password: '784596',
  port: 5432,                // A porta padrão do PostgreSQL
});

module.exports = pool;
