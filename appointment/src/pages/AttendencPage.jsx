import React, { useEffect, useState } from "react";
import "../style/attendenc.css";
import axios from "../api/axios";

const API = "/attendenc";

const AttendencPage = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [newEmp, setNewEmp] = useState({ name: "", role: "" });
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [year, setYear] = useState(new Date().getFullYear());
  const [statusOptions] = useState(["Present", "Absent", "Half-Day", "Leave"]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate(); // 0 gets last day of previous month
  };

  const days = Array.from(
    { length: getDaysInMonth(month, year) },
    (_, i) => i + 1
  );

  const fetchEmployees = async () => {
    const res = await axios.get(`${API}/employees`);
    setEmployees(res.data);
  };

  const fetchMonthlyAttendance = async () => {
    const res = await axios.get(`${API}/monthly-records?month=${month}&year=${year}`);
    const map = {};
    res.data.forEach(rec => {
      const key = `${rec.employeeId}_${rec.date}`;
      map[key] = rec.status;
    });
    setAttendance(map);
  };

  const mark = (empId, date, status) => {
    const key = `${empId}_${date}`;
    setAttendance({ ...attendance, [key]: status });
  };

  const submit = async () => {
    for (const emp of employees) {
      for (const day of days) {
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const key = `${emp._id}_${dateStr}`;
        const status = attendance[key];
        if (!status) continue;
        await axios.post(`${API}/records`, {
          employeeId: emp._id,
          date: dateStr,
          status,
        }).catch((err) => {
          alert(`❌ Error for ${emp.name} on ${dateStr}`);
        });
      }
    }
    alert("✅ Attendance Submitted");
    fetchMonthlyAttendance();
  };

  const addEmployee = async () => {
    if (!newEmp.name || !newEmp.role) return;
    const exists = employees.find(e => e.name.toLowerCase() === newEmp.name.toLowerCase());
    if (exists) {
      alert("Employee already exists");
      return;
    }
    await axios.post(`${API}/employees`, newEmp);
    setNewEmp({ name: "", role: "" });
    fetchEmployees();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchMonthlyAttendance();
  }, [month, year]);

  return (
    <div className="attendenc-page colorful-bg">
      <h2 className="animated-title">📅 Manovaidya - Monthly Attendance</h2>

      {/* Month-Year Selector */}
      <div className="attendenc-date">
        <label>Month:</label>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <label>Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>

      {/* Add Employee */}
      <div className="add-employee">
        <input
          placeholder="Name"
          value={newEmp.name}
          onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
        />
        <input
          placeholder="Role"
          value={newEmp.role}
          onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
        />
        <button className="animated-btn" onClick={addEmployee}>Add Employee</button>
      </div>

      {/* Attendance Table */}
      <div className="table-wrapper">
        <table className="attendenc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.role}</td>
                {days.map(day => {
                  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const key = `${emp._id}_${dateStr}`;
                  return (
                    <td key={day}>
                      <select
                        value={attendance[key] || ""}
                        onChange={(e) => mark(emp._id, dateStr, e.target.value)}
                        className="status-dropdown"
                      >
                        <option value="">-</option>
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="submit-btn animated-btn" onClick={submit}>
        ✅ Submit Attendance
      </button>
    </div>
  );
};

export default AttendencPage;
