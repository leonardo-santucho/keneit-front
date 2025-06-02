export default function PatientFilter({ filter, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      {["All", "Active", "Discharged"].map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === status ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
