const fs = require('fs');

// error-first callback
fs.readFile('test.txt','utf-8', (err, data)=>{
    if(err){
        // 如果err有值，表示有錯誤發生
        // 這裡應該要處理錯誤
        console.err('錯誤發生了',err);
    }else{
        // 進來這裡，表示 err 是空的 (可可能是 null)
        console.log('成功讀到資料', data)
    }
});