const db = require("../config/database");

/* ================= GET ALL ================= */

exports.getAll = async () => {

  // Tipos normales
  const [tipos] = await db.query(`
    SELECT t.*, 
           COUNT(a.id) AS total_activos
    FROM tipos t
    LEFT JOIN activos a ON a.tipo_id = t.id
    GROUP BY t.id
    ORDER BY t.nombre ASC
  `);

  // Activos sin tipo
  const [[sinTipo]] = await db.query(`
    SELECT COUNT(*) AS total
    FROM activos
    WHERE tipo_id IS NULL
  `);

  return {
    tipos,
    sinTipo: sinTipo.total
  };
};

/* ================= CREATE ================= */

exports.create = async (nombre) => {

  if (!nombre) {
    throw new Error("Nombre requerido");
  }

  // Verifica si ya existe
  const [existe] = await db.query(
    "SELECT id FROM tipos WHERE nombre = ?",
    [nombre]
  );

  if (existe.length > 0) {
    return {
      id: existe[0].id,
      nombre
    };
  }

  // Inserta nuevo tipo
  const [result] = await db.query(
    "INSERT INTO tipos (nombre) VALUES (?)",
    [nombre]
  );

  return {
    id: result.insertId,
    nombre
  };
};