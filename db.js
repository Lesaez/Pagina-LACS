const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "inventario",
  decimalNumbers: true   
});

connection.connect(err => {
  if (err) {
    console.error("Error conexión DB:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

module.exports = connection;