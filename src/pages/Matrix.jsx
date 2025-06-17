import React, { useState, useEffect, useMemo } from "react";
import { fetchPatients } from "../services/patients";
import { fetchSessions, saveSessionsBulk } from "../services/sessions";
import { fetchMonthlyNote } from "../services/notes";
import TherapistSummary from "../components/TherapistSummary";
import TherapistSelectorListFixed from "../components/TherapistSelectorListFixed";
import ModalAlert from "../components/Modals/ModalAlert";
import SelectHomeModal from "../components/Homes/SelectHomeModal";
import NoteEditor from "../components/Notes/NoteEditor";

export default function Matrix() {
  const [data, setData] = useState([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [fixedTherapist, setFixedTherapist] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [noteData, setNoteData] = useState(null); // 📝 nota mensual

  const [modalMessage, setModalMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSelectHomeModal, setShowSelectHomeModal] = useState(false);

  const therapistId = "58abeff5-7e6b-4d01-8b3e-302dafa9dc7c"; // Marcela López (prueba)

  const baseDate = useMemo(() => new Date(), []);
  const viewDate = useMemo(
    () => new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1),
    [baseDate, monthOffset]
  );

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const startDate = new Date(currentYear, currentMonth, -3);
  const endDate = new Date(currentYear, currentMonth + 1, 3);
  const todayStr = new Date().toISOString().split("T")[0];

  const dates = useMemo(() => {
    const result = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      result.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return result;
  }, [startDate, endDate]);

  const loadData = async () => {
    try {
      const [patients, sessions, note] = await Promise.all([
        fetchPatients(),
        fetchSessions({ year: currentYear, month: currentMonth + 1 }),
        fetchMonthlyNote({
          therapistId: "58abeff5-7e6b-4d01-8b3e-302dafa9dc7c", // Marcela López (prueba)
          homeId: "abc8d5c0-a034-460c-ba19-5dcc5310519c", // <- adaptar si es dinámico
          year: currentYear,
          month: currentMonth + 1,
        }),
      ]);

      const mapped = patients.map((p) => ({
        id: p.id,
        patient: `${p.name} ${p.last_name}`,
        sessions_quantity: p.sessions_quantity || 0,
        sessions: sessions
          .filter(s => s.patient_id === p.id)
          .map(s => ({
            date: new Date(s.session_date).toISOString().split("T")[0],
            therapist: s.therapist_initials
          }))
      }));

      setData(mapped);
      setNoteData(note);
      setSessionsLoaded(true);
    } catch (err) {
      console.error("Error al cargar pacientes, sesiones o notas:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [viewDate]);

  const handleCellClick = (patientId, date) => {
    if (deleteMode) {
      setData(prev =>
        prev.map(p =>
          p.id === patientId
            ? { ...p, sessions: p.sessions.filter(s => s.date !== date) }
            : p
        )
      );
      return;
    }

    if (!fixedTherapist) {
      setErrorMsg("Debe seleccionar un kinesiólogo");
      return;
    }

    const patient = data.find(p => p.id === patientId);
    const currentMonthSessions = patient.sessions.filter(s => {
      const sessionMonth = new Date(s.date).getMonth();
      const sessionYear = new Date(s.date).getFullYear();
      return sessionMonth === currentMonth && sessionYear === currentYear;
    });

    if (currentMonthSessions.length >= patient.sessions_quantity) {
      setModalMessage(
        `${patient.patient} ya tiene ${currentMonthSessions.length} sesiones asignadas de ${patient.sessions_quantity} contratadas.`
      );
      setShowAlertModal(true);
      return;
    }

    assignTherapist(fixedTherapist, patientId, date);
    setErrorMsg("");
  };

  const assignTherapist = (therapist, patientId, date) => {
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
      await saveSessionsBulk({
        year: currentYear,
        month: currentMonth + 1,
        sessions: flatSessions,
      });
      await loadData();
      alert("Sesiones guardadas con éxito.");
    } catch (err) {
      console.error("Error al guardar sesiones:", err);
      alert("Error al guardar sesiones.");
    }
  };

  const formatMonthTitle = (date) =>
    date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const monthDateStrs = dates
    .filter((date) => date.getMonth() === currentMonth)
    .map((date) => date.toISOString().split("T")[0]);

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

      {showAlertModal && (
        <ModalAlert
          message={modalMessage}
          icon="warning"
          buttons={["OK"]}
          onClose={() => setShowAlertModal(false)}
        />
      )}

      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <div className="flex gap-2">
          <button onClick={() => setMonthOffset((m) => m - 1)}>← Mes anterior</button>
          <button onClick={() => setMonthOffset(0)}>Mes actual</button>
          <button onClick={() => setMonthOffset((m) => m + 1)}>Mes siguiente →</button>
        </div>
        <h2 className="text-lg font-semibold capitalize">
          {formatMonthTitle(viewDate)}
        </h2>
        <TherapistSelectorListFixed
          fixedTherapist={fixedTherapist}
          onChange={setFixedTherapist}
          deleteMode={deleteMode}
          onDeleteModeChange={setDeleteMode}
          showError={!!errorMsg}
        />
      </div>

      <table className="min-w-full border text-xs">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Sesiones</th>
            {dates.map((date) => {
              const dateStr = date.toISOString().split("T")[0];
              const isToday = dateStr === todayStr;
              const isCurrentMonth = date.getMonth() === currentMonth;
              const className = isToday
                ? "bg-yellow-100"
                : isCurrentMonth
                ? "bg-blue-50"
                : "bg-gray-50";
              return (
                <th key={dateStr} className={className}>
                  {date.getDate()}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sessionsLoaded &&
            data.map((p) => {
              const attended = p.sessions.filter((s) =>
                monthDateStrs.includes(s.date)
              ).length;
              return (
                <tr key={p.id}>
                  <td>{p.patient}</td>
                  <td>{p.sessions_quantity} / {attended}</td>
                  {dates.map((date) => {
                    const dateStr = date.toISOString().split("T")[0];
                    const session = p.sessions.find((s) => s.date === dateStr);
                    return (
                      <td
                        key={dateStr}
                        className={deleteMode ? "bg-red-100 cursor-pointer" : "cursor-pointer"}
                        onClick={() => handleCellClick(p.id, dateStr)}
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

      <button onClick={handleSaveChanges} className="bg-green-600 text-white px-3 py-1 rounded mt-4">
        Guardar cambios
      </button>

      <div className="mt-6 max-w-xl">
        <NoteEditor
          therapistId={"58abeff5-7e6b-4d01-8b3e-302dafa9dc7c"} // Marcela López (prueba)
          homeId={"abc8d5c0-a034-460c-ba19-5dcc5310519c"} // reemplazá si vas a seleccionar hogar
          year={currentYear}
          month={currentMonth + 1}
          existingNote={noteData}
          onSaved={setNoteData}
        />
      </div>
    </div>
  );
}
