export type RolId = 1 | 2 | 3 | 4;

export interface Rol {
  rol_id: RolId;
  nombre_rol: string;
}

export const ROLES: Rol[] = [
  { rol_id: 1, nombre_rol: "Administrador" },
  { rol_id: 2, nombre_rol: "Cocina" },
  { rol_id: 3, nombre_rol: "Delivery" },
  { rol_id: 4, nombre_rol: "Cliente" },
];

export type EstadoUsuario = "activo" | "inactivo";

export interface Usuario {
  id: number;
  nombre_completo: string;
  email: string;
  telefono: string | null;
  rol_id: RolId;
  nombre_rol?: string;
  zona_reparto_id: number | null;
}

export interface CrearEmpleadoDTO {
  email: string;
  password: string;
  nombre_completo: string;
  telefono: string | null;
  rol_id: RolId;
  zona_reparto_id: number | null;
}

export interface LoginDTO {
  email: string;
  password: string;
}
