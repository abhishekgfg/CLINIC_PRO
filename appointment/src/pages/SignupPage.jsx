import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import AdminSignupForm from "../components/AdminSignupForm";
import "../style/Signuppage.css";

const SignupPage = () => {
  const [activeSection, setActiveSection] = useState("signup");

  return (
    <div className="signup-page">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="signup-content">
        <AdminSignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
