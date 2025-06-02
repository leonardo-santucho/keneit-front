// src/App.jsx
import { Outlet } from "react-router-dom";
import Topbar from "./components/Topbar";

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Topbar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
