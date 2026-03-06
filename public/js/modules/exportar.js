export function iniciarExportar(){

  const btnExportar = document.getElementById("btnExportar");

  if (!btnExportar) return;

  btnExportar.addEventListener("click", async () => {

    try {

      const response = await fetch("/api/export/excel");

      if (!response.ok) {
        throw new Error("Error generando Excel");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "inventario_general.xlsx";

      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {

      console.error("Error exportando:", error);

      alert("No se pudo generar el archivo Excel");

    }

  });

}