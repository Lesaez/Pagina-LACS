let activos = [];
let tipos = [];
let editId = null;

const tablaBody = document.getElementById("tablaBody");
const filtroTipo = document.getElementById("filtroTipo");
const buscador = document.getElementById("buscador");
const inputValor = document.getElementById("VALOR");

/* ==========================
   FORMATO MONEDA
========================== */
inputValor.addEventListener("input", function (e) {
  let valor = e.target.value.replace(/\D/g, "");

  if (valor === "") {
    e.target.value = "";
    return;
  }

  const numero = Number(valor);
  e.target.value = "$ " + numero.toLocaleString("es-CO");
});

/* ==========================
   CARGAR TIPOS
========================== */
async function cargarTipos() {
  const res = await fetch("/api/tipos");
  tipos = await res.json();

  const selectTipo = document.getElementById("TIPO");

  selectTipo.innerHTML = "";
  filtroTipo.innerHTML = '<option value="">Todos los tipos</option>';

  tipos.forEach(t => {
    selectTipo.innerHTML += `<option value="${t.id}">${t.nombre}</option>`;
    filtroTipo.innerHTML += `<option value="${t.id}">${t.nombre}</option>`;
  });
}

/* ==========================
   CARGAR ACTIVOS
========================== */
async function cargarActivos() {
  const res = await fetch("/api/activos");
  const data = await res.json();

  activos = data.map(a => ({
    ...a,
    id: Number(a.id),
    tipo_id: a.tipo_id !== null ? Number(a.tipo_id) : null,
    valor: a.valor !== null ? Number(a.valor) : null
  }));

  renderizar();
}

/* ==========================
   RENDER TABLA
========================== */
function renderizar() {
  tablaBody.innerHTML = "";

  const texto = buscador.value.trim().toLowerCase();

  const filtrado = activos.filter(a => {

    const nombre = (a.nombre || "").toLowerCase();
    const placa = (a.placa || "").toString().toLowerCase();
    const ubicacion = (a.ubicacion || "").toLowerCase();

    const coincideBusqueda =
      nombre.includes(texto) ||
      placa.includes(texto) ||
      ubicacion.includes(texto);

    const coincideTipo =
      filtroTipo.value === "" ||
      a.tipo_id?.toString() === filtroTipo.value;

    return coincideBusqueda && coincideTipo;
  });

  if (filtrado.length === 0) {
    tablaBody.innerHTML = `
      <tr class="mensaje">
        <td colspan="6">No hay resultados</td>
      </tr>`;
    return;
  }

  filtrado.forEach(a => {
    const fila = document.createElement("tr");

    const valorFormateado =
      a.valor !== null
        ? "$ " + a.valor.toLocaleString("es-CO")
        : "";

    fila.innerHTML = `
      <td>${a.placa || ""}</td>
      <td>${a.nombre || ""}</td>
      <td>${a.tipo_nombre || ""}</td>
      <td>${a.ubicacion || ""}</td>
      <td>${valorFormateado}</td>
      <td>
        <button onclick="editar(${a.id});event.stopPropagation();">Editar</button>
        <button onclick="eliminar(${a.id});event.stopPropagation();">Eliminar</button>
      </td>
    `;

    // Click en fila muestra detalle
    fila.addEventListener("click", () => mostrarDetalle(a));

    tablaBody.appendChild(fila);
  });
}

/* ==========================
   GUARDAR / EDITAR
========================== */
document.getElementById("inventarioForm").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    etiqueta_original: ETIQUETA_ORIGINAL.value,
    placa: PLACA.value,
    nombre: NOMBRE_DEL_ACTIVO.value,
    tipo_id: TIPO.value || null,
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
    valor: VALOR.value.replace(/\D/g, "") || null
  };

  if (editId !== null) {
    await fetch(`/api/activos/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } else {
    await fetch("/api/activos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  cancelar();
  cargarActivos();
});

/* ==========================
   EDITAR
========================== */
function editar(id) {
  const a = activos.find(x => x.id === Number(id));
  if (!a) return;

  ETIQUETA_ORIGINAL.value = a.etiqueta_original || "";
  PLACA.value = a.placa || "";
  NOMBRE_DEL_ACTIVO.value = a.nombre || "";
  TIPO.value = a.tipo_id || "";
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

  if (a.valor !== null) {
    VALOR.value = "$ " + a.valor.toLocaleString("es-CO");
  } else {
    VALOR.value = "";
  }

  editId = a.id;
  document.getElementById("formSection").classList.remove("hidden");
}

/* ==========================
   ELIMINAR
========================== */
async function eliminar(id) {
  if (!confirm("¿Eliminar activo?")) return;

  await fetch(`/api/activos/${id}`, { method: "DELETE" });

  cargarActivos();
}

/* ==========================
   MODAL DETALLE
========================== */
function mostrarDetalle(a) {
  const modal = document.getElementById("modalDetalle");
  const contenido = document.getElementById("detalleContenido");

  contenido.innerHTML = "";

  const campos = {
    "Etiqueta Original": a.etiqueta_original,
    "Placa": a.placa,
    "Nombre": a.nombre,
    "Tipo": a.tipo_nombre,
    "Ubicación": a.ubicacion,
    "NIT Responsable": a.nit_resp,
    "Nombre Responsable": a.nombre_resp,
    "NIT Administrador": a.nit_administrador,
    "Administrador": a.administrador,
    "Fecha Entrada": a.fecha_entrada,
    "Organización": a.organiz,
    "Centro de Costo": a.nombre_ccosto,
    "Marca": a.marca,
    "Modelo": a.modelo,
    "Serie": a.serie,
    "Valor": a.valor !== null ? "$ " + a.valor.toLocaleString("es-CO") : ""
  };

  for (let key in campos) {
    contenido.innerHTML += `
      <div><strong>${key}:</strong> ${campos[key] || ""}</div>
    `;
  }

  modal.classList.remove("hidden");
}

function cerrarModal() {
  document.getElementById("modalDetalle").classList.add("hidden");
}

/* ==========================
   UI
========================== */
function mostrarFormulario() {
  document.getElementById("formSection").classList.remove("hidden");
}

function cancelar() {
  document.getElementById("inventarioForm").reset();
  editId = null;
  document.getElementById("formSection").classList.add("hidden");
}

buscador.addEventListener("input", renderizar);
filtroTipo.addEventListener("change", renderizar);

/* ==========================
   INIT
========================== */
cargarTipos();
cargarActivos();