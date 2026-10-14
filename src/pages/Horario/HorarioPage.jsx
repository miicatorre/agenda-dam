import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage.js";
import { INITIAL_CLASES, INITIAL_EXTRAESCOLARES } from "../../data/initialData.js";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function HorarioPage() {
    const [clases]         = useLocalStorage("clases", INITIAL_CLASES);
    const [extras]         = useLocalStorage("extraescolares", INITIAL_EXTRAESCOLARES);
    const [diaSeleccionado, setDia] = useState(new Date().getDay() || 1);

    const clasesDia  = clases.filter(c => c.dias.includes(diaSeleccionado));
    const extrasDia  = extras.filter(e => e.dias.includes(diaSeleccionado));
    const todosDia   = [
        ...clasesDia.map(c => ({ ...c, tipo: "clase" })),
        ...extrasDia.map(e => ({ ...e, tipo: "extra" })),
    ].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    return (
        <div style={{ padding: "1rem" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "1rem" }}>Horario</h1>

            {/* Selector de día */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem", overflowX: "auto" }}>
                {[1,2,3,4,5].map(d => (
                    <button
                        key={d}
                        onClick={() => setDia(d)}
                        style={{
                            flex: 1, minWidth: "44px", padding: "8px 4px",
                            borderRadius: "8px", border: "1.5px solid",
                            borderColor: diaSeleccionado === d ? "#185FA5" : "#e2e8f0",
                            background: diaSeleccionado === d ? "#185FA5" : "white",
                            color: diaSeleccionado === d ? "white" : "#64748b",
                            fontWeight: "500", fontSize: "13px", cursor: "pointer"
                        }}
                    >{DIAS[d]}</button>
                ))}
            </div>

            {/* Clases del día */}
            {todosDia.length === 0 ? (
                <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "2rem" }}>Sin actividades este día</p>
            ) : (
                todosDia.map(item => (
                    <div key={item.id + item.tipo} style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "#94a3b8", minWidth: "42px", paddingTop: "10px" }}>
              {item.horaInicio}
            </span>
                        <div style={{
                            flex: 1, borderLeft: `4px solid ${item.color}`,
                            borderRadius: "8px", padding: "8px 12px",
                            background: item.tipo === "extra" ? "#f0f9f4" : "#f8fafc"
                        }}>
                            <div style={{ fontWeight: "600", fontSize: "14px" }}>
                                {item.emoji ? item.emoji + " " : ""}{item.nombre}
                            </div>
                            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                                {item.aula || ""} {item.horaInicio}–{item.horaFin}
                                {item.tipo === "extra" && <span style={{ marginLeft: "6px", fontSize: "11px", background: "#e1f5ee", color: "#0f6e56", padding: "1px 6px", borderRadius: "20px" }}>extraescolar</span>}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}