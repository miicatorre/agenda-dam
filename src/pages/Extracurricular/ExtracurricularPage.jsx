import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage.js";
import { INITIAL_EXTRAESCOLARES } from "../../data/initialData.js";

const DIAS_NOMBRE = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

export default function ExtracurricularPage() {
    const [extras, setExtras] = useLocalStorage("extraescolares", INITIAL_EXTRAESCOLARES);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [form, setForm] = useState({ nombre: "", emoji: "🏃", dias: [], horaInicio: "", horaFin: "", color: "#185FA5" });

    const hoy = new Date().getDay();
    const proximasSesiones = extras
        .flatMap(e => e.dias.map(d => ({ ...e, diaNum: d })))
        .sort((a, b) => {
            const da = (a.diaNum - hoy + 7) % 7 || 7;
            const db = (b.diaNum - hoy + 7) % 7 || 7;
            return da - db || a.horaInicio.localeCompare(b.horaInicio);
        })
        .slice(0, 5);

    function toggleDia(d) {
        setForm(p => ({
            ...p,
            dias: p.dias.includes(d) ? p.dias.filter(x => x !== d) : [...p.dias, d]
        }));
    }

    function añadirExtra(e) {
        e.preventDefault();
        if (!form.nombre.trim() || form.dias.length === 0) return;
        setExtras(prev => [...prev, { id: Date.now(), ...form }]);
        setForm({ nombre: "", emoji: "🏃", dias: [], horaInicio: "", horaFin: "", color: "#185FA5" });
        setMostrarForm(false);
    }

    function eliminarExtra(id) {
        setExtras(prev => prev.filter(e => e.id !== id));
    }

    const totalHorasSemanales = extras.reduce((acc, e) => {
        const [hi, mi] = e.horaInicio.split(":").map(Number);
        const [hf, mf] = e.horaFin.split(":").map(Number);
        const minutos = e.dias.length * ((hf * 60 + mf) - (hi * 60 + mi));
        return acc + minutos / 60;
    }, 0).toFixed(1);

    return (
        <div style={{ padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h1 style={{ fontSize: "20px", fontWeight: "600" }}>Extracurricular</h1>
                <button onClick={() => setMostrarForm(f => !f)}
                        style={{ background: "#185FA5", color: "white", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: "500" }}>
                    {mostrarForm ? "Cancelar" : "+ Añadir"}
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1.25rem" }}>
                <div style={{ background: "white", borderRadius: "10px", padding: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "24px", fontWeight: "600" }}>{extras.length}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>Actividades activas</div>
                </div>
                <div style={{ background: "white", borderRadius: "10px", padding: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "24px", fontWeight: "600" }}>{totalHorasSemanales}h</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>Horas / semana</div>
                </div>
            </div>

            {/* Formulario */}
            {mostrarForm && (
                <form onSubmit={añadirExtra}
                      style={{ background: "white", borderRadius: "12px", padding: "1rem", marginBottom: "1rem", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: "10px", marginBottom: "10px" }}>
                        <div>
                            <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px" }}>Emoji</label>
                            <input value={form.emoji} onChange={e => setForm(p => ({...p, emoji: e.target.value}))}
                                   style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "20px", textAlign: "center" }} />
                        </div>
                        <div>
                            <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px" }}>Nombre *</label>
                            <input value={form.nombre} onChange={e => setForm(p => ({...p, nombre: e.target.value}))}
                                   placeholder="Nombre de la actividad" required
                                   style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" }} />
                        </div>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "6px" }}>Días *</label>
                        <div style={{ display: "flex", gap: "6px" }}>
                            {[1,2,3,4,5,6].map(d => (
                                <button type="button" key={d} onClick={() => toggleDia(d)}
                                        style={{ flex: 1, padding: "6px 2px", borderRadius: "6px", border: "1.5px solid",
                                            borderColor: form.dias.includes(d) ? "#185FA5" : "#e2e8f0",
                                            background: form.dias.includes(d) ? "#185FA5" : "white",
                                            color: form.dias.includes(d) ? "white" : "#64748b",
                                            fontSize: "12px", cursor: "pointer" }}>
                                    {DIAS_NOMBRE[d]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                        <div>
                            <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px" }}>Hora inicio</label>
                            <input type="time" value={form.horaInicio} onChange={e => setForm(p => ({...p, horaInicio: e.target.value}))}
                                   style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                        </div>
                        <div>
                            <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px" }}>Hora fin</label>
                            <input type="time" value={form.horaFin} onChange={e => setForm(p => ({...p, horaFin: e.target.value}))}
                                   style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                        </div>
                    </div>
                    <button type="submit"
                            style={{ width: "100%", padding: "10px", background: "#185FA5", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                        Guardar actividad
                    </button>
                </form>
            )}

            {/* Tarjetas de actividades */}
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>Mis actividades</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1.25rem" }}>
                {extras.map(e => (
                    <div key={e.id} style={{ background: "white", borderRadius: "12px", padding: "12px", border: "1px solid #e2e8f0", position: "relative" }}>
                        <button onClick={() => eliminarExtra(e.id)}
                                style={{ position: "absolute", top: "8px", right: "8px", background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "14px" }}>✕</button>
                        <div style={{ fontSize: "24px", marginBottom: "6px" }}>{e.emoji}</div>
                        <div style={{ fontWeight: "600", fontSize: "13px" }}>{e.nombre}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", margin: "2px 0" }}>
                            {e.dias.map(d => DIAS_NOMBRE[d]).join(" · ")}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{e.horaInicio} – {e.horaFin}</div>
                        <div style={{ marginTop: "8px", background: "#f0f4f8", borderRadius: "20px", height: "5px" }}>
                            <div style={{ height: "5px", borderRadius: "20px", background: e.color, width: `${Math.min(e.dias.length * 20, 100)}%` }} />
                        </div>
                    </div>
                ))}
                <div onClick={() => setMostrarForm(true)}
                     style={{ background: "transparent", border: "1.5px dashed #cbd5e1", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100px", cursor: "pointer", gap: "6px" }}>
                    <span style={{ fontSize: "24px", color: "#cbd5e1" }}>+</span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Añadir</span>
                </div>
            </div>

            {/* Próximas sesiones */}
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Próximas sesiones</p>
            {proximasSesiones.map((e, i) => (
                <div key={i} style={{ background: "white", borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", display: "flex", gap: "10px", alignItems: "center", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "20px" }}>{e.emoji}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: "500" }}>{e.nombre}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{DIAS_NOMBRE[e.diaNum]} · {e.horaInicio}</div>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "500", background: "#EBF4FB", color: "#185FA5", padding: "3px 9px", borderRadius: "20px" }}>
            {(e.diaNum - hoy + 7) % 7 === 0 ? "Hoy" : (e.diaNum - hoy + 7) % 7 === 1 ? "Mañana" : DIAS_NOMBRE[e.diaNum]}
          </span>
                </div>
            ))}
        </div>
    );
}