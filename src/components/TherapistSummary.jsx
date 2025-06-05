// TherapistSummary.jsx
import React from "react";

export default function TherapistSummary({ therapistStats, kinesiologists }) {
  const getTherapistName = (initials) => {
    const found = kinesiologists.find(k => k.initials === initials);
    return found ? `${found.name} (${found.initials})` : initials;
  };

  const sortedStats = Object.entries(therapistStats).sort(([, a], [, b]) => b - a);

  return (
    <div className="mt-6">
      <h3 className="text-md font-semibold mb-2">Sesiones por kinesiólogo en el mes</h3>
      <table className="min-w-sm border text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1 bg-gray-100">Kinesiólogo</th>
            <th className="border px-2 py-1 bg-gray-100 text-center">Sesiones</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map(([initials, count]) => (
            <tr key={initials}>
              <td className="border px-2 py-1 whitespace-nowrap">{getTherapistName(initials)}</td>
              <td className="border px-2 py-1 text-center">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
