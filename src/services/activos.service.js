const db = require("../config/database");

exports.getAll = async () => {
  const [rows] = await db.query(`
    SELECT a.*, t.nombre AS tipo_nombre
    FROM activos a
    LEFT JOIN tipos t ON a.tipo_id = t.id
    ORDER BY a.nombre ASC
  `);
  return rows;
};

exports.create = async (data) => {
  await db.query(`
    INSERT INTO activos
    (etiqueta_original, placa, nombre, tipo_id, ubicacion,
     nit_resp, nombre_resp, nit_administrador, administrador,
     fecha_entrada, organiz, nombre_ccosto, marca, modelo, serie, valor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, Object.values(data));
};

exports.update = async (id, data) => {
  await db.query(`
    UPDATE activos SET
    etiqueta_original=?, placa=?, nombre=?, tipo_id=?,
    ubicacion=?, nit_resp=?, nombre_resp=?, nit_administrador=?,
    administrador=?, fecha_entrada=?, organiz=?, nombre_ccosto=?,
    marca=?, modelo=?, serie=?, valor=?
    WHERE id=?
  `, [...Object.values(data), id]);
};

exports.remove = async (id) => {
  await db.query("DELETE FROM activos WHERE id=?", [id]);
};