// src/main.jsx
import './index.css'; // o './main.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import Calendar from "./pages/Calendar.jsx";
import Treatments from "./pages/Treatments.jsx";
import Settings from "./pages/Settings.jsx";

import PatientsDailyFollowUp from "./pages/PatientsDailyFollowUp";




ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="treatments" element={<Treatments />} />
          <Route path="settings" element={<Settings />} />
          <Route path="patients-daily-follow-up" element={<PatientsDailyFollowUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
