const modal = document.getElementById("modalDetalle");
const contenido = document.getElementById("detalleContenido");
const btnCerrar = document.getElementById("btnCerrarModal");

export function abrirModal(activo) {
  contenido.innerHTML = "";

  for (let key in activo) {
    contenido.innerHTML += `
      <div><strong>${key}:</strong> ${activo[key] ?? ""}</div>
    `;
  }

  modal.classList.add("active");
}

export function cerrarModal() {
  modal.classList.remove("active");
}

btnCerrar.addEventListener("click", cerrarModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) cerrarModal();
});