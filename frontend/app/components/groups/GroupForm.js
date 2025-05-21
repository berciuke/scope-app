"use client";
import { useState } from "react";
import useGroups from "../../hooks/useGroups";
import useAuth from "../../hooks/useAuth";

export default function GroupForm() {
  const { createGroup } = useGroups();
  const { currentUser } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createGroup({ name, description }, currentUser.id);
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="group-form p-4 border rounded bg-[#403d39] mb-4">
      <h2 className="text-xl font-bold mb-2 text-white">Utwórz Grupę</h2>
      <div className="form-group mb-2">
        <label className="text-white">Nazwa grupy:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2"
          required
        />
      </div>
      <div className="form-group mb-2">
        <label className="text-white">Opis grupy:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2"
          rows="3"
        ></textarea>
      </div>
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Utwórz Grupę
      </button>
    </form>
  );
}
