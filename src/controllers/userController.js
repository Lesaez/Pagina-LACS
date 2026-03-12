const db = require("../config/database");


/* ================= OBTENER USUARIOS ================= */

exports.getUsers = async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT id, nombre, email, role FROM users ORDER BY id"
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo usuarios"
    });

  }

};



/* ================= CAMBIAR ROL ================= */

exports.updateRole = async (req, res) => {

  const { id } = req.params;
  const { role } = req.body;

  try {

    await db.query(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, id]
    );

    res.json({
      message: "Rol actualizado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error actualizando rol"
    });

  }

};