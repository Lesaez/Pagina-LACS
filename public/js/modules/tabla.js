import { getActivos, deleteActivo } from "../api.js";
import { activosGlobal, setActivos, filtroTipoActual } from "./estado.js";
import { abrirDetalle } from "./detalle.js";
import { abrirEditar } from "./editar.js";

const tablaBody = document.getElementById("tablaBody");
const buscador = document.getElementById("buscador");
const ordenGeneral = document.getElementById("ordenGeneral");

export async function cargar() {

  const data = await getActivos();
  setActivos(data);

  renderizar();
}

export function renderizar() {

  tablaBody.innerHTML = "";

  const texto = buscador.value.toLowerCase();

  let filtrado = activosGlobal.filter(a =>
    (a.nombre || "").toLowerCase().includes(texto) ||
    (a.placa || "").toString().includes(texto) ||
    (a.ubicacion || "").toLowerCase().includes(texto)
  );

  if (filtroTipoActual) {

    if (filtroTipoActual === "sin_tipo") {
      filtrado = filtrado.filter(a => !a.tipo_id);
    } else {
      filtrado = filtrado.filter(a => a.tipo_id == filtroTipoActual);
    }

  }

  switch (ordenGeneral.value) {

    case "nombre_az":
      filtrado.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;

    case "nombre_za":
      filtrado.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;

    case "placa_asc":
      filtrado.sort((a, b) => Number(a.placa) - Number(b.placa));
      break;

    case "placa_desc":
      filtrado.sort((a, b) => Number(b.placa) - Number(a.placa));
      break;

    case "valor_asc":
      filtrado.sort((a, b) => (a.valor || 0) - (b.valor || 0));
      break;

    case "valor_desc":
      filtrado.sort((a, b) => (b.valor || 0) - (a.valor || 0));
      break;
  }

  filtrado.forEach((a, index) => {

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${a.placa}</td>
      <td>${a.nombre}</td>
      <td>${a.tipo_nombre || ""}</td>
      <td>${a.ubicacion || ""}</td>
      <td>${a.valor ? "$ " + Number(a.valor).toLocaleString("es-CO") : ""}</td>
      <td>
        <button class="btn btn-primary btn-editar">Editar</button>
        <button class="btn btn-danger btn-eliminar">Eliminar</button>
      </td>
    `;

    fila.addEventListener("click", () => abrirDetalle(a));

    fila.querySelector(".btn-editar").addEventListener("click", e => {
      e.stopPropagation();
      abrirEditar(a);
    });

    fila.querySelector(".btn-eliminar").addEventListener("click", async e => {

      e.stopPropagation();

      if (confirm("¿Eliminar este activo?")) {

        await deleteActivo(a.id);
        cargar();
      }

    });

    tablaBody.appendChild(fila);

  });

}