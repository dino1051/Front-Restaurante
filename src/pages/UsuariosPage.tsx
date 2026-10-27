import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Search,
  Plus,
  Users,
  ShieldCheck,
  ChefHat,
  Truck,
  X,
  LoaderCircle,
  MapPin,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import UserMetrics from "../components/usuarios/UserMetrics";

type RolId = 1 | 2 | 3;

interface Empleado {
  usuario_id: number;
  email: string;
  nombre_completo: string;
  telefono: string | null;
  rol_id: number;
  rol_nombre: string;
  zona_reparto_id: number | null;
  zona_nombre: string | null;
}

interface Zona {
  zona_id: number;
  nombre_zona: string;
}

interface CrearEmpleadoDTO {
  email: string;
  password: string;
  nombre_completo: string;
  telefono: string | null;
  rol_id: RolId;
  zona_reparto_id: number | null;
}

const ROLES: { id: RolId; nombre: string }[] = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Cocina" },
  { id: 3, nombre: "Delivery" },
];

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

export default function UsuariosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("todos");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rolId, setRolId] = useState<RolId>(2);

  const [zonaId, setZonaId] = useState("");
  const [zona, setZona] = useState<Zona | null>(null);
  const [consultandoZona, setConsultandoZona] = useState(false);

  // Obtener empleados desde el backend.
  const cargarEmpleados = () => {
    setCargando(true);

    api
      .get<Empleado[]>("/admin/empleados")
      .then((respuesta) => {
        setEmpleados(respuesta.data);
      })
      .catch((error) => {
        console.error(
          "Error al cargar empleados:",
          error.response?.status,
          error.response?.data,
        );

        if (error.response?.status === 401) {
          toast.error("Tu sesión expiró o necesitas iniciar sesión");
        } else if (error.response?.status === 403) {
          toast.error("No tienes permisos para consultar empleados");
        } else {
          toast.error("No se pudieron cargar los empleados");
        }
      })
      .finally(() => {
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // Consultar una zona específica por su ID.
  const consultarZona = () => {
    const id = Number(zonaId);

    if (!zonaId.trim()) {
      setZona(null);
      return;
    }

    if (!Number.isInteger(id) || id <= 0) {
      setZona(null);
      toast.error("Ingresa un ID de zona válido");
      return;
    }

    setConsultandoZona(true);
    setZona(null);

    api
      .get<Zona>(`/admin/zonas/${id}`)
      .then((respuesta) => {
        setZona(respuesta.data);
        toast.success(`Zona encontrada: ${respuesta.data.nombre_zona}`);
      })
      .catch((error) => {
        console.error("Error al consultar zona:", error);
        setZona(null);
        toast.error("No se encontró la zona indicada");
      })
      .finally(() => {
        setConsultandoZona(false);
      });
  };

  // Filtrar empleados por nombre, correo, rol o zona.
  const empleadosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return empleados.filter((empleado) => {
      const coincideBusqueda =
        empleado.nombre_completo.toLowerCase().includes(termino) ||
        empleado.email.toLowerCase().includes(termino) ||
        (empleado.rol_nombre ?? "").toLowerCase().includes(termino) ||
        (empleado.zona_nombre ?? "").toLowerCase().includes(termino);

      const coincideRol =
        rolFiltro === "todos" || empleado.rol_id === Number(rolFiltro);

      return coincideBusqueda && coincideRol;
    });
  }, [empleados, busqueda, rolFiltro]);

  // Métricas calculadas con los datos reales.
  const totalEmpleados = empleados.length;
  const totalAdministradores = empleados.filter(
    (empleado) => empleado.rol_id === 1,
  ).length;
  const totalCocina = empleados.filter(
    (empleado) => empleado.rol_id === 2,
  ).length;
  const totalDelivery = empleados.filter(
    (empleado) => empleado.rol_id === 3,
  ).length;

  const limpiarFormulario = () => {
    setNombreCompleto("");
    setEmail("");
    setPassword("");
    setTelefono("");
    setRolId(2);
    setZonaId("");
    setZona(null);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    limpiarFormulario();
  };

  const guardarEmpleado = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (nombreCompleto.trim().length < 1) {
      toast.error("Ingresa el nombre del empleado");
      return;
    }

    if (nombreCompleto.trim().length > 100) {
      toast.error("El nombre no puede superar los 100 caracteres");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Evitar asignar una zona que no se haya podido consultar.
    if (rolId === 3 && zonaId.trim() && !zona) {
      toast.error("Consulta la zona antes de guardar el empleado");
      return;
    }

    const datosEmpleado: CrearEmpleadoDTO = {
      nombre_completo: nombreCompleto.trim(),
      email: email.trim(),
      password,
      telefono: telefono.trim() || null,
      rol_id: rolId,
      zona_reparto_id: rolId === 3 && zona ? zona.zona_id : null,
    };

    setGuardando(true);

    api
      .post("/admin/empleados", datosEmpleado)
      .then(() => {
        toast.success("Empleado creado correctamente");
        cerrarModal();
        cargarEmpleados();
      })
      .catch((error) => {
        console.error("Error al crear empleado:", error);

        const mensaje = error?.response?.data?.message;

        toast.error(
          Array.isArray(mensaje)
            ? mensaje.join(", ")
            : mensaje || "No se pudo crear el empleado",
        );
      })
      .finally(() => {
        setGuardando(false);
      });
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-main">
            Gestión de empleados
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Administra las cuentas y los roles de tu equipo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
        >
          <Plus size={19} />
          Nuevo empleado
        </button>
      </div>

      {/* Métricas */}
      <UserMetrics
        totalEmpleados={totalEmpleados}
        totalAdministradores={totalAdministradores}
        totalCocina={totalCocina}
        totalDelivery={totalDelivery}
      />

      {/* Tabla y filtros */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar por nombre, correo, rol o zona..."
              className="w-full rounded-xl border border-border py-3 pl-10 pr-4 outline-none focus:border-primary"
            />
          </div>

          <select
            value={rolFiltro}
            onChange={(evento) => setRolFiltro(evento.target.value)}
            className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
          >
            <option value="todos">Todos los roles</option>
            {ROLES.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={cargarEmpleados}
            disabled={cargando}
            title="Actualizar empleados"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-text-main hover:bg-surface-muted disabled:opacity-50"
          >
            <RefreshCw size={17} className={cargando ? "animate-spin" : ""} />
            Actualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
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
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <LoaderCircle
                      className="mx-auto animate-spin text-primary"
                      size={28}
                    />
                    <p className="mt-3 text-sm text-text-muted">
                      Cargando empleados...
                    </p>
                  </td>
                </tr>
              ) : empleadosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-text-muted"
                  >
                    {empleados.length === 0
                      ? "Todavía no hay empleados registrados."
                      : "No se encontraron empleados con esos filtros."}
                  </td>
                </tr>
              ) : (
                empleadosFiltrados.map((empleado) => (
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
                      {empleado.zona_reparto_id ? (
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

        {!cargando && empleadosFiltrados.length > 0 && (
          <div className="border-t border-border px-6 py-4 text-sm text-text-muted">
            Mostrando {empleadosFiltrados.length} de {empleados.length}{" "}
            empleados
          </div>
        )}
      </section>

      {/* Modal de creación */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget && !guardando) {
              cerrarModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal"
            className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2
                  id="titulo-modal"
                  className="font-display text-xl font-bold text-text-main"
                >
                  Nuevo empleado
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  Completa los datos para crear su cuenta.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarModal}
                disabled={guardando}
                aria-label="Cerrar modal"
                className="rounded-lg p-2 text-text-muted hover:bg-surface-muted"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={guardarEmpleado} className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="nombre_completo"
                  className="mb-1.5 block text-sm font-medium text-text-main"
                >
                  Nombre completo
                </label>
                <input
                  id="nombre_completo"
                  name="nombre_completo"
                  value={nombreCompleto}
                  onChange={(evento) => setNombreCompleto(evento.target.value)}
                  maxLength={100}
                  required
                  autoComplete="name"
                  placeholder="Ej. Kevin Rodriguez"
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-text-main"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  required
                  autoComplete="email"
                  placeholder="empleado@correo.com"
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-text-main"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(evento) => setPassword(evento.target.value)}
                  minLength={6}
                  required
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-1.5 block text-sm font-medium text-text-main"
                  >
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(evento) => setTelefono(evento.target.value)}
                    autoComplete="tel"
                    placeholder="Opcional"
                    className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="rol_id"
                    className="mb-1.5 block text-sm font-medium text-text-main"
                  >
                    Rol
                  </label>
                  <select
                    id="rol_id"
                    name="rol_id"
                    value={rolId}
                    onChange={(evento) => {
                      const nuevoRol = Number(evento.target.value) as RolId;
                      setRolId(nuevoRol);

                      if (nuevoRol !== 3) {
                        setZonaId("");
                        setZona(null);
                      }
                    }}
                    required
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                  >
                    {ROLES.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {rolId === 3 && (
                <div className="rounded-xl border border-border bg-surface-muted/50 p-4">
                  <label
                    htmlFor="zona_reparto_id"
                    className="mb-1.5 block text-sm font-medium text-text-main"
                  >
                    Zona de reparto
                  </label>

                  <div className="flex gap-2">
                    <input
                      id="zona_reparto_id"
                      name="zona_reparto_id"
                      type="number"
                      min={1}
                      step={1}
                      value={zonaId}
                      onChange={(evento) => {
                        setZonaId(evento.target.value);
                        setZona(null);
                      }}
                      placeholder="ID de la zona"
                      className="min-w-0 flex-1 rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    />

                    <button
                      type="button"
                      onClick={consultarZona}
                      disabled={consultandoZona || !zonaId.trim()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-surface-muted disabled:opacity-50"
                    >
                      {consultandoZona ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <Search size={17} />
                      )}
                      Consultar
                    </button>
                  </div>

                  {zona && (
                    <p className="mt-3 flex items-center gap-2 text-sm font-medium text-green-700">
                      <MapPin size={16} />
                      Zona {zona.zona_id}: {zona.nombre_zona}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-text-muted">
                    Puedes dejar este campo vacío si el empleado no necesita una
                    zona asignada.
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cerrarModal}
                  disabled={guardando}
                  className="rounded-xl border border-border px-5 py-3 font-medium text-text-main hover:bg-surface-muted disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando || consultandoZona}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {guardando && (
                    <LoaderCircle size={18} className="animate-spin" />
                  )}
                  {guardando ? "Guardando..." : "Crear empleado"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
