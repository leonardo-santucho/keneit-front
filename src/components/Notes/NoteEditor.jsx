// src/components/NoteEditor.jsx
import React, { useState, useEffect } from "react";
import { Check, Trash2 } from "lucide-react";
import { createMonthlyNote, updateMonthlyNote } from "../../services/notes";

export default function NoteEditor({
  therapistId,
  homeId,
  year,
  month,
  existingNote, // { id, notes }
  onSaved,
}) {
  const [note, setNote] = useState(existingNote?.notes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNote(existingNote?.notes || "");
  }, [existingNote]);

  const handleSave = async () => {
    if (!note.trim()) return;

    setSaving(true);
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
  };

  const handleClear = () => {
    setNote("");
  };

  return (
    <div className="relative border rounded-lg p-2 bg-white">
      <label className="text-sm font-medium text-gray-700 mb-1 block">Notas</label>
      <textarea
        className="w-full h-24 p-2 rounded-md border resize-none text-sm"
        placeholder="Escriba una nota..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-green-600 hover:text-green-800"
        >
          <Check size={18} />
        </button>
        <button
          onClick={handleClear}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
