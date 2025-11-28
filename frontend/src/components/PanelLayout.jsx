import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import "../styles/PanelLayout.css";
import Sidebar from "./Sidebar";

const isLoggedIn = () => !!localStorage.getItem("token");

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

export default PanelLayout;
