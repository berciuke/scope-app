"use client";
import { useState, useRef } from "react";
import usePosts from "../../hooks/usePosts";

export default function PostForm({
  existingPost = null,
  onSave = () => {},
  onCancel = () => {},
  targetType = "home",  
  targetId = null      
}) {
  const { addPost, updatePost } = usePosts();
  const [content, setContent] = useState(existingPost ? existingPost.content : "");
  const errorRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (content.length > 63206) {
      if (errorRef.current) {
        errorRef.current.textContent = "Twój post jest zbyt długi.";
      }
      return;
    }
    if (errorRef.current) {
      errorRef.current.textContent = "";
    }
    if (existingPost) {
      updatePost(existingPost.id, content);
      onSave();
    } else {
      addPost(content, targetType, targetId);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form my-4 p-4 border rounded bg-[#403d39]">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Co słychać?"
        className="w-full p-2 border rounded mb-2"
        rows="3"
      ></textarea>
      <div ref={errorRef} className="text-red-500 mb-2"></div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {existingPost ? "Aktualizuj post" : "Dodaj post"}
        </button>
        {existingPost && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Anuluj
          </button>
        )}
      </div>
    </form>
  );
}
