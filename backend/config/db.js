//データベースについて
const { Pool } = require('pg');
//.envファイルを読み込む
require('dotenv').config();

const Pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT || 5432, //最初は5432
});

module.exports = pool;