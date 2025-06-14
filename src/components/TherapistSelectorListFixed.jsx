import React, { useState, useEffect } from "react";
import { fetchTherapists } from "../services/therapists";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function TherapistSelectorListFixed({
  fixedTherapist,
  onChange,
  deleteMode,
  onDeleteModeChange,
  showError,
}) {
  const [therapists, setTherapists] = useState([]);

  useEffect(() => {
    fetchTherapists()
      .then(setTherapists)
      .catch((err) => {
        console.error("Error al cargar therapists:", err);
        setTherapists([]);
      });
  }, []);

  return (
    <div className="flex flex-col gap-1">
      {showError && (
        <p className="text-sm text-red-600 font-medium pl-1">
          Debe seleccionar un kinesiólogo
        </p>
      )}

      <div className="flex gap-4 items-center flex-wrap">
        {/* Combo */}
        <div className="relative w-56">
          <select
            disabled={deleteMode}
            value={fixedTherapist?.id || ""}
            onChange={(e) => {
              const selected = therapists.find(k => k.id === e.target.value);
              onChange(selected || null);
            }}
            className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:bg-gray-100"
          >
            <option value="">Seleccionar Kine</option>
            {therapists.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name} ({k.initials})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        {/* Toggle eliminar */}
        <div className="flex items-center gap-2">
          <button
            className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 px-1 ${
              deleteMode ? "bg-red-400" : "bg-gray-300"
            }`}
            onClick={() => onDeleteModeChange(!deleteMode)}
          >
            <span
              className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                deleteMode ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm ${
              deleteMode ? "text-red-600 font-semibold" : "text-gray-500"
            }`}
          >
            Modo eliminar
          </span>
        </div>
      </div>
    </div>
  );
}
