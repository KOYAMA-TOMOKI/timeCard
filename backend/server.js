//モジュールの読み込み
const express = require('express'); //Node.jsにExpressを読み込み（サーバー作成）
const cors = require('cors'); //CORSを使う（ミドルウェアの読み込み）
require('dotenv').config(); //.envを使うために定義

//Expressサーバーの作成
const app = express();

//originの設定
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5500').split(',');

//フロントエンドからの通信
//corsの設定(環境ごとに変わるようにする)
app.use(cors({
    origin: function (origin, callback){ //orginにフロントURLが入る
        //フロントのURL確認Origin
        if(!origin && process.env.NODE_ENV !== 'production'){
            //開発時のみ、nullのオリジンを許可
            return callback(null, true); //許可
        }
        if (allowedOrigins.includes(origin)){
            return callback(null, true);
        } else {
            console.error(`CORSエラー:許可されていないオリジン - ${origin}`);
            return callback(new Error(`Not allowed by CORS: ${origin}`)); //許可なしならエラー
        }
    },
    //GETはデータ取得、POSTはデータ送信
    methods: ['GET','POST','PUT','DELETE'], //必要に応じて追加
    credentials: true
}));

app.use(express.json()); //JSONリクエストを有効

//サーバー起動
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//開発なので仮
//APIエンドポイント
app.get('/',(req,res) => {
    res.send('サーバが正常に動作している');
});
