//src/components/TherapistSummary.jsx
import React, { useState, useEffect } from "react";
import { fetchTherapists } from "../services/therapists";
import { fetchSessionRates } from "../services/sessionRates";

export default function TherapistSummary({ therapistStats }) {
  const [therapists, setTherapists] = useState([]);
  const [sessionRate, setSessionRate] = useState(null);
  const [coordinatorRate, setCoordinatorRate] = useState(null);

  useEffect(() => {
    fetchTherapists()
      .then(setTherapists)
      .catch((err) => {
        console.error("Error al cargar therapists:", err);
        setTherapists([]);
      });

    fetchSessionRates({ role: "terapista", active: true })
      .then((res) => {
        console.log("Valores sesión terapista recibidos:", res);
        if (res.length > 0) {
          setSessionRate(res[0].session_rate);
        }
      })
      .catch((err) => {
        console.error("Error al cargar valor por sesión de terapista:", err);
      });

    fetchSessionRates({ role: "coordinador", active: true })
      .then((res) => {
        console.log("Valores sesión coordinador recibidos:", res);
        if (res.length > 0) {
          setCoordinatorRate(res[0].session_rate);
        }
      })
      .catch((err) => {
        console.error("Error al cargar valor por sesión de coordinador:", err);
      });
  }, []);

  const sortedStats = Object.entries(therapistStats).sort(([, a], [, b]) => b - a);

  const totalKinesiologistAmount = sortedStats.reduce((acc, [, count]) => {
    return sessionRate ? acc + sessionRate * count : acc;
  }, 0);

  const totalSessions = sortedStats.reduce((sum, [, count]) => sum + count, 0);
  const totalCoordinatorAmount = coordinatorRate ? coordinatorRate * totalSessions : null;

  const totalGeneralAmount =
    totalKinesiologistAmount && totalCoordinatorAmount
      ? totalKinesiologistAmount + totalCoordinatorAmount
      : null;

  return (
    <div className="mt-6">
      <h3 className="text-md font-semibold mb-2">Sesiones por kinesiólogo en el mes</h3>
      <table className="min-w-full border text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1 bg-gray-100 text-left">Kinesiólogo</th>
            <th className="border px-2 py-1 bg-gray-100 text-center">Sesiones</th>
            <th className="border px-2 py-1 bg-gray-100 text-center">Valor sesión ($)</th>
            <th className="border px-2 py-1 bg-gray-100 text-center">Total ($)</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map(([initials, count]) => {
            const therapist = therapists.find((t) => t.initials === initials);
            const displayName = therapist
              ? `${therapist.name} (${therapist.initials})`
              : initials;
            const total = sessionRate ? sessionRate * count : "-";
            return (
              <tr key={initials}>
                <td className="border px-2 py-1 whitespace-nowrap">{displayName}</td>
                <td className="border px-2 py-1 text-center">{count}</td>
                <td className="border px-2 py-1 text-center">
                  {sessionRate ? `$${sessionRate.toLocaleString("es-AR")}` : "-"}
                </td>
                <td className="border px-2 py-1 text-center">
                  {typeof total === "number"
                    ? `$${total.toLocaleString("es-AR")}`
                    : "-"}
                </td>
              </tr>
            );
          })}

          {/* Total kinesiólogos */}
          <tr>
            <td colSpan="3" className="border px-2 py-1 font-semibold text-right bg-gray-50">
              Total kinesiólogos
            </td>
            <td className="border px-2 py-1 text-center font-semibold bg-gray-50">
              {sessionRate ? `$${totalKinesiologistAmount.toLocaleString("es-AR")}` : "-"}
            </td>
          </tr>

          {/* Coordinación */}
          <tr className="bg-gray-100">
            <td className="border px-2 py-1 font-semibold">Coordinación</td>
            <td className="border px-2 py-1 text-center">{totalSessions}</td>
            <td className="border px-2 py-1 text-center">
              {coordinatorRate ? `$${coordinatorRate.toLocaleString("es-AR")}` : "-"}
            </td>
            <td className="border px-2 py-1 text-center font-semibold">
              {totalCoordinatorAmount
                ? `$${totalCoordinatorAmount.toLocaleString("es-AR")}`
                : "-"}
            </td>
          </tr>

          {/* Total general */}
          <tr className="bg-yellow-50">
            <td colSpan="3" className="border px-2 py-1 font-bold text-right">
              Total general
            </td>
            <td className="border px-2 py-1 text-center font-bold">
              {totalGeneralAmount
                ? `$${totalGeneralAmount.toLocaleString("es-AR")}`
                : "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
