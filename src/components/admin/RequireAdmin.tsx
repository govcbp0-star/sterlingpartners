import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../contexts/useAdminAuth";

export default function RequireAdmin() {
  const { user, isAdmin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return <main className="admin-page"><div className="admin-panel">Checking admin session…</div></main>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
