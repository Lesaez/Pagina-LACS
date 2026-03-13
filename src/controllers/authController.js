const bcrypt = require("bcryptjs");
const db = require("../config/database");


/* ================= REGISTER ================= */

exports.registerUser = async (req, res) => {

  const { nombre, telefono, email, password } = req.body;

  try {

    /* validar campos */

    if(!nombre || !telefono || !email || !password){

      return res.status(400).json({
        error:"Todos los campos son obligatorios"
      });

    }

    /* validar dominio */

    if (!email.endsWith("@uninorte.edu.co")) {

      return res.status(400).json({
        error: "Solo se permiten correos @uninorte.edu.co"
      });

    }

    /* verificar si el usuario ya existe */

    const [exist] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if(exist.length > 0){

      return res.status(400).json({
        error:"Este correo ya está registrado"
      });

    }

    /* encriptar contraseña */

    const hash = await bcrypt.hash(password, 10);

    /* guardar usuario */

    await db.query(
      "INSERT INTO users (nombre, telefono, email, password, role) VALUES (?, ?, ?, ?, 'user')",
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

    /* buscar usuario */

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {

      return res.status(401).json({
        error: "Usuario no encontrado"
      });

    }

    const user = rows[0];

    /* comparar contraseña */

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {

      return res.status(401).json({
        error: "Contraseña incorrecta"
      });

    }

    /* login correcto */

    res.json({

      message: "Login correcto",

      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
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