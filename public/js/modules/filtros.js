import { renderizar } from "./tabla.js";

const buscador = document.getElementById("buscador");
const ordenGeneral = document.getElementById("ordenGeneral");

export function iniciarFiltros(){

  buscador.addEventListener("input", renderizar);
  ordenGeneral.addEventListener("change", renderizar);

}