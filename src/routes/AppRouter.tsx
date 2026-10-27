import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import UsuariosPage from "../pages/UsuariosPage";
import AdminLayout from "../components/layout/AdminLayout";

export default function AppRouter() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token"),
  );

  useEffect(() => {
    const actualizarSesion = () => {
      setToken(localStorage.getItem("access_token"));
    };

    window.addEventListener("auth-changed", actualizarSesion);
    window.addEventListener("storage", actualizarSesion);

    return () => {
      window.removeEventListener("auth-changed", actualizarSesion);
      window.removeEventListener("storage", actualizarSesion);
    };
  }, []);

  return (
    <Routes>
      {/* Inicio de sesión */}
      <Route
        path="/login"
        element={token ? <Navigate to="/usuarios" replace /> : <LoginPage />}
      />

      {/* Ruta principal */}
      <Route
        path="/"
        element={<Navigate to={token ? "/usuarios" : "/login"} replace />}
      />

      {/* Rutas protegidas */}
      <Route
        element={token ? <AdminLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/usuarios" element={<UsuariosPage />} />
      </Route>

      {/* Rutas inexistentes */}
      <Route
        path="*"
        element={<Navigate to={token ? "/usuarios" : "/login"} replace />}
      />
    </Routes>
  );
}
