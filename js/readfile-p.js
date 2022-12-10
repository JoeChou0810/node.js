const fs = require('fs');

let p = new Promise((resolve, reject) => {
    fs.readFile('test.txt','utf-8', (err, data)=>{
        if(err){
            reject('錯誤發生了');
        }else{
            resolve('成功讀到資料'+ data)
        }
    });
});

p.then((data)=>{
    console.log(data)
}).catch((err)=>{
    console.error(err)
});



