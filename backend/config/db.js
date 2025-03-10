//データベースについて
const { Pool } = require('pg');
//.envファイルを読み込む
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // 最初は5432
});

pool.connect();
pool.query("SELECT NOW()", (err, res) => {
    pool.log(err, res);
    client.end();
  });



module.exports = pool;