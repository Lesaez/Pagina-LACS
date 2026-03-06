const modalDetalle = document.getElementById("modalDetalle");
const btnCerrarDetalle = document.getElementById("btnCerrarDetalle");
const detalleContenido = document.getElementById("detalleContenido");

export function iniciarDetalle(){

  btnCerrarDetalle.addEventListener("click", () =>
    modalDetalle.classList.remove("active")
  );

}

export function abrirDetalle(a){

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