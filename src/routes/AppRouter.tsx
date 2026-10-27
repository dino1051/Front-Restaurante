import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
//import DashboardPage from "../pages/DashboardPage";
import UsuariosPage from "../pages/UsuariosPage";
import AdminLayout from "../components/layout/AdminLayout";

export default function AppRouter() {
  const token = localStorage.getItem("access_token");

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        element={token ? <AdminLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/usuarios" element={<UsuariosPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
