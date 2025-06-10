//services/sessionRates.js
const API_URL = import.meta.env.VITE_API_URL 

export async function fetchSessionRates({ role = null, active = null } = {}) {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  if (active !== null) params.append("active", active);

  const response = await fetch(`${API_URL}/api/session-rates?${params.toString()}`);
  if (!response.ok) throw new Error("Error al obtener los valores por sesión");
  return await response.json();
}

