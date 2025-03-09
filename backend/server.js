//モジュールの読み込み
const express = require('express'); //Node.jsにExpressを読み込み（サーバー作成）
const cors = require('cors'); //CORSを使う（ミドルウェアの読み込み）
require('dotenv').config(); //.envを使うために定義

//Expressサーバーの作成
const app = express();

//フロントエンドからの通信
//corsの設定(環境ごとに変わるようにする)
app.use(cors({
    origin: function (origin, callback){ //orginにフロントURLが入る
        const allowedOrigins= [
            process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5500' //環境変数で指定 or ローカル環境をデフォルトに
        ];
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true); //許可
        } else {
            callback(new Error('Not allowed by CORS')); //許可なしならエラー
        }
    },
    //GETはデータ取得、POSTはデータ送信
    methods: ['GET','POST'], //GETとPOSTのみ許可
    credentials: true
})); //cors有効化

app.use(express.json()); //JSONリクエストを有効

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//APIエンドポイント
app.get('/',(req,res) => {
    res.send('サーバが正常に動作している');
});