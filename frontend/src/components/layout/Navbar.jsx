// =============================================================
// Navbar.jsx — Top navigation bar
// =============================================================

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/projects">📋 Mini Project Board</Link>
      </div>

      <div className="navbar__right">
        <span className="navbar__user">👤 {user?.name}</span>
        <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
