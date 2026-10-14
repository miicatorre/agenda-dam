import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage.js";
import { INITIAL_CLASES, INITIAL_TAREAS, INITIAL_EXTRAESCOLARES } from "../../data/initialData.js";

export default function CalendarioPage() {
    const [clases] = useLocalStorage("clases", INITIAL_CLASES);
    const [tareas] = useLocalStorage("tareas", INITIAL_TAREAS);
    const [extras] = useLocalStorage("extraescolares", INITIAL_EXTRAESCOLARES);

    const hoy = new Date();
    const [mes, setMes] = useState(hoy.getMonth());
    const [anio, setAnio] = useState(hoy.getFullYear());
    const [diaSeleccionado, setDia] = useState(hoy.getDate());

    const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const primerDia = new Date(anio, mes, 1).getDay();
    const diasMes   = new Date(anio, mes + 1, 0).getDate();
    const offset    = primerDia === 0 ? 6 : primerDia - 1;

    function anterior() { if (mes === 0) { setMes(11); setAnio(a => a-1); } else setMes(m => m-1); }
    function siguiente() { if (mes === 11) { setMes(0); setAnio(a => a+1); } else setMes(m => m+1); }

    function tieneClase(dia) {
        const dow = new Date(anio, mes, dia).getDay();
        return clases.some(c => c.dias.includes(dow));
    }
    function tieneExtra(dia) {
        const dow = new Date(anio, mes, dia).getDay();
        return extras.some(e => e.dias.includes(dow));
    }
    function tareasDelDia(dia) {
        const fecha = `${anio}-${String(mes+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
        return tareas.filter(t => t.fechaLimite === fecha);
    }

    const tareasHoy = tareasDelDia(diaSeleccionado);

    return (
        <div style={{ padding: "1rem" }}>
            {/* Cabecera del mes */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <button onClick={anterior} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#185FA5" }}>‹</button>
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>{MESES[mes]} {anio}</h2>
                <button onClick={siguiente} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#185FA5" }}>›</button>
            </div>

            {/* Cabecera días semana */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center", marginBottom: "4px" }}>
                {["L","M","X","J","V","S","D"].map(d => (
                    <div key={d} style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", padding: "4px 0" }}>{d}</div>
                ))}
            </div>

            {/* Días del mes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px" }}>
                {Array.from({ length: offset }).map((_, i) => <div key={"e"+i} />)}
                {Array.from({ length: diasMes }, (_, i) => i + 1).map(dia => {
                    const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear();
                    const seleccionado = dia === diaSeleccionado;
                    return (
                        <div key={dia} onClick={() => setDia(dia)}
                             style={{ textAlign: "center", padding: "6px 0 4px", borderRadius: "8px", cursor: "pointer",
                                 background: esHoy ? "#185FA5" : seleccionado ? "#EBF4FB" : "transparent",
                                 color: esHoy ? "white" : "#1a1a2e", fontSize: "13px", fontWeight: esHoy ? "600" : "400" }}>
                            {dia}
                            <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginTop: "2px" }}>
                                {tieneClase(dia) && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: esHoy ? "white" : "#185FA5" }} />}
                                {tieneExtra(dia) && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: esHoy ? "white" : "#0F6E56" }} />}
                                {tareasDelDia(dia).length > 0 && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: esHoy ? "white" : "#E24B4A" }} />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Leyenda */}
            <div style={{ display: "flex", gap: "14px", marginTop: "12px", marginBottom: "16px" }}>
                {[["#185FA5","Clase"],["#0F6E56","Extraescolar"],["#E24B4A","Tarea"]].map(([c,l]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#64748b" }}>
                        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: c }} />{l}
                    </div>
                ))}
            </div>

            {/* Tareas del día seleccionado */}
            {tareasHoy.length > 0 && (
                <>
                    <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px" }}>Tareas · {diaSeleccionado}/{mes+1}</p>
                    {tareasHoy.map(t => (
                        <div key={t.id} style={{ background: "white", borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}>
                            <span style={{ marginRight: "8px" }}>{t.completada ? "✅" : "⬜"}</span>{t.titulo}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}