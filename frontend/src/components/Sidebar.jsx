import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaSignOutAlt, FaBriefcase } from "react-icons/fa";
import "../styles/Sidebar.css";
import sidebarpng from "../../public/assets/Sidebar/tm.png";

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <a href="/">
          <img src={sidebarpng} alt="Admin Logo" />
        </a>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "admin-sidebar-link active" : "admin-sidebar-link"
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/tasks"
          className={({ isActive }) =>
            isActive ? "admin-sidebar-link active" : "admin-sidebar-link"
          }
        >
          <FaBriefcase />
          <span>Tasks</span>
        </NavLink>

        <button className="admin-sidebar-link logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
