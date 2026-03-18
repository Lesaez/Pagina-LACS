const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const db = require("../config/database");

/* GENERADOR */
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

router.post("/", async (req, res) => {
try{

const data = req.body;
const codigo = await generarCodigo("RHE");

/* TABLA HTML */
let filas = "";
data.horas.forEach(h => {
  filas += `
  <tr>
    <td>${h.fecha}</td>
    <td>${h.motivo}</td>
    <td>${h.desde}</td>
    <td>${h.hasta}</td>
  </tr>`;
});

const html = `
<h2>Registro de horas extra</h2>
<h3>Código: ${codigo}</h3>

<b>Trabajador:</b> ${data.trabajador}<br>
<b>Documento:</b> ${data.documento}<br>

<table border="1">
<tr>
<th>Fecha</th>
<th>Motivo</th>
<th>Desde</th>
<th>Hasta</th>
</tr>
${filas}
</table>
`;

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
  subject:`Horas extra ${codigo}`,
  html
});

res.json({ok:true,codigo});

}catch(err){
console.error(err);
res.status(500).json({error:"Error"});
}
});

module.exports = router;