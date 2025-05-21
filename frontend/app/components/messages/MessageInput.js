"use client";

import { useState } from "react";
import useMessages from "../../hooks/useMessages";

export default function MessageInput({ otherUserId }) {
  const { sendMessage } = useMessages();
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() === "") return;
    sendMessage(otherUserId, content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="message-input flex gap-2 mt-2 max-w-xl mx-auto">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Napisz wiadomość..."
        className="flex-1 p-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Wyślij
      </button>
    </form>
  );
}
