// src/services/patients.js
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchPatients() {
  const response = await fetch(`${API_URL}/api/patients`);
  if (!response.ok) throw new Error("Error al obtener pacientes");
  return response.json();
}


export async function fetchPatientsByHomeId(homeId) {
  try {
     const response = await fetch(`${API_URL}/api/patients?home_id=${homeId}`);

    if (!response.ok) {
      throw new Error('Error al obtener pacientes por home_id');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetchPatientsByHomeId:', error);
    throw error;
  }
}
