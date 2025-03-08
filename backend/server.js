//Node.jsにExpressを読み込み（サーバー作成）
//CORSを使う（ミドルウェアの読み込み）
const express = require('express');
const cors = require('cors');

//Expressサーバーの作成
const app = express();

//フロントエンドからの通信
//corsの設定(環境ごとに変わるようにする)
app.use(cors({
    origin: function (origin, callback){ //orginにフロントURLが入る
        if(!origin){
            callback(null, true); //許可
        } else {
            callback(null, origin); //許可なしならエラー
        }
    },
    methods: ['GET','POST'], //GETとPOSTのみ許可
    credentials: true
})); //cors有効化

app.use(express.json()); //JSONリクエストを有効

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//APIエンドポイント
/*app.get('/',(req,res) => {
    res.send('サーバが正常に動作している');
});

*/