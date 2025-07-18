import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/GoogleSheetSync.css";

const SERVICE_EMAIL = "clinic-service@aerobic-entropy-464510-h1.iam.gserviceaccount.com";

const GoogleSheetSync = ({ patients }) => {
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetId, setSheetId] = useState("");

  useEffect(() => {
    const savedUrl = localStorage.getItem("sheetUrl");
    if (savedUrl) {
      setSheetUrl(savedUrl);
      const id = extractSheetId(savedUrl);
      if (id) setSheetId(id);
    }
  }, []);

  const extractSheetId = (url) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const handleConnect = () => {
    const id = extractSheetId(sheetUrl);
    if (!id) return alert("❌ Invalid Google Sheet URL");
    localStorage.setItem("sheetUrl", sheetUrl);
    setSheetId(id);
    alert("✅ Connected to Google Sheet");
  };

  const handleDisconnect = () => {
    setSheetUrl("");
    setSheetId("");
    localStorage.removeItem("sheetUrl");
  };

  useEffect(() => {
    const readyPatients = patients.filter((p) => p.status === "Ready for Consultation");
    if (sheetId && readyPatients.length > 0) {
      axios.post("/api/sync-to-sheet", { sheetId, data: readyPatients })
        .then(() => console.log("✅ Synced patients to Google Sheet"))
        .catch((err) => console.error("❌ Patient sync failed", err));
    }
  }, [patients, sheetId]);

  return (
    <div className="sheet-sync-container">
      <h3>📤 Sync 'Ready for Consultation' Patients</h3>
      <input
        type="text"
        placeholder="Paste Google Sheet link"
        value={sheetUrl}
        onChange={(e) => setSheetUrl(e.target.value)}
      />
      {!sheetId ? (
        <button onClick={handleConnect}>🔗 Connect Sheet</button>
      ) : (
        <button className="disconnect-btn" onClick={handleDisconnect}>🔌 Disconnect</button>
      )}
      {sheetId && <p className="connected-status">🟢 Connected Sheet ID: {sheetId}</p>}
      <div className="service-account-box">
        <h4>📌 Share sheet with:</h4>
        <code>{SERVICE_EMAIL}</code>
        <button onClick={() => navigator.clipboard.writeText(SERVICE_EMAIL)}>📋 Copy</button>
      </div>
    </div>
  );
};

export default GoogleSheetSync;
