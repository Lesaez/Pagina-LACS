export async function getActivos() {
  const res = await fetch("/api/activos");
  return await res.json();
}

export async function getTipos() {   // 🔥 ESTA FALTABA
  const res = await fetch("/api/tipos");
  return await res.json();
}

export async function createActivo(data) {
  const res = await fetch("/api/activos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await res.json();
}

export async function updateActivo(id, data) {
  const res = await fetch(`/api/activos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await res.json();
}

export async function deleteActivo(id) {
  const res = await fetch(`/api/activos/${id}`, {
    method: "DELETE"
  });

  return await res.json();
}