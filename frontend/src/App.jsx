import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Login";
import PanelLayout from "./components/PanelLayout";

// Pages
import AdminUsers from "./pages/AdminUsers";
import UserTasks from "./pages/UserTasks";

const isLoggedIn = () => !!localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  // ================= ADMIN ROUTES =================
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

  // ================= USER ROUTES =================
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

  // Wildcard redirect
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
