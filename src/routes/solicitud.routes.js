const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const db = require("../config/database");

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
const codigo = await generarCodigo("SDL");

const html = `
<h2>Solicitud de licencia</h2>
<h3>Código: ${codigo}</h3>

<b>Software:</b> ${data.software}<br>
<b>Responsable:</b> ${data.responsable}<br>
<b>Justificación:</b> ${data.justificacion}
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
  subject:`Licencia ${codigo}`,
  html
});

res.json({ok:true,codigo});

}catch(err){
console.error(err);
res.status(500).json({error:"Error"});
}
});

module.exports = router;