import { ChefHat, ShieldCheck, Truck, Users, MapPin } from "lucide-react";

export interface Empleado {
  usuario_id: number;
  email: string;
  nombre_completo: string;
  telefono: string | null;
  rol_id: number;
  rol_nombre: string;
  zona_reparto_id: number | null;
  zona_nombre: string | null;
}

interface UserTableProps {
  empleados: Empleado[];
  cargando?: boolean;
}

const obtenerIconoRol = (rolId: number) => {
  switch (rolId) {
    case 1:
      return <ShieldCheck size={16} />;
    case 2:
      return <ChefHat size={16} />;
    case 3:
      return <Truck size={16} />;
    default:
      return <Users size={16} />;
  }
};

const obtenerColorRol = (rolId: number) => {
  switch (rolId) {
    case 1:
      return "bg-purple-100 text-purple-700";
    case 2:
      return "bg-orange-100 text-orange-700";
    case 3:
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function UserTable({
  empleados,
  cargando = false,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="w-full min-w-[720px] text-left">
        <thead className="bg-surface-muted text-xs uppercase tracking-wide text-text-muted">
          <tr>
            <th className="px-6 py-4 font-semibold">Empleado</th>
            <th className="px-6 py-4 font-semibold">Teléfono</th>
            <th className="px-6 py-4 font-semibold">Rol</th>
            <th className="px-6 py-4 font-semibold">Zona de reparto</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {cargando ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-12 text-center text-text-muted"
              >
                Cargando empleados...
              </td>
            </tr>
          ) : empleados.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-12 text-center text-text-muted"
              >
                No se encontraron empleados.
              </td>
            </tr>
          ) : (
            empleados.map((empleado) => (
              <tr
                key={empleado.usuario_id}
                className="transition hover:bg-surface-muted/50"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-text-main">
                    {empleado.nombre_completo}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    {empleado.email}
                  </p>
                </td>

                <td className="px-6 py-4 text-sm text-text-muted">
                  {empleado.telefono || "No registrado"}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${obtenerColorRol(
                      empleado.rol_id,
                    )}`}
                  >
                    {obtenerIconoRol(empleado.rol_id)}
                    {empleado.rol_nombre}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {empleado.zona_reparto_id !== null ? (
                    <div className="flex items-center gap-2 text-sm text-text-main">
                      <MapPin size={16} className="text-primary" />
                      <span>
                        {empleado.zona_nombre ||
                          `Zona ${empleado.zona_reparto_id}`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-text-muted">
                      Sin zona asignada
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
