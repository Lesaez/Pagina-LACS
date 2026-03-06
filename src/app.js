const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const activosRoutes = require("./routes/activos.routes");
const tiposRoutes = require("./routes/tipos.routes");
const exportRoutes = require("./routes/export.routes");
const solicitudRoutes = require("./routes/solicitud.routes");
const horasRoutes = require("./routes/horas.routes"); 
const archivoRoutes = require("./routes/archivo.routes");
const { errorHandler } = require("./middlewares/error.middleware");
const reporteDaniosRoutes = require("./routes/reporte-danos.routes");

const app = express();

app.use(cors());
app.use(express.json());

// ================= RUTAS API =================

app.use("/api/activos", activosRoutes);
app.use("/api/tipos", tiposRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/solicitud", solicitudRoutes);
app.use("/api/horas-extra", horasRoutes); 
app.use("/api/archivo-audiovisual", archivoRoutes);
app.use("/api/reporte-danos", reporteDaniosRoutes);

// ================= PAGINA INICIAL =================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

// ================= STATIC =================

app.use(express.static(path.join(__dirname, "../public")));

// ================= ERRORES =================

app.use(errorHandler);

module.exports = app;