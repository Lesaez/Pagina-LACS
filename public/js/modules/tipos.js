import { getTipos } from "../api.js";
import { renderizar } from "./tabla.js";
import { setFiltroTipo } from "./estado.js";

const btnVerTipos = document.getElementById("btnVerTipos");
const modalTipos = document.getElementById("modalTipos");
const btnCerrarTipos = document.getElementById("btnCerrarTipos");
const listaTipos = document.getElementById("listaTipos");

const filtroActivoBox = document.getElementById("filtroActivoBox");
const textoFiltroActivo = document.getElementById("textoFiltroActivo");
const btnQuitarFiltro = document.getElementById("btnQuitarFiltro");

export function iniciarTipos(){

  btnVerTipos.addEventListener("click", abrirTipos);

  btnCerrarTipos.addEventListener("click", () =>
    modalTipos.classList.remove("active")
  );

  btnQuitarFiltro.addEventListener("click", () => {

    setFiltroTipo(null);
    filtroActivoBox.classList.add("hidden");
    renderizar();

  });

}

async function abrirTipos(){

  const data = await getTipos();
  const tipos = data.tipos;

  listaTipos.innerHTML = "";

  if (data.sinTipo > 0) {

    const card = document.createElement("div");
    card.className = "tipo-card";

    card.innerHTML = `
      <div class="tipo-info">
        <div class="tipo-nombre">Sin tipo asignado</div>
        <div class="tipo-total">${data.sinTipo} activos</div>
      </div>
      <button class="btn btn-primary">Ver</button>
    `;

    card.querySelector("button").addEventListener("click", () => {

      setFiltroTipo("sin_tipo");

      textoFiltroActivo.textContent = `Filtrado por: Sin tipo asignado`;

      filtroActivoBox.classList.remove("hidden");
      modalTipos.classList.remove("active");

      renderizar();

    });

    listaTipos.appendChild(card);

  }

  tipos.forEach(t => {

    const card = document.createElement("div");

    card.className = "tipo-card";

    card.innerHTML = `
      <div class="tipo-info">
        <div class="tipo-nombre">${t.nombre}</div>
        <div class="tipo-total">${t.total_activos || 0} activos</div>
      </div>
      <button class="btn btn-primary">Ver</button>
    `;

    card.querySelector("button").addEventListener("click", () => {

      setFiltroTipo(t.id);

      textoFiltroActivo.textContent = `Filtrado por: ${t.nombre}`;

      filtroActivoBox.classList.remove("hidden");
      modalTipos.classList.remove("active");

      renderizar();

    });

    listaTipos.appendChild(card);

  });

  modalTipos.classList.add("active");

}