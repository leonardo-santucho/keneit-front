// src/services/notes.js
const API_URL = import.meta.env.VITE_API_URL;

// Obtener nota mensual
export async function fetchMonthlyNote({ therapistId, homeId, year, month }) {
  try {

    debugger; // Para depuración, eliminar en producción
    const res = await fetch(
      `${API_URL}/api/monthly-notes?therapistId=${therapistId}&homeId=${homeId}&year=${year}&month=${month}`
    );
    if (!res.ok) throw new Error('Error al buscar la nota');
    return await res.json();
  } catch (error) {
    console.error('fetchMonthlyNote error:', error);
    return null;
  }
}

// Crear una nueva nota mensual
export async function createMonthlyNote({ therapistId, homeId, year, month, notes }) {
  try {
    const res = await fetch(`${API_URL}/api/monthly-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ therapistId, homeId, year, month, notes }),
    });
    if (!res.ok) throw new Error('Error al crear la nota');
    return await res.json();
  } catch (error) {
    console.error('createMonthlyNote error:', error);
    return null;
  }
}

// Actualizar una nota existente
export async function updateMonthlyNote({ id, notes }) {
  try {
    const res = await fetch(`${API_URL}/api/monthly-notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error('Error al actualizar la nota');
    return await res.json();
  } catch (error) {
    console.error('updateMonthlyNote error:', error);
    return null;
  }
}
