// src/main.jsx
import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import Calendar from "./pages/Calendar.jsx";
import Treatments from "./pages/Treatments.jsx";
import Settings from "./pages/Settings.jsx";
import Matrix from "./pages/Matrix.jsx";
import PatientsDailyFollowUp from "./pages/PatientsDailyFollowUp.jsx";
import Login from "./pages/Login.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <App />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="treatments" element={<Treatments />} />
            <Route path="matrix" element={<Matrix />} />
            <Route path="settings" element={<Settings />} />
            <Route path="patients-daily-follow-up" element={<PatientsDailyFollowUp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
