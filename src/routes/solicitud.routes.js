const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {

  try {

    const data = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ EMAIL_USER o EMAIL_PASS no definidos en .env");
      return res.status(500).json({ error: "Credenciales de correo no configuradas" });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const html = `
      <h2>Nueva solicitud de licencia</h2>

      <b>Software:</b> ${data.software}<br>
      <b>Link:</b> ${data.link}<br>
      <b>Costo:</b> ${data.costo}<br>
      <b>Cantidad de licencias:</b> ${data.licencias}<br>
      <b>Justificación:</b> ${data.justificacion}<br>
      <b>Activo:</b> ${data.activo}<br>
      <b>Responsable:</b> ${data.responsable}<br>
      <b>Periodo:</b> ${data.periodo}<br>
      <b>Centro de costos:</b> ${data.centroCosto}<br>
      <b>Jefe inmediato:</b> ${data.jefe}
    `;

    await transporter.sendMail({
      from: `"Solicitud Licencias LACS" <${process.env.EMAIL_USER}>`,
      to: "cbarriosm@uninorte.edu.co, lesaez@uninorte.edu.co",
      subject: "Nueva solicitud de licencia",
      html
    });

    res.json({ ok: true });

  } catch (error) {

    console.error("❌ ERROR ENVIANDO CORREO:");
    console.error(error);

    res.status(500).json({
      error: "Error enviando correo",
      details: error.message
    });

  }

});

module.exports = router;