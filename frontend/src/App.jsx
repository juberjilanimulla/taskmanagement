import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

// Pages
import AdminUsers from "./pages/AdminUsers";
import UserTasks from "./pages/UserTasks";

const isLoggedIn = () => !!localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

const PanelLayout = () => {
  if (!isLoggedIn()) return <Navigate to="/" />;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  // ADMIN ROUTES
  {
    path: "/admin",
    element:
      isLoggedIn() && getRole() === "admin" ? (
        <PanelLayout />
      ) : (
        <Navigate to="/" />
      ),
    children: [{ path: "users", element: <AdminUsers /> }],
  },

  // USER ROUTES
  {
    path: "/user",
    element:
      isLoggedIn() && getRole() === "user" ? (
        <PanelLayout />
      ) : (
        <Navigate to="/" />
      ),
    children: [{ path: "tasks", element: <UserTasks /> }],
  },

  { path: "*", element: <Navigate to="/" /> },
]);

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} theme="colored" />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
