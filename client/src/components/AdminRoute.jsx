
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        <p>Checking admin access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>Your account does not have admin access.</p>
        <p>
          Current role: {user?.role ?? "Not found"}
        </p>
        <button onClick={() => window.location.reload()}>
          Refresh Page
        </button>
      </div>
    );
  }

  return <Outlet />;
}

export default AdminRoute;