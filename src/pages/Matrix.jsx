import React, { useState, useEffect, useMemo } from "react";
import { fetchPatients } from "../services/patients";
import { fetchSessions, saveSessionsBulk } from "../services/sessions";
import TherapistSummary from "../components/TherapistSummary";
import TherapistSelectorListFixed from "../components/TherapistSelectorListFixed";

export default function Matrix() {
  const [data, setData] = useState([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [fixedTherapist, setFixedTherapist] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionsLoaded, setSessionsLoaded] = useState(false);

  const baseDate = useMemo(() => new Date(), []);
  const viewDate = useMemo(
    () => new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1),
    [baseDate, monthOffset]
  );

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const startDate = new Date(currentYear, currentMonth, -3);
  const endDate = new Date(currentYear, currentMonth + 1, 3);

  const dates = useMemo(() => {
    const result = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      result.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return result;
  }, [startDate, endDate]);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patients, sessions] = await Promise.all([
          fetchPatients(),
          fetchSessions({ year: viewDate.getFullYear(), month: viewDate.getMonth() + 1 })
        ]);

        const mapped = patients.map((p) => ({
          id: p.id,
          patient: `${p.name} ${p.last_name}`,
          sessions_quantity: p.sessions_quantity || 0,
          sessions: sessions
            .filter(s => s.patient_id === p.id)
            .map(s => ({
              date: s.session_date,
              therapist: s.therapist_initials
            }))
        }));

        setData(mapped);
        setSessionsLoaded(true);
      } catch (err) {
        console.error("Error al cargar pacientes o sesiones:", err);
      }
    };

    loadData();
  }, [viewDate]);

  const handleCellClick = (patientId, date) => {
    if (fixedTherapist) {
      assignTherapist(fixedTherapist, patientId, date);
      setErrorMsg("");
    } else {
      setErrorMsg("Debe seleccionar un kinesiólogo");
    }
  };

  const assignTherapist = (therapist, patientId, date) => {
    if (!therapist?.initials) return;

    setData((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const sessions = [...p.sessions];
        const existing = sessions.find(s => s.date === date);
        if (existing) {
          existing.therapist = therapist.initials;
        } else {
          sessions.push({ date, therapist: therapist.initials });
        }
        return { ...p, sessions };
      })
    );
  };

  const handleSaveChanges = async () => {
    const flatSessions = data.flatMap((p) =>
      p.sessions.map((s) => ({
        patient_id: p.id,
        therapist_initials: s.therapist,
        session_date: s.date,
        notes: null,
        photo_url: null,
        audio_url: null,
      }))
    );

    try {
      await saveSessionsBulk(flatSessions);
      alert("Sesiones guardadas con éxito.");
    } catch (err) {
      console.error("Error al guardar sesiones:", err);
      alert("Error al guardar sesiones.");
    }
  };

  const formatMonthTitle = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const monthDateStrs = dates
    .filter(date => date.getMonth() === currentMonth)
    .map(date => date.toISOString().split("T")[0]);

  const therapistStats = {};
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
          <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300" onClick={() => setMonthOffset(m => m - 1)}>← Mes anterior</button>
          <button className={`px-3 py-1 text-sm rounded hover:bg-gray-300 ${monthOffset !== 0 ? 'bg-yellow-300 text-gray-800 font-semibold' : 'bg-gray-200'}`} onClick={() => setMonthOffset(0)}>Mes actual</button>
          <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300" onClick={() => setMonthOffset(m => m + 1)}>Mes siguiente →</button>
        </div>
        <h2 className="text-lg font-semibold capitalize text-center w-full sm:w-auto">
          {formatMonthTitle(viewDate)}
        </h2>
        <TherapistSelectorListFixed
          fixedTherapist={fixedTherapist}
          onChange={setFixedTherapist}
        />
      </div>

      {errorMsg && <div className="text-sm text-red-600 mb-2">{errorMsg}</div>}

      <table className="min-w-full border text-xs">
        <thead>
          <tr>
            <th className="border px-2 py-1 bg-white sticky left-0 z-10">Paciente</th>
            <th className="border px-2 py-1 bg-white sticky left-[140px] z-10 text-center">Sesiones</th>
            {dates.map((date) => {
              const isCurrentMonth = date.getMonth() === currentMonth;
              const isToday = date.toISOString().split("T")[0] === todayStr;
              const className = isToday
                ? "bg-yellow-100 text-black"
                : isCurrentMonth
                ? "bg-blue-50 text-blue-800"
                : "bg-gray-50 text-gray-400";
              return (
                <th key={date.toISOString()} className={`border px-2 py-1 text-center text-xs ${className}`}>
                  {date.getDate()}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sessionsLoaded && data.map((p) => {
            const monthDates = dates.filter(date => date.getMonth() === currentMonth);
            const attended = monthDates.filter(date => p.sessions.some(s => s.date === date.toISOString().split("T")[0])).length;
            return (
              <tr key={p.id}>
                <td className="border px-2 py-1 sticky left-0 bg-white z-0 whitespace-nowrap">{p.patient}</td>
                <td className="border px-2 py-1 text-center sticky left-[140px] bg-white z-0 font-medium">{p.sessions_quantity} / {attended}</td>
                {dates.map((date) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const session = p.sessions.find(s => s.date === dateStr);
                  const isToday = dateStr === todayStr;
                  return (
                    <td
                      key={dateStr}
                      className={`border px-2 py-1 text-center text-xs cursor-pointer hover:bg-gray-100 ${isToday ? 'bg-yellow-50' : ''}`}
                      onClick={() => handleCellClick(p.id, dateStr)}
                      onDoubleClick={() => {
                        if (fixedTherapist) {
                          setData(prev =>
                            prev.map((item) =>
                              item.id === p.id
                                ? { ...item, sessions: item.sessions.filter(s => s.date !== dateStr) }
                                : item
                            )
                          );
                        }
                      }}
                    >
                      {session?.therapist || ""}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <TherapistSummary therapistStats={therapistStats} />

      <button
        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 mt-4"
        onClick={handleSaveChanges}
      >
        Guardar cambios
      </button>
    </div>
  );
}
