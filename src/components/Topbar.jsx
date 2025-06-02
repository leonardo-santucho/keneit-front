//src/components/Topbar.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

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

  return (
    <div className="relative bg-white shadow-sm px-6 py-4 border-b">
      <div className="flex justify-center items-center relative">
        <div ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-x-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            <span>Kineit</span>
            <ChevronDown size={18} />
          </button>

          {open && (
            <div className="absolute left-1/2 z-20 mt-3 min-w-max -translate-x-1/2 rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
              <div className="p-4 space-y-3 w-72">
                <FlyoutItem
                  label="Dashboard"
                  description="General overview"
                  to="/"
                  onClick={() => setOpen(false)}
                />
                <FlyoutItem
                  label="Patients"
                  description="View history and progress"
                  to="/patients"
                  onClick={() => setOpen(false)}
                />
                <FlyoutItem
                  label="Segumiento diario"
                  description="Realice el seguimiento diario de los pacientes"
                  to="/patients-daily-follow-up"
                  onClick={() => setOpen(false)}
                />
                <FlyoutItem
                  label="Calendar"
                  description="Assigned appointments"
                  to="/calendar"
                  onClick={() => setOpen(false)}
                />
                <FlyoutItem
                  label="Treatments"
                  description="Therapies and frequencies"
                  to="/treatments"
                  onClick={() => setOpen(false)}
                />
                <FlyoutItem
                  label="Settings"
                  description="Account and preferences"
                  to="/settings"
                  onClick={() => setOpen(false)}
                />
              </div>
            </div>
          )}
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
