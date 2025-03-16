//データベースについて
const { Pool } = require('pg'); //接続プール作成のクラス
//.envファイルを読み込む
require('dotenv').config(); //.envファイルを読み込んで環境変数を設定

const pool = new Pool({ // インスタンス（実体）
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // 最初は5432
});

//テスト
pool.query("SELECT NOW()", (err, res) => {
    if(err){
        console.error('Error:',err); //エラーが発生した場合
    }else{
        console.log('Current time fromDB:', res.rows[0].now); //エラーが無ければ
    }    
    pool.end();
  });

module.exports = pool; //エクスポート