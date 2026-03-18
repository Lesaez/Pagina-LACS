const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ==================================================
   ACTIVOS
================================================== */

// GET TODOS
app.get("/api/activos", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT a.*, t.nombre AS tipo_nombre
      FROM activos a
      LEFT JOIN tipos t ON a.tipo_id = t.id
      ORDER BY a.nombre ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener activos" });
  }
});

// CREAR
app.post("/api/activos", async (req, res) => {
  try {
    const d = req.body;

    await db.promise().query(`
      INSERT INTO activos
      (etiqueta_original, placa, nombre, tipo_id, ubicacion,
       nit_resp, nombre_resp, nit_administrador, administrador,
       fecha_entrada, organiz, nombre_ccosto, marca, modelo, serie, valor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      d.etiqueta_original || null,
      d.placa || null,
      d.nombre || null,
      d.tipo_id || null,
      d.ubicacion || null,
      d.nit_resp || null,
      d.nombre_resp || null,
      d.nit_administrador || null,
      d.administrador || null,
      d.fecha_entrada || null,
      d.organiz || null,
      d.nombre_ccosto || null,
      d.marca || null,
      d.modelo || null,
      d.serie || null,
      d.valor || null
    ]);

    res.json({ mensaje: "Activo creado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear activo" });
  }
});

// EDITAR
app.put("/api/activos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const d = req.body;

    await db.promise().query(`
      UPDATE activos SET
      etiqueta_original=?, placa=?, nombre=?, tipo_id=?,
      ubicacion=?, nit_resp=?, nombre_resp=?, nit_administrador=?,
      administrador=?, fecha_entrada=?, organiz=?, nombre_ccosto=?,
      marca=?, modelo=?, serie=?, valor=?
      WHERE id=?
    `, [
      d.etiqueta_original || null,
      d.placa || null,
      d.nombre || null,
      d.tipo_id || null,
      d.ubicacion || null,
      d.nit_resp || null,
      d.nombre_resp || null,
      d.nit_administrador || null,
      d.administrador || null,
      d.fecha_entrada || null,
      d.organiz || null,
      d.nombre_ccosto || null,
      d.marca || null,
      d.modelo || null,
      d.serie || null,
      d.valor || null,
      id
    ]);

    res.json({ mensaje: "Activo actualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar activo" });
  }
});

// ELIMINAR
app.delete("/api/activos/:id", async (req, res) => {
  try {
    await db.promise().query("DELETE FROM activos WHERE id=?", [req.params.id]);
    res.json({ mensaje: "Activo eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar activo" });
  }
});

/* ==================================================
   TIPOS
================================================== */

// GET
app.get("/api/tipos", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM tipos ORDER BY nombre ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tipos" });
  }
});

// CREAR
app.post("/api/tipos", async (req, res) => {
  try {
    await db.promise().query("INSERT INTO tipos (nombre) VALUES (?)", [req.body.nombre]);
    res.json({ mensaje: "Tipo creado" });
  } catch (err) {
    res.status(500).json({ error: "Error al crear tipo" });
  }
});

// EDITAR
app.put("/api/tipos/:id", async (req, res) => {
  try {
    await db.promise().query(
      "UPDATE tipos SET nombre=? WHERE id=?",
      [req.body.nombre, req.params.id]
    );
    res.json({ mensaje: "Tipo actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar tipo" });
  }
});

// ELIMINAR
app.delete("/api/tipos/:id", async (req, res) => {
  try {
    await db.promise().query("UPDATE activos SET tipo_id=NULL WHERE tipo_id=?", [req.params.id]);
    await db.promise().query("DELETE FROM tipos WHERE id=?", [req.params.id]);
    res.json({ mensaje: "Tipo eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar tipo" });
  }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));