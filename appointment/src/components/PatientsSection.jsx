import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import * as XLSX from "xlsx";

// Add Patient Form Component
const AddPatientForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.contact) {
      alert("Please fill in all required fields.");
      return;
    }
    await onAdd(formData);
    setFormData({ name: "", age: "", contact: "", email: "" });
  };

  return (
    <form className="add-patient-form1" onSubmit={handleSubmit} style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      gap: "10px",
      maxWidth: "500px",
      margin: "auto",
      borderRadius: "10px"
    }}>
      <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ height: "40px", fontSize: "14px", padding: "4px 8px", borderRadius: "10px" }} />
      <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required style={{ height: "40px", fontSize: "14px", padding: "4px 8px", borderRadius: "10px" }} />
      <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required style={{ height: "40px", fontSize: "14px", padding: "4px 8px", borderRadius: "10px" }} />
      <input type="email" name="email" placeholder="Email (optional)" value={formData.email} onChange={handleChange} style={{ height: "40px", fontSize: "14px", padding: "4px 8px", borderRadius: "10px" }} />
      <button type="submit" style={{ height: "36px", fontSize: "14px", backgroundColor: "#2f3542", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        ➕ Add Patient
      </button>
    </form>
  );
};

// Main Patients Section Component
const PatientsSection = ({ patients, fetchData }) => {
  const { user } = useAuth();
  const [selectedPatients, setSelectedPatients] = useState([]);

  const handleSelect = (id) => {
    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedPatients.length === 0) return alert("No patients selected.");
    if (!window.confirm("Are you sure you want to delete selected patients?")) return;
    for (const id of selectedPatients) {
      await axios.delete(`/patients/delete/${id}`);
    }
    await fetchData();
    setSelectedPatients([]);
  };

  const handleEdit = async (p) => {
    const name = prompt("Edit Name", p.name);
    const age = prompt("Edit Age", p.age);
    const contact = prompt("Edit Contact", p.contact);
    const email = prompt("Edit Email", p.email);
    if (name && age && contact) {
      try {
        await axios.put(`/patients/update/${p._id}`, { name, age, contact, email });
        fetchData();
      } catch (err) {
        alert("Failed to update patient");
        console.error(err);
      }
    } else {
      alert("Name, Age, and Contact are required");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        for (const patient of jsonData) {
          await axios.post("/patients/add", patient, { headers: { username: user?.username } });
        }

        await fetchData();
        alert("✅ Patients imported successfully!");
      } catch (err) {
        console.error("Import error:", err);
        alert("❌ Error importing patient data.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      {/* Add Patient Section */}
      <div className="card-wrapper">
        <div className="card">
          <h2 style={{ marginLeft: "0", transition: "margin-left 0.3s ease" }}>
            ➕ Add New Patient
          </h2>
          <AddPatientForm onAdd={async (data) => {
            await axios.post("/patients/add", data, {
              headers: { username: user?.username },
            });
            fetchData();
          }} />
          <div className="import-section">
            <h4>📁 Import from Excel/CSV</h4>
            <input type="file" accept=".csv, .xls, .xlsx" onChange={handleFileUpload} className="file-upload" />
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="table-card">
        <h2 className="section-heading">🧾 Patient Details</h2>
        {user?.role === "admin" && (
          <button className="delete-selected-btn" onClick={handleDeleteSelected}>🗑️ Delete Selected</button>
        )}

        <div className="table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedPatients.length === patients.length && patients.length > 0}
                    onChange={(e) =>
                      setSelectedPatients(e.target.checked ? patients.map((p) => p._id) : [])
                    }
                  />
                </th>
                <th>Name</th>
                <th>Age</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr><td colSpan="7" className="no-data">No patients found.</td></tr>
              ) : (
                patients.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <input type="checkbox" checked={selectedPatients.includes(p._id)} onChange={() => handleSelect(p._id)} />
                    </td>
                    <td>{p.name || p.fullName || "N/A"}</td>
                    <td>{p.age || "N/A"}</td>
                    <td>{p.contact || p.phone || "N/A"}</td>
                    <td>{p.email || "N/A"}</td>
                    <td>
                      <select
                        value={p.status || "In Progress"}
                        className="status-dropdown"
                        onChange={async (e) => {
                          try {
                            await axios.put(`/patients/update-status/${p._id}`, {
                              status: e.target.value
                            });
                            fetchData();
                          } catch (err) {
                            console.error("Status update error:", err);
                            alert("❌ Failed to update status.");
                          }
                        }}
                      >
                        <option>In Progress</option>
                        <option>Call</option>
                        <option>Ready for Consultation</option>
                        <option>Payment Done</option>
                        <option>Scheduled</option>
                      </select>
                    </td>
                    <td>
                      {user?.role === "admin" && (
                        <>
                          <button className="edit-btn" onClick={() => handleEdit(p)}>✏️ Edit</button>
                          <button className="delete-btn" onClick={async () => {
                            if (window.confirm("Delete this patient?")) {
                              await axios.delete(`/patients/delete/${p._id}`);
                              fetchData();
                            }
                          }}>🗑️ Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </>
  );
};


export default PatientsSection;
