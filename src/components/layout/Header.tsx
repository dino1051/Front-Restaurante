import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, UserRound, LogOut, ChevronDown } from "lucide-react";
import { cerrarSesion } from "../../services/authService";

interface UsuarioAutenticado {
  usuario_id: number;
  nombre_completo: string;
  email: string;
  rol_id: number;
}

const nombresRoles: Record<number, string> = {
  1: "Administrador",
  2: "Cocina",
  3: "Delivery",
  4: "Cliente",
};

function obtenerUsuario(): UsuarioAutenticado | null {
  const token = localStorage.getItem("access_token");
  const datos = localStorage.getItem("usuario");

  if (!token || !datos) {
    return null;
  }

  try {
    return JSON.parse(datos) as UsuarioAutenticado;
  } catch {
    return null;
  }
}

export default function Header() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(
    obtenerUsuario,
  );

  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const actualizarUsuario = () => {
      setUsuario(obtenerUsuario());
    };

    window.addEventListener("auth-changed", actualizarUsuario);
    window.addEventListener("storage", actualizarUsuario);

    return () => {
      window.removeEventListener("auth-changed", actualizarUsuario);
      window.removeEventListener("storage", actualizarUsuario);
    };
  }, []);

  const manejarCerrarSesion = () => {
    cerrarSesion();
    setUsuario(null);
    setMenuAbierto(false);

    navigate("/login", { replace: true });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-surface px-4 shadow-sm sm:px-6">
      {/* Logo y nombre */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
          <ChefHat size={25} />
        </div>

        <div>
          <h1 className="font-display text-lg font-bold leading-tight sm:text-xl">
            El Sabor del Chef
          </h1>

          <p className="text-xs text-text-muted">Sistema de gestión</p>
        </div>
      </div>

      {/* Usuario autenticado o botón de login */}
      {usuario ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-black/5"
            aria-expanded={menuAbierto}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8E9E4] text-[#B9382F]">
              <UserRound size={21} />
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-40 truncate text-sm font-semibold text-[#302B25]">
                {usuario.nombre_completo}
              </p>

              <p className="text-xs text-[#82796D]">
                {nombresRoles[usuario.rol_id] ?? "Usuario"}
              </p>
            </div>

            <ChevronDown size={16} className="text-[#82796D]" />
          </button>

          {menuAbierto && (
            <>
              {/* Capa para cerrar el menú al hacer clic fuera */}
              <button
                type="button"
                aria-label="Cerrar menú"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuAbierto(false)}
              />

              <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl border border-[#E9E4D8] bg-white p-2 shadow-xl">
                <div className="border-b border-[#E9E4D8] px-3 py-3">
                  <p className="truncate text-sm font-semibold text-[#302B25]">
                    {usuario.nombre_completo}
                  </p>

                  <p className="truncate text-xs text-[#82796D]">
                    {usuario.email}
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#B9382F]">
                    {nombresRoles[usuario.rol_id] ?? "Usuario"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={manejarCerrarSesion}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#B9382F] transition hover:bg-[#FDF0ED]"
                >
                  <LogOut size={17} />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 rounded-xl bg-[#B9382F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9F2E27]"
        >
          <UserRound size={18} />
          Iniciar sesión
        </button>
      )}
    </header>
  );
}
