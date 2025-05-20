"use client";
import { useEffect, useState } from "react";
import Post from "./Post";
import useAuth from "../../hooks/useAuth";
import usePosts from "../../hooks/usePosts";

export default function FullPostModal({ post, onClose }) {
  const { posts } = usePosts();
  const [updatedPost, setUpdatedPost] = useState(post);

  useEffect(() => {
    const foundPost = posts.find((p) => p.id === post.id);
    if (foundPost) {
      setUpdatedPost(foundPost);
    }
  }, [posts, post.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="relative rounded shadow-lg max-w-2xl w-full p-4 overflow-y-auto max-h-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white p-2 rounded text-gray-600 hover:text-gray-800 text-xl"
        >
          &times;
        </button>
        <Post post={updatedPost} fullView={true} />
      </div>
    </div>
  );
}
