import { createActivo, updateActivo, getTipos } from "../api.js";
import { cargar } from "./tabla.js";
import { editId, setEditId } from "./estado.js";

const modalEditar = document.getElementById("modalEditar");
const btnCerrarEditar = document.getElementById("btnCerrarEditar");
const form = document.getElementById("inventarioForm");
const tituloModal = document.getElementById("tituloModal");
const btnNuevo = document.getElementById("btnNuevo");
const TIPO_ID = document.getElementById("TIPO_ID");

export function iniciarEditar() {

  btnNuevo.addEventListener("click", () => abrirEditar());

  btnCerrarEditar.addEventListener("click", () =>
    modalEditar.classList.remove("active")
  );

  form.addEventListener("submit", guardar);

  TIPO_ID.addEventListener("change", nuevoTipo);

}

/* ================= CARGAR TIPOS ================= */

async function cargarTiposSelect(selectedId = null) {

  const data = await getTipos();
  const tipos = data.tipos;

  TIPO_ID.innerHTML = `<option value="">Seleccionar tipo...</option>`;

  tipos.forEach(t => {

    const option = document.createElement("option");

    option.value = t.id;
    option.textContent = t.nombre;

    if (selectedId && selectedId == t.id) option.selected = true;

    TIPO_ID.appendChild(option);

  });

  const nueva = document.createElement("option");

  nueva.value = "nuevo";
  nueva.textContent = "➕ Añadir nuevo tipo";

  TIPO_ID.appendChild(nueva);

}

/* ================= ABRIR EDITAR ================= */

export async function abrirEditar(a = null) {

  await cargarTiposSelect(a?.tipo_id);

  if (a) {

    setEditId(a.id);

    tituloModal.textContent = "Editar Activo";

    ETIQUETA_ORIGINAL.value = a.etiqueta_original || "";
    PLACA.value = a.placa || "";
    NOMBRE_DEL_ACTIVO.value = a.nombre || "";
    UBICACION.value = a.ubicacion || "";
    NIT_RESP.value = a.nit_resp || "";
    NOMBRE_RESP.value = a.nombre_resp || "";
    NIT_ADMINISTRADOR.value = a.nit_administrador || "";
    ADMINISTRADOR.value = a.administrador || "";
    FECHA_ENTRADA.value = a.fecha_entrada ? a.fecha_entrada.split("T")[0] : "";
    ORGANIZ.value = a.organiz || "";
    NOMBRE_CCOSTO.value = a.nombre_ccosto || "";
    MARCA.value = a.marca || "";
    MODELO.value = a.modelo || "";
    SERIE.value = a.serie || "";
    VALOR.value = a.valor || "";

  } else {

    setEditId(null);

    tituloModal.textContent = "Nuevo Activo";

    form.reset();

  }

  modalEditar.classList.add("active");

}

/* ================= NUEVO TIPO ================= */

async function nuevoTipo() {

  if (TIPO_ID.value === "nuevo") {

    const nombre = prompt("Nombre del nuevo tipo:");

    if (!nombre) return;

    const res = await fetch("/api/tipos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre })
    });

    const nuevo = await res.json();

    await cargarTiposSelect(nuevo.id);

  }

}

/* ================= GUARDAR ================= */

async function guardar(e) {

  e.preventDefault();

  const data = {
    etiqueta_original: ETIQUETA_ORIGINAL.value,
    placa: PLACA.value,
    nombre: NOMBRE_DEL_ACTIVO.value,
    tipo_id: TIPO_ID.value || null,
    ubicacion: UBICACION.value,
    nit_resp: NIT_RESP.value,
    nombre_resp: NOMBRE_RESP.value,
    nit_administrador: NIT_ADMINISTRADOR.value,
    administrador: ADMINISTRADOR.value,
    fecha_entrada: FECHA_ENTRADA.value || null,
    organiz: ORGANIZ.value,
    nombre_ccosto: NOMBRE_CCOSTO.value,
    marca: MARCA.value,
    modelo: MODELO.value,
    serie: SERIE.value,
    valor: VALOR.value || null
  };

  if (editId) {

    await updateActivo(editId, data);

  } else {

    await createActivo(data);

  }

  modalEditar.classList.remove("active");

  cargar();

}