// src/services/therapists.js
const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL:", API_URL); // <-- Acá lo ves en consola al usar el servicio

export async function fetchTherapists() {
  const response = await fetch(`${API_URL}/api/therapists`);
  if (!response.ok) throw new Error("Error al obtener kinesiólogos");
  return response.json();
}

export const getHomesByTherapist = async (therapistId) => {
    console.log("url:", `${API_URL}/api/therapists/${therapistId}/homes`); // Verifica la URL
    
    const response = await fetch(`${API_URL}/api/therapists/${therapistId}/homes`);
                            
    if (!response.ok) throw new Error("Error al obtener kinesiólogos");
    return response.json();
};

export async function fetchTherapistsByHome(homeId) {
  const res = await fetch(`${API_URL}/api/therapists?home_id=${homeId}`);
  if (!res.ok) {
    throw new Error("Error al obtener kinesiólogos por hogar");
  }
  return await res.json();
}
