import React, { useState, useEffect } from "react";
import { createMonthlyNote, updateMonthlyNote } from "../../services/notes";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function NoteEditor({
  therapistId,
  homeId,
  year,
  month,
  existingNote,
  onSaved,
}) {
  const [note, setNote] = useState(existingNote?.notes || "");
  const [saving, setSaving] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setNote(existingNote?.notes || "");
  }, [existingNote]);

  const isUnchanged = note === (existingNote?.notes || "");
  const isEmpty = note.trim().length === 0;

  const handleSave = async () => {
    if (isUnchanged || isEmpty) return;

    setSaving(true);
    setLocked(true);
    let result = null;

    if (existingNote?.id) {
      result = await updateMonthlyNote({ id: existingNote.id, notes: note });
    } else {
      result = await createMonthlyNote({
        therapistId,
        homeId,
        year,
        month,
        notes: note,
      });
    }

    setSaving(false);
    if (result && onSaved) onSaved(result);

    setTimeout(() => {
      setLocked(false);
    }, 1000);
  };

  const handleClear = async () => {
    if (isEmpty) return;

    setNote("");

    if (existingNote?.id) {
      try {
        const result = await updateMonthlyNote({ id: existingNote.id, notes: "" });
        if (onSaved) onSaved(result);
      } catch (err) {
        console.error("Error al limpiar nota:", err);
      }
    }
  };

  return (
    <div className="p-2">
      <label className="text-sm font-semibold text-gray-700 block mb-2">
        Notas
      </label>

      <div className="relative">
        <textarea
          className="w-full h-28 border border-gray-300 rounded-lg text-sm p-3 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-400"
          placeholder="Agregar tus notas"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

     
<div className="flex justify-end mt-3 gap-2">
  <button
    onClick={handleSave}
    disabled={saving || locked || isUnchanged || isEmpty}
    className={`w-8 h-8 rounded-full flex items-center justify-center transition
      ${saving || locked || isUnchanged || isEmpty
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
    title="Guardar nota"
  >
    <CheckCircleOutlinedIcon fontSize="small" />
  </button>

  <button
    onClick={handleClear}
    disabled={isEmpty}
    className={`w-8 h-8 rounded-full flex items-center justify-center transition
      ${isEmpty
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
    title="Eliminar nota"
  >
    <DeleteOutlineIcon fontSize="small" />
  </button>
</div>


      </div>
    </div>
  );
}
