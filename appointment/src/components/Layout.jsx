// src/components/Layout.js
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
// import Sidebar from "./Sidebar"; // your custom sidebar component
  

import "./Layout.css"; // optional, for styling

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Hide layout on login or signup pages
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";

  if (!user || isAuthPage) return children;

  return (
    <div className="app-layout">
      {/* <Sidebar /> */}
      <div className="main-content">
        
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
