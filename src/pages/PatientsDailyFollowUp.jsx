// PatientDailyFollowUp.jsx
import { useState, useRef } from "react";
import PatientCalendar from "../components/PatientCalendar";

export default function PatientDailyFollowUp() {
  const allPatients = [
    { id: 1, name: "Juan Pérez", room: "102", age: 82, sessionsPlanned: 5, sessionsDone: 3, frequency: "2x semana", time: "10:00" },
    { id: 2, name: "Ana García", room: "203", age: 90, sessionsPlanned: 4, sessionsDone: 2, frequency: "1x semana", time: "11:30" },
  ];

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState({});
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const chunks = useRef([]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (newDate > today) return;
    setSelectedDate(newDate);
  };

  const toggleChecked = (id) => {
    setRecords((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [id]: {
          ...(prev[selectedDate]?.[id] || {}),
          checked: !prev[selectedDate]?.[id]?.checked,
        },
      },
    }));
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateField = (id, field, value) => {
    setRecords((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [id]: {
          ...(prev[selectedDate]?.[id] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleImageChange = (id, e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    updateField(id, "images", previews);
  };

  const startRecording = async (id) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      updateField(id, "audioURL", URL.createObjectURL(blob));
      chunks.current = [];
    };
    recorder.start();
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
  };

  const handleSave = (id) => {
    const entry = records[selectedDate]?.[id];
    if (!entry || (!entry.comment && !entry.audioURL && !entry.images?.length)) {
      alert("Agregá al menos una nota, foto o audio antes de guardar.");
      return;
    }

    console.log("Guardado para:", id, "en fecha:", selectedDate, "=>", entry);
    alert("Información guardada correctamente");
  };

  const filteredPatients = allPatients
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      const isChecked = records[selectedDate]?.[p.id]?.checked;
      if (filter === "attended") return isChecked;
      if (filter === "not_attended") return !isChecked;
      return true;
    });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Seguimiento diario</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <label className="text-sm text-gray-700">
          Fecha:{" "}
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split("T")[0]}
            className="ml-2 px-3 py-1 border rounded"
          />
        </label>

        <input
          type="text"
          placeholder="Buscar paciente por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded shadow-sm"
        />
      </div>

      <div className="flex gap-4 mb-6 text-sm">
        {["all", "not_attended", "attended"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${
              filter === f ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            {f === "all" ? "Todos" : f === "attended" ? "Atendidos" : "No atendidos"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredPatients.map((p) => {
          const r = records[selectedDate]?.[p.id] || {};
          const isChecked = r.checked;

          return (
            <div
              key={p.id}
              className={`p-4 rounded shadow transition bg-white border-l-4 ${
                isChecked ? "border-green-500 bg-green-50" : "border-transparent"
              }`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(p.id)}
              >
                <div className={isChecked ? "text-gray-600" : ""}>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    Sesiones: {p.sessionsDone} / {p.sessionsPlanned} | Habitación: {p.room} | Edad: {p.age}
                  </p>
                </div>
                <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleChecked(p.id)}
                    />
                    Atendido
                  </label>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(p.id);
                    }}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    {expanded[p.id] ? "▲" : "▼"}
                  </button>
                </div>
              </div>

              {expanded[p.id] && (
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <PatientCalendar patientId={p.id} records={records} />

                  <p><strong>Frecuencia:</strong> {p.frequency}</p>
                  <p><strong>Horario:</strong> {p.time}</p>

                  <textarea
                    placeholder="Escriba una nota..."
                    value={r.comment || ""}
                    onChange={(e) => updateField(p.id, "comment", e.target.value)}
                    className="w-full border p-2 rounded"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => startRecording(p.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      Grabar
                    </button>
                    <button
                      onClick={stopRecording}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    >
                      Detener
                    </button>
                  </div>

                  {r.audioURL && (
                    <audio controls src={r.audioURL} className="w-full" />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageChange(p.id, e)}
                  />

                  {r.images && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {r.images.map((src, idx) => (
                        <img key={idx} src={src} alt="Foto" className="max-h-24 rounded" />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleSave(p.id)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded text-sm"
                  >
                    Guardar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
