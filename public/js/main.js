import { cargar } from "./modules/tabla.js";
import { iniciarFiltros } from "./modules/filtros.js";
import { iniciarTipos } from "./modules/tipos.js";
import { iniciarDetalle } from "./modules/detalle.js";
import { iniciarEditar } from "./modules/editar.js";
import { iniciarExportar } from "./modules/exportar.js";

document.addEventListener("DOMContentLoaded", () => {

  iniciarFiltros();
  iniciarTipos();
  iniciarDetalle();
  iniciarEditar();
  iniciarExportar();

  cargar();

});