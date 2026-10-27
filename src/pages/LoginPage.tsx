import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ChefHat } from "lucide-react";
import toast from "react-hot-toast";
import { iniciarSesion } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const manejarLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Ingresa tu correo y contraseña");
      return;
    }

    setCargando(true);

    iniciarSesion({
      email: email.trim(),
      password,
    })
      .then(() => {
        toast.success("¡Bienvenido!");

        // Actualiza el Header con los datos del usuario autenticado.
        window.dispatchEvent(new Event("auth-changed"));

        // Redirige al panel después de iniciar sesión.
        navigate("/usuarios", { replace: true });
      })
      .catch((error: unknown) => {
        console.error("Error al iniciar sesión:", error);

        let mensaje = "No se pudo iniciar sesión. Verifica tus credenciales.";

        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const errorApi = error as {
            response?: {
              data?: {
                detail?: string;
                message?: string;
              };
            };
          };

          mensaje =
            errorApi.response?.data?.detail ??
            errorApi.response?.data?.message ??
            mensaje;
        }

        toast.error(mensaje);
      })
      .finally(() => {
        setCargando(false);
      });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F6F0] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-[#E9E4D8] bg-white p-8 shadow-xl shadow-[#493A2A]/5 sm:p-10">
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B9382F] text-white shadow-lg shadow-[#B9382F]/20">
            <ChefHat size={34} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#302B25]">
            El Sabor del Chef
          </h1>

          <p className="mt-2 text-sm text-[#82796D]">Panel de administración</p>
        </div>

        {/* Introducción */}
        <div className="mb-7">
          <h2 className="text-xl font-semibold text-[#302B25]">
            ¡Qué bueno tenerte aquí!
          </h2>

          <p className="mt-1 text-sm text-[#82796D]">
            Inicia sesión para continuar.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarLogin} className="space-y-5">
          {/* Correo */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#302B25]"
            >
              Correo electrónico
            </label>

            <div className="relative">
              <Mail
                size={19}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9185]"
              />

              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ejemplo.com"
                required
                disabled={cargando}
                className="w-full rounded-xl border border-[#E5DED2] bg-[#FFFEFC] py-3 pl-11 pr-4 text-sm text-[#302B25] outline-none transition placeholder:text-[#B1A89B] focus:border-[#B9382F] focus:ring-2 focus:ring-[#B9382F]/10 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#302B25]"
            >
              Contraseña
            </label>

            <div className="relative">
              <LockKeyhole
                size={19}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9185]"
              />

              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                disabled={cargando}
                className="w-full rounded-xl border border-[#E5DED2] bg-[#FFFEFC] py-3 pl-11 pr-12 text-sm text-[#302B25] outline-none transition placeholder:text-[#B1A89B] focus:border-[#B9382F] focus:ring-2 focus:ring-[#B9382F]/10 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                disabled={cargando}
                aria-label={
                  mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A9185] transition hover:text-[#302B25] disabled:opacity-60"
              >
                {mostrarPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Botón de acceso */}
          <button
            type="submit"
            disabled={cargando}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B9382F] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#B9382F]/15 transition hover:bg-[#9F2E27] focus:outline-none focus:ring-2 focus:ring-[#B9382F]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Pie */}
        <p className="mt-8 text-center text-xs text-[#A39A8D]">
          Acceso exclusivo para el personal autorizado.
        </p>
      </section>
    </main>
  );
}
