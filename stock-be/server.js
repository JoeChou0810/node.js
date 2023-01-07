// const { request, response } = require('express');
const { request, response } = require("express");
const express = require("express");
// 利用 express 這個框架建立一個 web app
const app = express();

require("dotenv").config();
const mysql2 = require("mysql2/promise");

let pool = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// 如果要讓 express 認得 json 資料
// request Content-Type: application/json
// 需要加上這個中間件
app.use(express.json());

// 允許跨源存取
// 預設全部開放
// 也可以做部分限制，參考 npm cors 的文件
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

// 設定 express 處理靜態檔案
// express 內建 -> 不需要安裝任何東西
// app.use(express.static("./static"));  // 2048
app.use("/2048", express.static("./static"));

// 中間件
app.use((request, response, next) => {
  // console.log("this is middleware A");
  next();
});

app.use((request, response, next) => {
  // console.log("this is middleware B");
  next();
});

// app.[Method] -> get, post, put, patch, delete, option, head
app.get("/", (request, response) => {
  console.log("this is index");
  response.send("這是首頁");
});

// app.use((request, response, next) => {
//   console.log("this is middleware C");
//   next();
// });

app.get("/api", (request, response) => {
  response.json({
    name: "Joy",
    age: 28,
  });
});

app.get("/api/stocks", async (request, response, next) => {
  // let results = await connection.query('SELECT * FROM stocks');
  // let data = results[0];
  // 解構寫法
  let [data] = await pool.query("SELECT * FROM stocks");
  response.json(data);

  // console.log("這裡是 /api/stocks");
});

app.get("/api/stocks/:stockId", async (request, response, next) => {
  console.log("/api/stocks/:stockId => ", request.params.stockId);

  // 分頁

  // 從前端拿到目前是要第幾頁
  // 通常放在 query string -> req.query.page
  // /api/stocks/:stockId?page=2
  // /api/stocks/:stockId -> 如果page沒有寫 就預設第一頁
  // 如果沒有 page 這個 query string 就預設為 1
  const page = request.query.page || 1;

  // 總筆數？
  let [results] = await pool.execute(
    "SELECT COUNT(*) AS total FROM stock_prices WHERE stock_id=?",
    [request.params.stockId]
  );
  console.log("GET /stocks/details -> count:", results[0].total);
  const total = results[0].total;

  // 共幾頁
  const perPage = 5;
  const totalPage = Math.ceil(total / perPage);

  // 計算 offset, limit (一頁有幾筆)
  const limit = perPage;
  const offset = perPage * (page - 1);

  // 根據 offset, limit 去取得資料
  let [data] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id=? ORDER BY date LIMIT ? OFFSET ?', [request.params.stockId, limit, offset]);

  // 把資料回覆給前端
  response.json({
    pagination:{
      total,
      perPage,
      totalPage,
      page,
    },
    data,
  })

  // 會用 prepared statement 的方式來避免發生 sql injection
  // let [data] = await pool.query("SELECT * FROM stock_prices WHERE stock_id=?", [
  //   request.params.stockId,
  // ]);
  // response.json(data);
});

app.post("/api/stocks/", async (request, response) => {
  console.log("/api/stocks/", request.body);
  // req.body.stockId, req.body.stockName
  // TODO: 完成 insert
  let results = await pool.query(
    "INSERT INTO stocks (id, name) VALUES (? , ?);",
    [request.body.stockId, request.body.stockName]
  );
  console.log("POST stocks results", results);
  response.json({});
});

app.get("/test", (request, response) => {
  console.log("this is test index");
  response.send("這是 test 首頁");
});

// 利用中間件的執行序特性來處理不存在的路由(網址)
app.use((request, response, next) => {
  // console.log("there is 404");
  response.send("404 no found");
  next();
});
app.listen(3001, () => {
  console.log("Server running at port 3001");
});
