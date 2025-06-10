// components/TherapistSelectorListFixed.jsx
import React, { useState, useEffect } from "react";
import { fetchTherapists } from "../services/therapists";

export default function TherapistSelectorListFixed({ fixedTherapist, onChange }) {
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
    <div className="flex gap-2 items-center">
      <label className="text-sm">Fijar kinesiólogo:</label>
      <select
        className="border px-2 py-1 text-sm rounded"
        value={fixedTherapist?.id || ""}
        onChange={(e) => {
          const selected = therapists.find(k => k.id === e.target.value);
          onChange(selected || null);
        }}
      >
        <option value="">-- Ninguno --</option>
        {therapists.map(k => (
          <option key={k.id} value={k.id}>
            {k.name} ({k.initials})
          </option>
        ))}
      </select>
    </div>
  );
}
