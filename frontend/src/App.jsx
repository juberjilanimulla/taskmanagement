import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Sidebar from "./components/Sidebar";

// Pages
import Login from "../src/components/Login";

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

  {
    path: "/admin",
    element:
      isLoggedIn() && getRole() === "admin" ? (
        <PanelLayout />
      ) : (
        <Navigate to="/" />
      ),
    children: [
      // { path: "dashboard", element: <AdminDashboard /> },
      // { path: "users", element: <AdminUsers /> },
    ],
  },

  {
    path: "/user",
    element:
      isLoggedIn() && getRole() === "user" ? (
        <PanelLayout />
      ) : (
        <Navigate to="/" />
      ),
    // children: [
    //   { path: "tasks", element: <UserTasks /> },
    //   { path: "tasks/create", element: <CreateTask /> },
    //   { path: "tasks/edit/:id", element: <EditTask /> },
    // ],
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
