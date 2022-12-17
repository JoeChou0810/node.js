// const { request, response } = require('express');
const express = require("express");
// 利用 express 這個框架建立一個 web app
const app = express();

// 中間件
app.use((request, response, next) => {
  console.log("this is middleware A");
  next();
});

app.use((request, response, next) => {
  console.log("this is middleware B");
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

app.get("/test", (request, response) => {
  console.log("this is test index");
  response.send("這是 test 首頁");
});

// 利用中間件的執行序特性來處理不存在的路由(網址)
app.use((request, response, next) => {
  console.log("there is 404");
  response.send("404 no found");
  next();
});
app.listen(3001, () => {
  console.log("Server running at port 3001");
});
