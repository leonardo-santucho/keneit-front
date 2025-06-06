// src/services/therapists.js
const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL:", API_URL); // <-- Acá lo ves en consola al usar el servicio

export async function fetchTherapists() {
  const response = await fetch(`${API_URL}/therapists`);
  if (!response.ok) throw new Error("Error al obtener kinesiólogos");
  return response.json();
}
