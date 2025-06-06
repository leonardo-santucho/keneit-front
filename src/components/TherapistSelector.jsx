// TherapistSelector.jsx
import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { fetchTherapists } from "../services/therapists";

export default function TherapistSelector({
  onSelect,
  onCancel,
  onRemove,
  visibleRemove = false
}) {
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    fetchTherapists()
      .then(setTherapists)
      .catch((err) => {
        console.error("Error al cargar therapists:", err);
        setTherapists([]); // fallback vacío si falla
      });
  }, []);


  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-2">
            <CheckCircle className="text-green-600 w-6 h-6" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Seleccionar Kinesiólogo</h2>
        <p className="text-sm text-gray-500 mb-6">Seleccioná el profesional que atendió al paciente</p>

        <ul className="space-y-2 mb-6">
          {therapists.map((k) => (
            <li
              key={k.id}
              className="cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded border border-gray-200"
              onClick={() => onSelect(k)}
            >
              {k.name} ({k.initials})
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center gap-4">
          <button
            className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-bold transition"
            onClick={onCancel}
          >
            Cancelar
          </button>
          {visibleRemove && (
            <button
              className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={onRemove}
            >
              Eliminar Kinesiólogo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
