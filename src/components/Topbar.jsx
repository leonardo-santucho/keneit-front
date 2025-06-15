// src/components/Topbar.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
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

  return (
    <div className="relative bg-white shadow-sm px-6 py-4 border-b">
      <div className="flex justify-between items-center relative">
        {/* Menú desplegable */}
        <div ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-x-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            <span>KINEIT</span>
            <ChevronDown size={18} />
          </button>

          {open && (
            <div className="absolute left-1/2 z-20 mt-3 min-w-max -translate-x-1/2 rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
              <div className="p-4 space-y-3 w-72">
                <FlyoutItem label="Dashboard" description="General overview" to="/" onClick={() => setOpen(false)} />
                <FlyoutItem label="Patients" description="View history and progress" to="/patients" onClick={() => setOpen(false)} />
                <FlyoutItem label="Segumiento diario" description="Realice el seguimiento diario de los pacientes" to="/patients-daily-follow-up" onClick={() => setOpen(false)} />
                <FlyoutItem label="Matrix" description="Matriz de sesiones" to="/matrix" onClick={() => setOpen(false)} />
                <FlyoutItem label="Treatments" description="Therapies and frequencies" to="/treatments" onClick={() => setOpen(false)} />
                <FlyoutItem label="Settings" description="Account and preferences" to="/settings" onClick={() => setOpen(false)} />
              </div>
            </div>
          )}
        </div>

        {/* Usuario + logout */}
        <div className="flex items-center gap-4 text-sm text-gray-700">
          {user?.name && <span className="hidden sm:inline">Hola, {user.name}</span>}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500 text-sm"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
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
