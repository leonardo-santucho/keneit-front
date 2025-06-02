import { useState, useRef } from "react";

export default function PatientDailyFollowUp() {
  const allPatients = [
    { id: 1, name: "Juan Pérez", room: "102", age: 82 },
    { id: 2, name: "Ana García", room: "203", age: 90 },
    { id: 3, name: "Carlos López", room: "301", age: 85 },
    { id: 4, name: "Marta Rodríguez", room: "210", age: 77 },
  ];

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  const [records, setRecords] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
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

  const openNoteModal = (patient) => {
    const data = records[selectedDate]?.[patient.id] || {};
    setSelectedPatient(patient);
    setComment(data.comment || "");
    setImage(data.image || null);
    setAudioURL(data.audioURL || null);
    setOpenModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      setAudioURL(URL.createObjectURL(blob));
      chunks.current = [];
    };
    recorder.start();
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
  };

  const saveNote = () => {
    setRecords((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [selectedPatient.id]: {
          ...(prev[selectedDate]?.[selectedPatient.id] || {}),
          comment,
          image,
          audioURL,
        },
      },
    }));
    setOpenModal(false);
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

      {/* Fecha + Búsqueda */}
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

      {/* Filtro por estado */}
      <div className="flex gap-4 mb-6 text-sm">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("not_attended")}
          className={`px-3 py-1 rounded ${
            filter === "not_attended" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          No atendidos
        </button>
        <button
          onClick={() => setFilter("attended")}
          className={`px-3 py-1 rounded ${
            filter === "attended" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          Atendidos
        </button>
      </div>

      <div className="space-y-4">
        {filteredPatients.map((patient) => {
          const isChecked = records[selectedDate]?.[patient.id]?.checked;
          return (
            <div
              key={patient.id}
              className={`p-4 rounded shadow flex justify-between items-center transition ${
                isChecked ? "bg-green-50 border-l-4 border-green-500" : "bg-white"
              }`}
            >
              <div className={isChecked ? "text-gray-600" : ""}>
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-gray-500">
                  Hab. {patient.room} • {patient.age} años
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleChecked(patient.id)}
                  />
                  Atendido
                </label>
                <button
                  onClick={() => openNoteModal(patient)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Nota
                </button>
              </div>
            </div>
          );
        })}

        {filteredPatients.length === 0 && (
          <p className="text-sm text-gray-500">No se encontraron pacientes.</p>
        )}
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">
              Nota para {selectedPatient?.name}
            </h3>

            <textarea
              placeholder="Escriba un comentario..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto
              </label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {image && (
                <img
                  src={image}
                  alt="Previsualización"
                  className="mt-2 rounded max-h-40"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nota de voz
              </label>
              <div className="flex gap-2">
                <button
                  onClick={startRecording}
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
              {audioURL && (
                <audio controls src={audioURL} className="mt-2 w-full" />
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={saveNote}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
