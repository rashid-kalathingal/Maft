import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/stores/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useAuth((s) => s.session);
  const location = useLocation();
  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
