//モジュールの読み込み
const express = require('express'); //Node.jsにExpressを読み込み（サーバー作成）
const cors = require('cors'); //CORSを使う（ミドルウェアの読み込み）
require('dotenv').config(); //.envを使うために定義
const { Pool } = require('pg'); //PostgreSQLのクラスを読み込む
const pool = require('./config/db');//DB接続モジュールのインポート

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

//APIエンドポイント:フロントからの登録API
//res (サーバーから返すデータ)
//req (フロントエンドから送られるデータ)
app.post('/attendance',async(req, res) =>{ ///attendanceというURLに送られたとき実行する
    const {employess_id,clock_in,clock_out} = req.body; //req.bodyでフロントから送られたデータを取得
    try{ //エラーが発生した場合にキャッチする
        const result = await pool.query( //データベースにSQLを実行　命令を送る
        //SQL文
        "INSERT INTO attendance (employee_id, clock_in, clock_out) VALUES ($1, $2, $3) RETURNING *",
        //$1,$2,$3に対応する値の配列
        [employess_id,clock_in,clock_out]
        );
        res.json(result.rows[0]); //結果をフロントエンドに返す
    }catch(error){ //エラーが発生した場合
        //エラーメッセージを表示
        console.error('Error inserting attendance:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});

//CSVダウンロード用のAPIエンドポイント
app.get('/download-csv', async(req, res) => {
    const{ month } = req.query;
    if(!month){
        return res.status(400).json({ error: 'month パラメータは必須'});
    }
    try{
        const query = `
            SELECT * FROM attendance
            WHERE TO_CHAR(clock_in, 'YYYY-MM') = $1`;
        const result = await pool.query(query, [month]);
        const data = result.rows;
        const { Parser } = require('json2csv');
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename="attendance_${month}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
});
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
