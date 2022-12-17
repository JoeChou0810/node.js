// install mysql2

const mysql2 = require("mysql2/promise");

(async () => {
  const connection = await mysql2.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database: "stock_mfee31",
  });


  let result = await connection.query('SELECT * FROM `stocks`');
  let data = result[0]
  console.log(data);

  connection.end(); // 結束連結(database)
})();

