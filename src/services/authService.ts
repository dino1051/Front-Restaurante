import api from "./api";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario_id: number;
  rol_id: number;
  nombre_completo: string;
  email: string;
}

export function iniciarSesion(datos: LoginDTO): Promise<LoginResponse> {
  return api.post<LoginResponse>("/auth/login", datos).then((respuesta) => {
    const usuario = respuesta.data;

    // Guardar token
    localStorage.setItem("access_token", usuario.access_token);

    // Guardar información del usuario
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        usuario_id: usuario.usuario_id,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        rol_id: usuario.rol_id,
      }),
    );

    // Avisar al Header que la sesión cambió
    window.dispatchEvent(new Event("auth-changed"));

    return usuario;
  });
}

export function cerrarSesion(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("usuario");

  window.dispatchEvent(new Event("auth-changed"));
}
