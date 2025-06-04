// PatientDailyFollowUp.jsx 
import { useState } from "react";
import { patientsMock } from "../data/patientsMock.js";
import { format, differenceInDays, parseISO } from "date-fns";

export default function PatientDailyFollowUp() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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

  const filteredPatients = patientsMock
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
          Fecha:
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

          const lastSessionDate = p.lastSession;
          const lastSessionFormatted = format(parseISO(lastSessionDate), "dd/MM/yyyy");
          const daysAgo = differenceInDays(new Date(), parseISO(lastSessionDate));

          return (
            <div
              key={p.id}
              className={`p-4 rounded shadow transition bg-white border-l-4 ${
                isChecked ? "border-green-500 bg-green-50" : "border-transparent"
              }`}
            >

              <div className="flex justify-between items-start">
                <div className={`flex flex-col gap-1 text-sm ${isChecked ? "text-gray-600" : "text-gray-500"}`}>
                  <p className="font-medium text-base text-gray-900">{p.name}</p>
                  <p>
                    Sesiones: {p.sessionsDone}/{p.sessionsPlanned}
                    <span className="ml-1 text-xs text-gray-400 whitespace-nowrap">({p.frequency})</span>
                  </p>
                  <p>
                    Últ. sesión:{" "}
                    {p.lastSession
                      ? new Date(p.lastSession)
                          .toLocaleDateString("es-AR", { day: "numeric", month: "short" })
                          .replace(/(^\d+\s)(\w)/, (_, d, l) => d + l.toUpperCase())
                      : "-"}
                    <span className="ml-1 text-xs text-gray-400 whitespace-nowrap">(hace 6 días)</span>
                  </p>
                  <p>Kinesiólogo Frec.: {p.kinesiologist}</p>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleChecked(p.id)}
                    />
                    Atendido
                  </label>
                </div>
              </div>


            </div>
          );
        })}
      </div>
    </div>
  );
}
