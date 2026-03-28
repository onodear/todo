//APIを作るためのフレームワークを読み込む
const express = require("express");
//フロントからのアクセスを許可する仕組みを読み込む
const cors = require("cors");

//expressアプリの初期設定
const app = express();
//ブラウザからのアクセスを許可
app.use(cors());
app.use(express.json());

// サーバーが起動してるかの動作確認用
app.get("/", (req, res) => {
    res.send("API is running");
});

//postgreSQLの接続情報を書く
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


// フロントから送られてきたtodosを受け取る
app.post("/todos", async (req, res) => {
  const { text, time } = req.body;

  //SQLを実行する。ここではDBに格納している
  // $1,$2で入力がsqlの一部分にならないようにして変なsqlが実行されないようにしている
  try {
    await pool.query(
      "INSERT INTO todo (text, time) VALUES ($1, $2)",
      [text, time]
    );
    //成功したらsaved,失敗したらDB errorを返す
    res.json({ message: "saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// DBからtodoテーブルの全データを取得
app.get("/todos", async (req, res) => {
  try {
    //テーブルを取得して新しい順に並べる
    const result = await pool.query("SELECT * FROM todo ORDER BY id DESC");
    //フロントにJSONとして返す
    res.json(result.rows);
    //エラーをキャッチしたらエラーコード500のdbエラーを返す
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

//urlのidを取り出す
app.delete("/todos/:id", async (req,res) => {
  const id = req.params.id;
  
  //sqlでidのデータを削除する
  try{
    await pool.query(
      "DELETE FROM todo WHERE id = $1", [id]
    );
    //成功したらdeleteを返す
    res.json({ message: "delete"});
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
})

//サーバーをポート3000で起動してhttp://localhost:3000でアクセスできるようにしている
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
