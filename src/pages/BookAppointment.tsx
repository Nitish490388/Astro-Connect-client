import { useState } from "react";
import axios from "axios";

export default function BookAppointment() {
  const [form, setForm] = useState({
    astrologerId: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("/api/appointments", form);
    alert("Appointment booked successfully!");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="astrologerId" placeholder="Astrologer ID" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="date" type="date" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="startTime" placeholder="Start Time" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="endTime" placeholder="End Time" onChange={handleChange} className="w-full p-2 border rounded" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Book</button>
      </form>
    </div>
  );
}
