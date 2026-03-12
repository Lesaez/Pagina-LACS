const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req,res)=>{

try{

const data = req.body;

const transporter = nodemailer.createTransport({
service:"gmail",
auth:{
user:process.env.EMAIL_USER,
pass:process.env.EMAIL_PASS
}
});

const html = `
<h2>Solicitud - Unidad de Archivo Audiovisual</h2>

<table border="1" cellpadding="8" cellspacing="0">

<tr>
<th>Nombre del Proyecto</th>
<td>${data.proyecto}</td>
</tr>

<tr>
<th>Realizador del Proyecto</th>
<td>${data.realizador}</td>
</tr>

<tr>
<th>Datos de contacto</th>
<td>${data.contacto}</td>
</tr>

<tr>
<th>Aprobador de contenido</th>
<td>${data.aprobador}</td>
</tr>

<tr>
<th>Fecha de entrega</th>
<td>${data.fecha}</td>
</tr>

<tr>
<th>Ventana de exhibición</th>
<td>${data.ventana}</td>
</tr>

<tr>
<th>Descripción de la necesidad</th>
<td>${data.descripcion}</td>
</tr>

<tr>
<th>Descripción técnica</th>
<td>${data.descripcionTecnica}</td>
</tr>

</table>
`;

await transporter.sendMail({

from:process.env.EMAIL_USER,

to:"cbarriosm@uninorte.edu.co",

subject:"Nueva solicitud - Archivo Audiovisual",

html

});

res.json({ok:true});

}catch(err){

console.error(err);

res.status(500).json({error:"Error enviando correo"});

}

});

module.exports = router;