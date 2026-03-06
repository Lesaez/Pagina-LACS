export let activosGlobal = [];
export let editId = null;
export let filtroTipoActual = null;

export function setActivos(data){
  activosGlobal = data;
}

export function setEditId(id){
  editId = id;
}

export function setFiltroTipo(tipo){
  filtroTipoActual = tipo;
}