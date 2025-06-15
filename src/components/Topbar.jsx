// src/components/Topbar.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ExitToApp } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomesByTherapist } from "../services/therapists";


export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [homes, setHomes] = useState([]);
  const [selectedHomeId, setSelectedHomeId] = useState(() => localStorage.getItem('selectedHomeId'));

  useEffect(() => {
    if (user?.therapist_id) {
      getHomesByTherapist(user.therapist_id)
        .then(setHomes)
        .catch((err) => console.error("Error fetching homes:", err));
    }
  }, [user?.therapist_id]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHomeChange = (e) => {
    const homeId = e.target.value;
    setSelectedHomeId(homeId);
    localStorage.setItem('selectedHomeId', homeId);
  };

  return (
    <div className="relative bg-white shadow-sm px-6 py-4 border-b">
      <div className="flex justify-center items-center gap-4 text-sm text-gray-700">
        {/* Combo hogares */}
        <select
          value={selectedHomeId || ''}
          onChange={handleHomeChange}
          className="border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="" disabled>
            Seleccionar hogar
          </option>
          {homes.map((home) => (
            <option key={home.id} value={home.id}>
              {home.name}
            </option>
          ))}
        </select>

        {/* Separador */}
        <span className="text-gray-400">|</span>

        {/* Usuario + menú */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center gap-x-1 hover:text-indigo-600"
          >
            <span className="font-medium">{user?.name || 'Usuario'}</span>
            <ChevronDown size={18} />
          </button>

          {menuOpen && (
            <div className="absolute left-1/2 z-20 mt-3 min-w-max -translate-x-1/2 rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
              <div className="p-4 space-y-3 w-72">
                <FlyoutItem label="Dashboard" description="General overview" to="/" onClick={() => setMenuOpen(false)} />
                <FlyoutItem label="Patients" description="View history and progress" to="/patients" onClick={() => setMenuOpen(false)} />
                <FlyoutItem label="Segumiento diario" description="Realice el seguimiento diario de los pacientes" to="/patients-daily-follow-up" onClick={() => setMenuOpen(false)} />
                <FlyoutItem label="Matrix" description="Matriz de sesiones" to="/matrix" onClick={() => setMenuOpen(false)} />
                <FlyoutItem label="Treatments" description="Therapies and frequencies" to="/treatments" onClick={() => setMenuOpen(false)} />
                <FlyoutItem label="Settings" description="Account and preferences" to="/settings" onClick={() => setMenuOpen(false)} />
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-500"
          title="Cerrar sesión"
        >
          <ExitToApp fontSize="small" />
        </button>
      </div>
    </div>
  );
}

function FlyoutItem({ label, description, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group block p-3 rounded-md hover:bg-gray-50 ${
          isActive ? "bg-gray-100 border-l-4 border-indigo-600" : ""
        }`
      }
    >
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </NavLink>
  );
}
