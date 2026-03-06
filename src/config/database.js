const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "inventario",
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado correctamente a MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ Error conectando a MySQL:");
    console.error(error);
  }
})();

module.exports = pool;