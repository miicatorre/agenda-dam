export default function ClaseCard({ clase }) {
    return (
        <div className="clase-card" style={{ borderLeftColor: clase.color }}>
            <div className="clase-nombre">{clase.nombre}</div>
            <div className="clase-info">
                {clase.aula} · {clase.horaInicio}–{clase.horaFin}
            </div>
        </div>
    );
}

// Añade en index.css:
// .clase-card { border-left: 4px solid; border-radius: 8px;
//   padding: 8px 12px; background: white; margin-bottom: 6px; }
// .clase-nombre { font-weight: 600; font-size: 14px; }
// .clase-info { font-size: 12px; color: #64748b; margin-top: 2px; }