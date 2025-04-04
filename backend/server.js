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
    'http://localhost:5173'   // localhost の場合
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

// 出退勤記録API
app.post('/api/attendance', async (req, res) => {
  const { userId, type } = req.body;
  if (!userId || !type) {
      return res.status(400).json({ message: 'ユーザーIDと出退勤タイプは必須です' });
  }
  try {
      const time = new Date();
      if (type === 'clock_in') {
          // 出勤
          const today = time.toISOString().slice(0, 10); // "YYYY-MM-DD"
          await pool.query(
            "INSERT INTO timecard (user_id, work_data, clock_in_time, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())",
            [userId, today, time]
          );
        } else if (type === 'clock_out') {
          await pool.query(
            `UPDATE timecard
             SET clock_out_time = $1, updated_at = NOW()
             WHERE login_id = (
               SELECT sub.login_id FROM (
                 SELECT login_id FROM timecard
                 WHERE user_id = $2 AND clock_out_time IS NULL
                 ORDER BY clock_in_time DESC
                 LIMIT 1
               ) AS sub
             )`,
            [time, userId]
          );
      } else {
          return res.status(400).json({ message: '不正な出退勤タイプです' });
      }

      res.json({ message: `出勤/退勤を記録しました (${type})` });
  } catch (err) {
      console.error('出退勤記録エラー:', err);
      res.status(500).json({ message: 'サーバーエラーで記録できませんでした' });
  }
});

//ログインAPI
// ログインAPI
app.post('/api/login', async (req, res) => {
    const { id, password } = req.body;
  
    try {
      const result = await pool.query(
        "SELECT user_id, name, password, role FROM users WHERE user_id = $1",
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'IDまたはパスワードが違います' });
      }
  
      const user = result.rows[0];
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'IDまたはパスワードが違います' });
      }
  
      res.json({ role: user.role });
    } catch (error) {
      console.error('ログインエラー:', error);
      res.status(500).json({ error: "サーバーエラー" });
    }
  });
  

//res (サーバーから返すデータ)
//req (フロントエンドから送られるデータ)
// 教員登録API
app.post('/api/teachers', async (req, res) => {
    const { id, name, password, post } = req.body;
  
    if (!id || !name || !password || !post) {
      return res.status(400).json({ message: '全ての項目を入力してください' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // ← これを追加！
  
      await pool.query(
        `INSERT INTO users (user_id, name, password, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [id, name, hashedPassword, post]
      );
  
      res.json({ message: '教員を登録しました' });
    } catch (err) {
      console.error('教員登録エラー:', err);
      res.status(500).json({ message: 'サーバーエラー' });
    }
  });

// 教員一覧取得API
app.get('/api/teachers', async (req, res) => {
  try {
      const result = await pool.query(
          "SELECT user_id AS id, name, role AS post FROM users"
      );
      res.json(result.rows);
  } catch (err) {
      console.error('教員一覧取得エラー:', err);
      res.status(500).json({ message: 'サーバーエラー' });
  }
});

//削除用API
app.delete('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  console.log("削除リクエストを受け取ったID:", id);  // 追加確認用

  // 管理者ユーザーを保護
  if (id === 'koutoukanri') {
      return res.status(403).json({ message: '管理者ユーザーは削除できません！' });
  }

  try {
      //IDが存在するか確認
      const result = await pool.query(
          "SELECT * FROM users WHERE user_id = $1", [id]
      );
      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'ユーザーが見つかりません' });
      }

      await pool.query(
          "DELETE FROM users WHERE user_id = $1",
          [id]
      );
      res.json({ message: '教員を削除しました' });
  } catch (err) {
      console.error('削除エラー:', err);
      res.status(500).json({ message: 'サーバーエラーで削除できませんでした' });
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
          SELECT * FROM timecard
          WHERE TO_CHAR(clock_in_time, 'YYYY-MM') = $1`;
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
