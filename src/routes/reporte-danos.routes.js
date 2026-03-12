const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const multer = require("multer");

/* ================= MULTER ================= */

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage
});

/* ================= RUTA ================= */

router.post("/", upload.single("foto"), async (req, res) => {
try {
const { nombre, documento, jefe, activo, descripcion } = req.body;

/* ================= TRANSPORTER ================= */

const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS
}
});

/* ================= HTML CORREO ================= */

const html = `

<h2>Reporte de daños - LACS</h2>

<table border="1" cellpadding="8" cellspacing="0">

<tr>
<th>Nombre</th>
<td>${nombre}</td>
</tr>

<tr>
<th>Documento</th>
<td>${documento}</td>
</tr>

<tr>
<th>Nombre del jefe</th>
<td>${jefe}</td>
</tr>

<tr>
<th>Número de activo</th>
<td>${activo || "No especificado"}</td>
</tr>

<tr>
<th>Descripción</th>
<td>${descripcion}</td>
</tr>

</table>
`;

/* ================= ADJUNTOS ================= */

let attachments = [];
if (req.file) {
attachments.push({
filename: req.file.originalname,
content: req.file.buffer
});
}

/* ================= ENVIAR CORREO ================= */

await transporter.sendMail({
from: process.env.EMAIL_USER,
to: "cbarriosm@uninorte.edu.co",
subject: "Reporte de daños de activos - LACS",
html: html,
attachments: attachments
});
res.json({ ok: true });
} catch (error) {
console.error(error);
res.status(500).json({ error: "Error enviando correo" });
}
});
module.exports = router;