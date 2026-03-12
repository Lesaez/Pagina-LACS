const bcrypt = require("bcryptjs");
const db = require("../config/database");

/* ================= REGISTER ================= */

exports.registerUser = async (req, res) => {

  const { nombre, telefono, email, password } = req.body;

  try {

    if (!email.endsWith("@uninorte.edu.co")) {
      return res.status(400).json({
        error: "Solo correos @uninorte.edu.co"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (nombre, telefono, email, password) VALUES (?, ?, ?, ?)",
      [nombre, telefono, email, hash]
    );

    res.json({
      message: "Usuario registrado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error registrando usuario"
    });

  }

};

/* ================= LOGIN ================= */

exports.loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "Login correcto",
      user: {
        id: user.id,
        nombre: user.nombre,
        role: user.role
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error en login"
    });

  }

};