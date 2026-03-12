const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {

try {

const data = req.body;

let filas = "";

data.horas.forEach(h => {

filas += `
<tr>
<td>${h.fecha}</td>
<td>${h.motivo}</td>
<td>${h.desde}</td>
<td>${h.hasta}</td>
</tr>
`;

});


const html = `

<h2>Registro de horas extra - LACS</h2>

<h3>Datos del trabajador</h3>

<b>Nombre:</b> ${data.trabajador}<br>
<b>Documento:</b> ${data.documento}<br>
<b>Centro de costo:</b> ${data.centroCosto}<br>

<br>

<h3>Datos de quien autoriza</h3>

<b>Autoriza:</b> ${data.autoriza}<br>
<b>Cargo:</b> ${data.cargo}<br>

<br>

<h3>Registro de horas</h3>

<table border="1" cellpadding="6" cellspacing="0">

<tr style="background:#18335e;color:white">

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
subject:"Registro de horas extra LACS",
html

});

res.json({ok:true});

}catch(error){

console.error(error);
res.status(500).json({error:"Error enviando correo"});

}

});

module.exports = router;