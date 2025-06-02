import { useState } from "react";
import { patientsMock } from "../data/patientsMock";
import PatientSearch from "../components/PatientSearch";
import PatientFilter from "../components/PatientFilter";
import PatientsTable from "../components/PatientsTable";

export default function Patients() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredPatients = patientsMock.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (id) => {
    alert(`Go to patient details with ID: ${id}`);
    // TODO: navigate or open modal
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      <PatientSearch onSearch={setSearch} />
      <PatientFilter filter={filter} onChange={setFilter} />
      <PatientsTable patients={filteredPatients} onViewDetails={handleViewDetails} />
    </div>
  );
}
