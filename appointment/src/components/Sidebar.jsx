import React, { useState } from "react";
import {
  FaHome,
  FaUserFriends,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBars,
  FaUserPlus,
  FaUserMd,
  FaFileInvoiceDollar,
  FaCapsules,
  FaEnvelopeOpenText,
  FaBox,
  FaTruck
} from "react-icons/fa"; // add more icons as needed
import "../style/Sidebar.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCalendarCheck } from "react-icons/fa";
// import { FaClipboardCheck } from "react-icons/fa";




const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

 const baseMenuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
  { name: "Google Sheet", icon: <FaFileInvoiceDollar />, path: "/google-sheet" },

  { name: "Patients", icon: <FaUserFriends />, path: "/patients" },
  { name: "Appointments", icon: <FaCalendarAlt />, path: "/appointments" },
  { name: "Assistant Doctor", icon: <FaUserMd />, path: "/assistant-doctor" },
  { name: "Account", icon: <FaFileInvoiceDollar />, path: "/account" },
  { name: "Medicine", icon: <FaCapsules />, path: "/medicine" },
  { name: "Chithi", icon: <FaEnvelopeOpenText />, path: "/chithi" },
  { name: "Packaging", icon: <FaBox />, path: "/packaging" },
   { name: "Courier", icon: <FaTruck />, path: "/courier" },
    { name: "Follow-Up", icon: <FaCalendarCheck />, path: "/follow-up" },
    // { name: "Attendenc", icon: <FaClipboardCheck />, path: "/attendenc" },

   
];


  const menuItems =
    user?.role === "admin"
      ? [...baseMenuItems, { name: "Signup", icon: <FaUserPlus />, path: "/signup" }]
      : baseMenuItems;

  menuItems.push({ name: "Logout", icon: <FaSignOutAlt />, path: "/logout" });

  const handleClick = (path) => {
    if (path === "/logout") {
      logout();
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
        <FaBars />
      </div>
      <h2 className="logo">{!isCollapsed && "Clinic Admin"}</h2>
      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
            onClick={() => handleClick(item.path)}
            style={{ cursor: "pointer" }}
          >
            <span className="icon">{item.icon}</span>
            {!isCollapsed && <span className="text">{item.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
