//データベースについて ライブラリの読み込み
const { Pool } = require('pg'); //接続プール作成のクラス
//.envファイルを読み込む
require('dotenv').config(); //.envファイルを読み込んで環境変数を設定

//PostgreSQLの接続情報設定
const pool = new Pool({ // インスタンス（実体）
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // 最初は5432
});

//テスト・実行別ける
async function testConnection() {
    try{
        const res = await pool.query("SELECT NOW()");
        console.log("DB接続成功:",res.rows[0].now); 
    } catch (err) {
        console.error("DB接続失敗:",err);
    }
}

// NODE_ENV が production（本番）でないときだけ実行
if (process.env.NODE_ENV !== 'production') {
    testConnection(); // ← 本番では実行されない
}

//テストの実行
pool.query("SELECT NOW()", (err, res) => { //現在時刻を取るだけのクエリ（問い合わせ）
    if(err){
        console.error('Error:',err); //エラーが発生した場合
    }else{
        console.log('Current time fromDB:', res.rows[0].now); //エラーが無ければ
    }    
    pool.end(); //プールを閉じる
  });

module.exports = pool; //エクスポート（他のファイルでも使えるようにする）　