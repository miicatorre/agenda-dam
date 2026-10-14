import { NavLink } from "react-router-dom";
import "./Navbar.css";

const tabs = [
    { to: "/",               icon: "🗓", label: "Horario"        },
    { to: "/calendario",    icon: "📅", label: "Calendario"     },
    { to: "/tareas",        icon: "✅", label: "Tareas"         },
    { to: "/extracurricular", icon: "🏆", label: "Extra"        },
    { to: "/classroom",     icon: "📚", label: "Classroom"      },
];

export default function Navbar() {
    return (
        <nav className="navbar">
            {tabs.map(({ to, icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) => isActive ? "nav-tab active" : "nav-tab"}
                >
                    <span className="nav-icon">{icon}</span>
                    <span className="nav-label">{label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
