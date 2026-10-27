import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  ChefHat,
} from "lucide-react";

const opcionesNavegacion = [
  {
    nombre: "Dashboard",
    ruta: "/dashboard",
    icono: LayoutDashboard,
  },
  {
    nombre: "Pedidos",
    ruta: "/pedidos",
    icono: ClipboardList,
  },
  {
    nombre: "Platillos",
    ruta: "/platillos",
    icono: UtensilsCrossed,
  },
  {
    nombre: "Usuarios",
    ruta: "/usuarios",
    icono: Users,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 flex-col justify-between border-r border-border bg-surface p-4 md:flex">
      <nav className="space-y-2">
        {opcionesNavegacion.map((opcion) => {
          const Icono = opcion.icono;

          return (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-text-muted hover:bg-surface-muted hover:text-text-main",
                ].join(" ")
              }
            >
              <Icono size={20} />

              <span>{opcion.nombre}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-xl bg-surface-muted p-3">
        <div className="flex items-center gap-2">
          <ChefHat size={18} className="text-secondary" />

          <span className="text-xs font-semibold text-text-main">
            El Sabor del Chef
          </span>
        </div>

        <p className="mt-2 text-xs text-text-muted">Panel de administración</p>
      </div>
    </aside>
  );
}
