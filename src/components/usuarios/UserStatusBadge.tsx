import type { EstadoUsuario } from "../../types/usuario";

interface UserStatusBadgeProps {
  estado: EstadoUsuario;
}

export function UserStatusBadge({ estado }: UserStatusBadgeProps) {
  const estilos =
    estado === "activo"
      ? "bg-secondary-light text-secondary"
      : "bg-gray-100 text-gray-500";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${estilos}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          estado === "activo" ? "bg-secondary" : "bg-gray-400"
        }`}
      />

      {estado === "activo" ? "Activo" : "Inactivo"}
    </span>
  );
}
