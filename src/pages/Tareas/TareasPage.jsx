import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage.js";
import { INITIAL_TAREAS, INITIAL_CLASES } from "../../data/initialData.js";

export default function TareasPage() {
    const [tareas, setTareas] = useLocalStorage("tareas", INITIAL_TAREAS);
    const [clases]            = useLocalStorage("clases", INITIAL_CLASES);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [form, setForm] = useState({
        titulo: "", asignaturaId: "", fechaLimite: "", enlace: ""
    });

    const pendientes  = tareas.filter(t => !t.completada);
    const completadas = tareas.filter(t => t.completada);

    function toggleTarea(id) {
        setTareas(prev => prev.map(t =>
            t.id === id ? { ...t, completada: !t.completada } : t
        ));
    }

    function eliminarTarea(id) {
        setTareas(prev => prev.filter(t => t.id !== id));
    }

    function añadirTarea(e) {
        e.preventDefault();
        if (!form.titulo.trim()) return;
        const nueva = {
            id: Date.now(),
            titulo: form.titulo,
            asignaturaId: Number(form.asignaturaId) || null,
            fechaLimite: form.fechaLimite,
            enlace: form.enlace,
            completada: false
        };
        setTareas(prev => [nueva, ...prev]);
        setForm({ titulo: "", asignaturaId: "", fechaLimite: "", enlace: "" });
        setMostrarForm(false);
    }

    const asig = id => clases.find(c => c.id === id);

    return (
        <div style={{ padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h1 style={{ fontSize: "20px", fontWeight: "600" }}>Tareas</h1>
                <button onClick={() => setMostrarForm(f => !f)}
                        style={{ background: "#185FA5", color: "white", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: "500" }}>
                    {mostrarForm ? "Cancelar" : "+ Añadir"}
                </button>
            </div>

            {/* Formulario de nueva tarea */}
            {mostrarForm && (
                <form onSubmit={añadirTarea}
                      style={{ background: "white", borderRadius: "12px", padding: "1rem", marginBottom: "1rem", border: "1px solid #e2e8f0" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px" }}>Título *</label>
                        <input value={form.titulo} onChange={e => setForm(p => ({...p, titulo: e.target.value}))}
                               placeholder="Describe la tarea..." required
                               style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                        <div>
                            <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px" }}>Asignatura</label>
                            <select value={form.asignaturaId} onChange={e => setForm(p => ({...p, asignaturaId: e.target.value}))}
                                    style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" }}>
                                <option value="">Sin asignatura</option>
                                {clases.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px" }}>Fecha límite</label>
                            <input type="date" value={form.fechaLimite} onChange={e => setForm(p => ({...p, fechaLimite: e.target.value}))}
                                   style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" }} />
                        </div>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                        <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px" }}>Enlace (URL opcional)</label>
                        <input type="url" value={form.enlace} onChange={e => setForm(p => ({...p, enlace: e.target.value}))}
                               placeholder="https://classroom.google.com/..."
                               style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" }} />
                    </div>
                    <button type="submit"
                            style={{ width: "100%", padding: "10px", background: "#185FA5", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                        Guardar tarea
                    </button>
                </form>
            )}

            {/* Lista de pendientes */}
            {pendientes.length > 0 && (
                <>
                    <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Pendientes ({pendientes.length})</p>
                    {pendientes.map(t => <TareaCard key={t.id} tarea={t} asig={asig} onToggle={toggleTarea} onDelete={eliminarTarea} />)}
                </>
            )}

            {/* Lista de completadas */}
            {completadas.length > 0 && (
                <>
                    <p style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "1rem 0 8px" }}>Completadas ({completadas.length})</p>
                    {completadas.map(t => <TareaCard key={t.id} tarea={t} asig={asig} onToggle={toggleTarea} onDelete={eliminarTarea} />)}
                </>
            )}
        </div>
    );
}

function TareaCard({ tarea, asig, onToggle, onDelete }) {
    const a = asig(tarea.asignaturaId);
    return (
        <div style={{ background: "white", borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", display: "flex", gap: "10px", alignItems: "center", border: "1px solid #e2e8f0" }}>
            <button onClick={() => onToggle(tarea.id)}
                    style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${tarea.completada ? "#185FA5" : "#cbd5e1"}`, background: tarea.completada ? "#185FA5" : "transparent", flexShrink: 0, cursor: "pointer" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: "500", textDecoration: tarea.completada ? "line-through" : "none", color: tarea.completada ? "#94a3b8" : "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tarea.titulo}
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "3px" }}>
                    {a && <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "20px", background: a.color + "22", color: a.color, fontWeight: "500" }}>{a.nombre}</span>}
                    {tarea.fechaLimite && <span style={{ fontSize: "11px", color: "#94a3b8" }}>{new Date(tarea.fechaLimite + "T00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>}
                </div>
            </div>
            {tarea.enlace && <a href={tarea.enlace} target="_blank" rel="noreferrer" style={{ color: "#185FA5", fontSize: "16px", textDecoration: "none" }}>↗</a>}
            <button onClick={() => onDelete(tarea.id)} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "16px" }}>✕</button>
        </div>
    );
}