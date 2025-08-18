const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         
  host: 'localhost',        
  database: 'bierbox_db',   
  password: '784596',
  port: 5432,        // porta padrão do PostgreSQL
});

module.exports = pool;
