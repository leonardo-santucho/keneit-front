export default function PatientsTable({ patients, onViewDetails }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Nombre</th>
            <th className="text-left px-4 py-2">Edad</th>
            <th className="text-left px-4 py-2">Habitacion</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-t border-gray-200">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.age}</td>
              <td className="px-4 py-2">{p.room}</td>
              <td className="px-4 py-2">{p.status}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onViewDetails(p.id)}
                  className="text-blue-600 hover:underline"
                >
                  View details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
