import React, { useState } from 'react';

const AddPatientForm = ({ onAdd }) => {
  const [form, setForm] = useState({ name: '', age: '', contact: '', email: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ name: '', age: '', contact: '', email: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="age" value={form.age} onChange={handleChange} placeholder="Age" required />
      <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <button type="submit">Add Patient</button>
    </form>
  );
};

export default AddPatientForm;
