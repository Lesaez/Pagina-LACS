import { state } from "./state.js";
import { deleteActivo } from "./api.js";

const tablaBody = document.getElementById("tablaBody");

export function renderTable() {
  tablaBody.innerHTML = "";

  if (!state.activos || state.activos.length === 0) {
    tablaBody.innerHTML = `
      <tr>
        <td colspan="6">No hay activos registrados</td>
      </tr>
    `;
    return;
  }

  state.activos.forEach(activo => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${activo.placa || ""}</td>
      <td>${activo.nombre || ""}</td>
      <td>${activo.tipo_nombre || ""}</td>
      <td>${activo.ubicacion || ""}</td>
      <td>${activo.valor ? "$ " + Number(activo.valor).toLocaleString("es-CO") : ""}</td>
      <td>
        <button class="btn btn-danger btn-eliminar">Eliminar</button>
      </td>
    `;

    fila.querySelector(".btn-eliminar").addEventListener("click", async (e) => {
      e.stopPropagation();
      await deleteActivo(activo.id);
      location.reload();
    });

    tablaBody.appendChild(fila);
  });
}