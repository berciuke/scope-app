"use client";
import { useState, useRef } from "react";
import usePosts from "../../../hooks/usePosts";

export default function CommentForm({ postId, onCancel }) {
  const { addComment } = usePosts();
  const [commentText, setCommentText] = useState("");
  const errorRef = useRef(null); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (commentText.length > 7720) {
      if (errorRef.current) {
        errorRef.current.textContent = "Komentarz jest zbyt długi.";
      }
      return;
    }
    if (errorRef.current) {
      errorRef.current.textContent = "";
    }
    addComment(postId, commentText);
    setCommentText("");
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-2">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Dodaj komentarz..."
        className="w-full p-2 border rounded mb-2"
        rows="2"
        maxLength={7720}
      ></textarea>
      <div ref={errorRef} className="text-red-500 mb-2"></div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Dodaj komentarz
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Anuluj
        </button>
      </div>
    </form>
  );
}
