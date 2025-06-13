import React, { useEffect, useState } from "react";
import { getHomesByTherapist } from "../../services/therapists";

export default function SelectHomeModal({ therapistId, onSelect, onClose }) {
  const [homes, setHomes] = useState([]);
  const [selectedHome, setSelectedHome] = useState("");

  useEffect(() => {
    if (therapistId) {
      getHomesByTherapist(therapistId).then(setHomes);
    }
  }, [therapistId]);

  const handleConfirm = () => {
    if (selectedHome) {
      onSelect(selectedHome);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Seleccionar hogar</h2>
        <select
          value={selectedHome}
          onChange={(e) => setSelectedHome(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        >
          <option value="">Seleccione un hogar</option>
          {homes.map((home) => (
            <option key={home.id} value={home.id}>
              {home.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedHome}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
