// 1. 安裝 npm i axios
// 2. 引用 require
// 3. 去讀官方文件
const axios = require("axios");
const fs = require('fs');

// Promise 是一個表示非同步運算的最終完成或失敗的物件。
let p = new Promise((resolve, reject) => {
  // error-first callback
  fs.readFile('stock.txt', 'utf-8', (err, data) => {
    if (err) {
      // 如果 err 有值，表示有錯誤發生
      // 這裡應該要處理錯誤
      reject(err);
      // console.error('發生錯誤了', err);
    } else {
      // 進來這裡，表示 err 是空的 (可能是 null)
      resolve(data);
      // console.log('成功讀到資料:', data);
    }
  });
});

(async () => {
  try {
    let stockNo = await p;
    let date = "202211";
    let response = await axios.get(`http://54.71.133.152:3000/stocks`, {
      params: {
        stockNo,
        date,
      },
    });
    console.log('await',response.data);
  } catch (err) {
    console.error(err);
  }
})();