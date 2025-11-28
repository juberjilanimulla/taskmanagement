import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaBriefcase,
  FaUsers,
} from "react-icons/fa";
import "../styles/Sidebar.css";
import sidebarpng from "/assets/Sidebar/jm.png";

const Sidebar = () => {
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <a href="/">
          <img src={sidebarpng} alt="Logo" />
        </a>
      </div>

      <nav className="admin-sidebar-nav">
        {/* ADMIN SIDEBAR */}
        {role === "admin" && (
          <>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? "admin-sidebar-link active" : "admin-sidebar-link"
              }
            >
              <FaUsers />
              <span>Users</span>
            </NavLink>
          </>
        )}

        {/* USER SIDEBAR */}
        {role === "user" && (
          <>
            <NavLink
              to="/user/tasks"
              className={({ isActive }) =>
                isActive ? "admin-sidebar-link active" : "admin-sidebar-link"
              }
            >
              <FaBriefcase />
              <span>My Tasks</span>
            </NavLink>
          </>
        )}

        <button className="admin-sidebar-link logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
