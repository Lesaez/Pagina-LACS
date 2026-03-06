import {
  getActivos,
  createActivo,
  updateActivo,
  deleteActivo,
  getTipos
} from "./api.js";

/* ================= ELEMENTOS ================= */

const tablaBody = document.getElementById("tablaBody");
const buscador = document.getElementById("buscador");
const ordenGeneral = document.getElementById("ordenGeneral");

const btnNuevo = document.getElementById("btnNuevo");
const btnVerTipos = document.getElementById("btnVerTipos");

const modalEditar = document.getElementById("modalEditar");
const btnCerrarEditar = document.getElementById("btnCerrarEditar");
const form = document.getElementById("inventarioForm");
const tituloModal = document.getElementById("tituloModal");

const modalTipos = document.getElementById("modalTipos");
const btnCerrarTipos = document.getElementById("btnCerrarTipos");
const listaTipos = document.getElementById("listaTipos");

const modalDetalle = document.getElementById("modalDetalle");
const btnCerrarDetalle = document.getElementById("btnCerrarDetalle");
const detalleContenido = document.getElementById("detalleContenido");

const filtroActivoBox = document.getElementById("filtroActivoBox");
const textoFiltroActivo = document.getElementById("textoFiltroActivo");
const btnQuitarFiltro = document.getElementById("btnQuitarFiltro");

const TIPO_ID = document.getElementById("TIPO_ID");

/* ================= VARIABLES ================= */

let activosGlobal = [];
let editId = null;
let filtroTipoActual = null;

/* ================= CARGAR ACTIVOS ================= */

async function cargar() {
  activosGlobal = await getActivos();
  renderizar();
}

/* ================= RENDER TABLA ================= */

function renderizar() {
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

/* ================= VER TIPOS ================= */

btnVerTipos.addEventListener("click", async () => {

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

      filtroTipoActual = "sin_tipo";
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

      filtroTipoActual = t.id;

      textoFiltroActivo.textContent = `Filtrado por: ${t.nombre}`;

      filtroActivoBox.classList.remove("hidden");

      modalTipos.classList.remove("active");

      renderizar();
    });

    listaTipos.appendChild(card);
  });

  modalTipos.classList.add("active");
});

btnCerrarTipos.addEventListener("click", () =>
  modalTipos.classList.remove("active")
);

btnQuitarFiltro.addEventListener("click", () => {
  filtroTipoActual = null;
  filtroActivoBox.classList.add("hidden");
  renderizar();
});

/* ================= DETALLE ================= */

function abrirDetalle(a) {

  detalleContenido.innerHTML = `
    <div><strong>Etiqueta:</strong> ${a.etiqueta_original || ""}</div>
    <div><strong>Placa:</strong> ${a.placa}</div>
    <div><strong>Nombre:</strong> ${a.nombre}</div>
    <div><strong>Tipo:</strong> ${a.tipo_nombre || ""}</div>
    <div><strong>Ubicación:</strong> ${a.ubicacion || ""}</div>
    <div><strong>Valor:</strong> ${a.valor ? "$ " + Number(a.valor).toLocaleString("es-CO") : ""}</div>
    <div><strong>Marca:</strong> ${a.marca || ""}</div>
    <div><strong>Modelo:</strong> ${a.modelo || ""}</div>
    <div><strong>Serie:</strong> ${a.serie || ""}</div>
    <div><strong>Administrador:</strong> ${a.administrador || ""}</div>
  `;

  modalDetalle.classList.add("active");
}

btnCerrarDetalle.addEventListener("click", () =>
  modalDetalle.classList.remove("active")
);

/* ================= CARGAR TIPOS SELECT ================= */

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

/* ================= EDITAR ================= */

async function abrirEditar(a = null) {

  await cargarTiposSelect(a?.tipo_id);

  if (a) {

    editId = a.id;

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

    editId = null;
    tituloModal.textContent = "Nuevo Activo";

    form.reset();
  }

  modalEditar.classList.add("active");
}

/* ================= NUEVO TIPO ================= */

TIPO_ID.addEventListener("change", async () => {

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
});

/* ================= GUARDAR ================= */

form.addEventListener("submit", async (e) => {

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
});

/* ================= EVENTOS ================= */

buscador.addEventListener("input", renderizar);
ordenGeneral.addEventListener("change", renderizar);

btnNuevo.addEventListener("click", () => abrirEditar());

btnCerrarEditar.addEventListener("click", () =>
  modalEditar.classList.remove("active")
);

/* ================= EXPORTAR EXCEL ================= */

const btnExportar = document.getElementById("btnExportar");

if (btnExportar) {

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

/* ================= INIT ================= */

cargar();