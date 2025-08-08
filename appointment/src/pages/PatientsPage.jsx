import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import PatientsSection from "../components/PatientsSection";
import { useAuth } from "../context/AuthContext"; // ✅ Add this
import "../style/Patients.css";

import GoogleSheetSync from "../components/GoogleSheetSync"; // 👈 Create this if not done already

const PatientsPage = () => {
  const { user } = useAuth(); // ✅ Get current user from context
  const [patients, setPatients] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/patients/all", {
        headers: {
          username: user?.username, // ✅ Send username to backend
        },
      });
      setPatients(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch patients", err);
      setPatients([]); // fallback
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchData(); // ✅ Only fetch after user is loaded
    }
  }, [user]);

  return (
    <div className="main-container" style={{ display: "flex" }}>
      <Sidebar />
      <div className="content" style={{ flex: 1, padding: "20px" }}>
        <PatientsSection patients={patients} fetchData={fetchData} />
         {/* 🔽 Sync with Google Sheet section */}
    <GoogleSheetSync patients={patients} />
      </div>
    </div>
  );
};


export default PatientsPage;
