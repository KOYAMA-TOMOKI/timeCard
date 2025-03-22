//モジュールの読み込み
const express = require('express'); //Node.jsにExpressを読み込み（サーバー作成）
const cors = require('cors'); //CORSを使う（ミドルウェアの読み込み）
require('dotenv').config(); //.envを使うために定義
const { Pool } = require('pg'); //PostgreSQLのクラスを読み込む
const pool = require('./config/db');//DB接続モジュールのインポート
const bcrypt = require('bcrypt'); // bcryptのインポート（パスワードのハッシュ化・照合）

//Expressサーバーの作成
const app = express();

// CORS設定
const allowedOrigins = [
    'http://127.0.0.1:5500',  // Live Server の場合
    'http://127.0.0.1:8080',  // 他のポートでフロントを起動している場合
    'http://localhost:8080'   // localhost の場合
];

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



//ログインAPI
//res (サーバーから返すデータ)
//req (フロントエンドから送られるデータ)
app.post('/api/login',async(req, res) =>{ //POSTメソッドで/loginにアクセス
    const { id, password } = req.body; //req.bodyでフロントから送られたデータを取得
    try{ 
        //PostgreSQLのusersテーブルからidとpasswordが一致するデータを取得
        const result = await pool.query("SELECT id, password, role FROM users WHERE id = $1", [id]);
        
        if(result.rows.length === 0){
            return res.status(401).json({ error: 'IDまたはパスワードが違います'});
        }

        const user = result.rows[0];

        //入力されたパスワードとDBに保存されたパスワードを比較
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'IDまたはパスワードが違います' });
        }

        //ログイン成功
        res.json({ role: user.role });
    } catch (error) {
        console.error('ログインエラー:', error);
        res.status(500).json({ error: "サーバーエラー"});
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
    console.log(`フロントエンドは:${allowedOrigins.join(",")} から接続可能`);
});

//開発なので仮
//APIエンドポイント
app.get('/',(req,res) => {
    res.send('サーバが正常に動作している');
});
