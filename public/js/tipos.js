import { filtrarPorTipo } from "./main.js";

const modalTipos = document.getElementById("modalTipos");
const listaTipos = document.getElementById("listaTipos");
const btnCerrarTipos = document.getElementById("btnCerrarTipos");

export async function abrirTipos() {
  listaTipos.innerHTML = "";

  const res = await fetch("/api/tipos");
  const tipos = await res.json();

  tipos.forEach(tipo => {
    const div = document.createElement("div");
    div.classList.add("tipo-header");
    div.textContent = `${tipo.nombre} (${tipo.total_activos})`;

    div.addEventListener("click", () => {
      filtrarPorTipo(tipo.id);
      cerrarTipos();
    });

    listaTipos.appendChild(div);
  });

  modalTipos.classList.add("active");
}

function cerrarTipos() {
  modalTipos.classList.remove("active");
}

btnCerrarTipos.addEventListener("click", cerrarTipos);

modalTipos.addEventListener("click", (e) => {
  if (e.target === modalTipos) cerrarTipos();
});