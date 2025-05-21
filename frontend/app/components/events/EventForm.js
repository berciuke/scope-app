"use client";
import { useState } from "react";
import useEvents from "../../hooks/useEvents";

export default function EventForm() {
  const { createEvent } = useEvents();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    createEvent({ title, description, date, location });
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
  };

  return (
    <form onSubmit={handleSubmit} className="card event-form p-4 border rounded bg-[#403d39] mb-4">
      <h2 className="text-xl font-bold mb-2 text-white">Utwórz Wydarzenie</h2>
      <div className="form-group mb-2">
        <label className="text-white">Tytuł:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2"
          required
        />
      </div>
      <div className="form-group mb-2">
        <label className="text-white">Opis:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2"
          rows="3"
        ></textarea>
      </div>
      <div className="form-group mb-2">
        <label className="text-white">Data:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2"
          required
        />
      </div>
      <div className="form-group mb-2">
        <label className="text-white">Lokalizacja:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Utwórz Wydarzenie
      </button>
    </form>
  );
}
