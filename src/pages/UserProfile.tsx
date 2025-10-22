import { useEffect, useState } from "react";
import type {User} from "../types/types";
import axiosClient from "@/utils/axiosClient";

export default function UserProfile() {
  const [form, setForm] = useState<Partial<User>>({});

  useEffect(() => {
    axiosClient.get<User>("/api/users/me").then((res) => setForm(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axiosClient.put(`/api/users/${form.id}`, form);
    alert("Profile updated!");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {["name", "dob", "gender", "birthPlace", "birthTime"].map((f) => (
          <input
            key={f}
            name={f}
            value={(form as any)[f] || ""}
            onChange={handleChange}
            placeholder={f}
            className="w-full border p-2 rounded"
          />
        ))}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
}
