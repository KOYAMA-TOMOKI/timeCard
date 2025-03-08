//Node.jsにExpressを読み込み
//CORSを使う
const express = require('express');
const cors = require('cors');
//Expressアプリの作成
const app = express();

//フロントエンドからの通信
app.use(cors()); //cors有効化
app.use(express.json()); //JSONリクエストを有効

//APIエンドポイント
app.get('/',(req,res) => {
    res.send('サーバが正常に動作している');
});


