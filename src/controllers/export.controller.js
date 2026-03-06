const ExcelJS = require("exceljs");
const db = require("../config/database");

exports.exportExcel = async (req, res, next) => {
  try {

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Inventario General");

    const [activos] = await db.query(`
      SELECT a.*, t.nombre AS tipo_nombre
      FROM activos a
      LEFT JOIN tipos t ON t.id = a.tipo_id
      ORDER BY t.nombre ASC, a.nombre ASC
    `);

    const grupos = {};

    activos.forEach(a => {
      const tipo = a.tipo_nombre || "SIN TIPO ASIGNADO";
      if (!grupos[tipo]) grupos[tipo] = [];
      grupos[tipo].push(a);
    });

    sheet.columns = [
      { header: "Etiqueta", key: "etiqueta_original", width: 18 },
      { header: "Placa", key: "placa", width: 15 },
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Ubicación", key: "ubicacion", width: 25 },
      { header: "Marca", key: "marca", width: 18 },
      { header: "Modelo", key: "modelo", width: 18 },
      { header: "Serie", key: "serie", width: 18 },
      { header: "Valor", key: "valor", width: 15 }
    ];

    for (const tipo in grupos) {

      sheet.addRow([]);
      const tipoRow = sheet.addRow([`TIPO: ${tipo}`]);
      tipoRow.font = { bold: true, size: 14 };

      const headerRow = sheet.addRow(sheet.columns.map(c => c.header));
      headerRow.font = { bold: true };

      grupos[tipo].forEach(a => {
        const row = sheet.addRow(a);
        row.getCell("valor").numFmt = '"$"#,##0';
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventario_general.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    next(error);
  }
};