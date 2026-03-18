const xlsx = require("xlsx");
const db = require("./db");

const archivo = "INVENTARIO GENERAL LACS 2026.xlsx";

const workbook = xlsx.readFile(archivo);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const datos = xlsx.utils.sheet_to_json(sheet, { raw: false });

function convertirFecha(valor) {

  if (!valor) return null;

  // Si es número Excel
  if (!isNaN(valor)) {
    const fecha = new Date((valor - 25569) * 86400 * 1000);
    return fecha.toISOString().split("T")[0];
  }

  // Si es texto tipo 22-AUG-18
  const fecha = new Date(valor);
  if (!isNaN(fecha)) {
    return fecha.toISOString().split("T")[0];
  }

  return null;
}

async function importar() {

  let insertados = 0;
  let errores = 0;

  for (let fila of datos) {

    const {
      ETIQUETA_ORIGINAL,
      PLACA,
      NOMBRE_DEL_ACTIVO,
      UBICACION,
      NIT_RESP,
      NOMBRE_RESP,
      NIT_ADMINISTRADOR,
      ADMINISTRADOR,
      FECHA_ENTRADA,
      ORGANIZ,
      NOMBRE_CCOSTO,
      MARCA,
      MODELO,
      SERIE,
      VALOR
    } = fila;

    if (!PLACA) continue;

    try {

      const fechaFormateada = convertirFecha(FECHA_ENTRADA);

      await db.promise().query(`
        INSERT INTO activos 
        (etiqueta_original, placa, nombre, tipo_id, ubicacion,
         nit_resp, nombre_resp, nit_administrador, administrador,
         fecha_entrada, organiz, nombre_ccosto, marca, modelo, serie, valor)
        VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        ETIQUETA_ORIGINAL || null,
        PLACA,
        NOMBRE_DEL_ACTIVO || null,
        UBICACION || null,
        NIT_RESP || null,
        NOMBRE_RESP || null,
        NIT_ADMINISTRADOR || null,
        ADMINISTRADOR || null,
        fechaFormateada,
        ORGANIZ || null,
        NOMBRE_CCOSTO || null,
        MARCA || null,
        MODELO || null,
        SERIE || null,
        VALOR || 0
      ]);

      insertados++;
      console.log("Insertado:", PLACA);

    } catch (error) {
      errores++;
      console.log("ERROR en placa:", PLACA);
      console.log("Detalle:", error.message);
    }
  }

  console.log("=================================");
  console.log("Importación finalizada");
  console.log("Insertados:", insertados);
  console.log("Errores:", errores);
  console.log("=================================");

  process.exit();
}

importar();