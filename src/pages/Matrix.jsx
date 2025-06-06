// Matrix.jsx
import React, { useState, useEffect } from "react";
import { patientsMock } from "../data/patientsMock";
import { kinesiologistsMock } from "../data/kinesiologistsMock";
import TherapistSelector from "../components/TherapistSelector";
import TherapistSummary from "../components/TherapistSummary";

export default function Matrix() {
  const [data, setData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [fixedTherapist, setFixedTherapist] = useState(null);

  useEffect(() => {
    const mapped = patientsMock.map((p) => ({
      patient: p.name,
      sessions: []
    }));
    setData(mapped);
  }, []);

  const baseDate = new Date();
  const viewDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1);
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const startDate = new Date(currentYear, currentMonth, -4);
  const endDate = new Date(currentYear, currentMonth + 1, 5);

  const getDatesInRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dates = getDatesInRange(startDate, endDate);
  const todayStr = new Date().toISOString().split("T")[0];

  const handleCellClick = (patientIndex, date) => {
    if (fixedTherapist) {
      assignTherapist(fixedTherapist, patientIndex, date);
    } else {
      setSelectedCell({ patientIndex, date });
    }
  };

  const assignTherapist = (therapist, patientIndex = null, date = null) => {
    const cell = patientIndex !== null && date ? { patientIndex, date } : selectedCell;
    if (!cell || !therapist?.initials) return;

    setData((prev) => {
      const updated = [...prev];
      const patient = updated[cell.patientIndex];

      const existing = patient.sessions.find(s => s.date === cell.date);
      if (existing) {
        existing.therapist = therapist.initials;
      } else {
        patient.sessions.push({ date: cell.date, therapist: therapist.initials });
      }

      return updated;
    });

    if (!fixedTherapist) setSelectedCell(null);
  };

  const removeTherapist = () => {
    if (!selectedCell) return;

    setData((prev) => {
      const updated = [...prev];
      const patient = updated[selectedCell.patientIndex];
      patient.sessions = patient.sessions.filter(s => s.date !== selectedCell.date);
      return updated;
    });

    setSelectedCell(null);
  };

  const hasTherapistAssigned = selectedCell && data[selectedCell.patientIndex]?.sessions.some(s => s.date === selectedCell.date);

  const formatMonthTitle = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const therapistStats = {};
  kinesiologistsMock.forEach(k => {
    therapistStats[k.initials] = 0;
  });

  const monthDateStrs = dates
    .filter(date => date.getMonth() === currentMonth)
    .map(date => date.toISOString().split("T")[0]);

  data.forEach((patient) => {
    patient.sessions.forEach((s) => {
      if (monthDateStrs.includes(s.date)) {
        therapistStats[s.therapist] = (therapistStats[s.therapist] || 0) + 1;
      }
    });
  });

  return (
    <div className="overflow-auto">
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setMonthOffset((prev) => prev - 1)}
          >
            ← Mes anterior
          </button>
          <button
            className={`px-3 py-1 text-sm rounded hover:bg-gray-300 ${monthOffset !== 0 ? 'bg-yellow-300 text-gray-800 font-semibold' : 'bg-gray-200'}`}
            onClick={() => setMonthOffset(0)}
          >
            Mes actual
          </button>
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setMonthOffset((prev) => prev + 1)}
          >
            Mes siguiente →
          </button>
        </div>
        <h2 className="text-lg font-semibold capitalize text-center w-full sm:w-auto">
          {formatMonthTitle(viewDate)}
        </h2>
        <div className="flex gap-2 items-center">
          <label className="text-sm">Fijar kinesiólogo:</label>
          <select
            className="border px-2 py-1 text-sm rounded"
            value={fixedTherapist?.id || ""}
            onChange={(e) => {
              const selected = kinesiologistsMock.find(k => k.id === e.target.value);
              setFixedTherapist(selected || null);
            }}
          >
            <option value="">-- Ninguno --</option>
            {kinesiologistsMock.map(k => (
              <option key={k.id} value={k.id}>{k.name} ({k.initials})</option>
            ))}
          </select>
        </div>
      </div>

      <table className="min-w-full border text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1 bg-gray-100 sticky left-0 z-10">Paciente</th>
            <th className="border px-2 py-1 bg-gray-100 sticky left-[140px] z-10">Sesiones totales</th>
            <th className="border px-2 py-1 bg-gray-100 sticky left-[200px] z-10">Atendidas</th>
            <th className="border px-2 py-1 bg-gray-100 sticky left-[280px] z-10">Pendientes</th>
            {dates.map((date) => {
              const isCurrentMonth = date.getMonth() === currentMonth;
              const isToday = date.toISOString().split("T")[0] === todayStr;
              const className = isToday
                ? "bg-yellow-100 text-black"
                : isCurrentMonth
                ? "bg-blue-50 text-blue-800"
                : "bg-gray-50 text-gray-400";
              return (
                <th
                  key={date.toISOString()}
                  className={`border px-2 py-1 text-center ${className}`}
                >
                  {date.getDate()}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((patientRow, idx) => {
            const monthDates = dates.filter(date => date.getMonth() === currentMonth);
            const sessionDates = patientRow.sessions.map(s => s.date);
            const attended = monthDates.filter(date => sessionDates.includes(date.toISOString().split("T")[0])).length;
            const total = monthDates.length;
            const pending = total - attended;

            return (
              <tr key={idx}>
                <td className="border px-2 py-1 sticky left-0 bg-white z-0 whitespace-nowrap">{patientRow.patient}</td>
                <td className="border px-2 py-1 text-center sticky left-[140px] bg-white z-0">{total}</td>
                <td className="border px-2 py-1 text-center sticky left-[200px] bg-white z-0">{attended}</td>
                <td className="border px-2 py-1 text-center sticky left-[280px] bg-white z-0">{pending}</td>
                {dates.map((date) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const session = patientRow.sessions.find((s) => s.date === dateStr);
                  const isToday = dateStr === todayStr;
                  return (
                   
                    <td
                      key={dateStr}
                      className={`border px-2 py-1 text-center cursor-pointer hover:bg-gray-100 ${isToday ? 'bg-yellow-50' : ''}`}
                      onClick={() => handleCellClick(idx, dateStr)}
                      onDoubleClick={() => {
                        if (fixedTherapist) {
                          setData((prev) => {
                            const updated = [...prev];
                            updated[idx].sessions = updated[idx].sessions.filter(s => s.date !== dateStr);
                            return updated;
                          });
                        }
                      }}
                    >
                      {session ? session.therapist : ""}
                    </td>


                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedCell && !fixedTherapist && (
        <TherapistSelector
          onSelect={assignTherapist}
          onCancel={() => setSelectedCell(null)}
          onRemove={removeTherapist}
          visibleRemove={hasTherapistAssigned}
        />
      )}

      <TherapistSummary 
        therapistStats={therapistStats} 
        kinesiologists={kinesiologistsMock} 
      />
    </div>
  );
}
