import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HorarioPage from "./pages/Horario/HorarioPage.jsx";
import CalendarioPage from "./pages/Calendario/CalendarioPage.jsx";
import TareasPage from "./pages/Tareas/TareasPage.jsx";
import ExtracurricularPage from "./pages/Extracurricular/ExtracurricularPage.jsx";
import ClassroomPage from "./pages/Classroom/ClassroomPage.jsx";
import "./App.css";

export default function App() {
  return (
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/"                 element={<HorarioPage />} />
            <Route path="/calendario"      element={<CalendarioPage />} />
            <Route path="/tareas"          element={<TareasPage />} />
            <Route path="/extracurricular" element={<ExtracurricularPage />} />
            <Route path="/classroom"       element={<ClassroomPage />} />
          </Routes>
        </main>
        <Navbar />
      </div>
  );
}