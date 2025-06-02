export default function PatientSearch({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Search patient..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg mb-4"
    />
  );
}
