// =============================================================
// ProtectedRoute.jsx
// Redirects to /login if the user is not authenticated.
// Wraps any route that requires a valid session.
// =============================================================

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default ProtectedRoute;
