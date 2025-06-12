// src/services/sessions.js
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchSessions({ year, month }) {
  const response = await fetch(`${API_URL}/api/sessions?year=${year}&month=${month}`);
  if (!response.ok) throw new Error("Error al obtener sesiones");
  return response.json();
}

export async function saveSessionsBulk(payload) {
  const response = await fetch(`${API_URL}/api/sessions/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Error al guardar sesiones");
  return response.json();
}
