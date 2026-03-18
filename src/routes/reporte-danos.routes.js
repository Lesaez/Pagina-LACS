const express = require("express"); 
const router = express.Router();
const nodemailer = require("nodemailer");
const multer = require("multer");
const db = require("../config/database");

const upload = multer({ storage: multer.memoryStorage() });

/* ================= GENERADOR SIMPLE ================= */

async function generarCodigo(tipo){

  const [rows] = await db.query(
    "SELECT numero FROM consecutivos WHERE tipo = ?",
    [tipo]
  );

  let numero = rows[0].numero + 1;

  await db.query(
    "UPDATE consecutivos SET numero = ? WHERE tipo = ?",
    [numero, tipo]
  );

  return tipo + String(numero).padStart(6, "0");
}

/* ================= RUTA ================= */

router.post("/", upload.single("foto"), async (req, res) => {
try{

const { nombre, documento, jefe, activo, descripcion } = req.body;

/* 🔥 SOLO GENERAMOS CODIGO */
const codigo = await generarCodigo("RDL");

/* ================= HTML ================= */

const html = `
<h2>Reporte de daños - LACS</h2>

<h3>Código: ${codigo}</h3>

<b>Nombre:</b> ${nombre}<br>
<b>Documento:</b> ${documento}<br>
<b>Jefe:</b> ${jefe}<br>
<b>Activo:</b> ${activo}<br>
<b>Descripción:</b> ${descripcion}
`;

/* ================= ADJUNTO ================= */

let attachments = [];

if (req.file) {
  attachments.push({
    filename: req.file.originalname,
    content: req.file.buffer
  });
}

/* ================= EMAIL ================= */

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
  }
});

await transporter.sendMail({
  from:process.env.EMAIL_USER,
  to:"cbarriosm@uninorte.edu.co",
  subject:`Reporte ${codigo}`,
  html,
  attachments
});

res.json({ ok:true, codigo });

}catch(err){
console.error(err);
res.status(500).json({error:"Error"});
}
});

module.exports = router;