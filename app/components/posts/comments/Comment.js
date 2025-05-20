"use client";
import { useState } from "react";
import Image from "next/image";

export default function Comment({ comment }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const commenter = users.find((u) => u.id === comment.userId);

  const shouldTruncate = comment.content.length > 148 && !isExpanded;
  const displayedContent = shouldTruncate
    ? comment.content.substring(0, 148) + "..."
    : comment.content;

  return (
    <div className="flex items-start mb-2">
      {commenter && (
        <Image
          src={commenter.photo || "/profile-picture.jpg"}
          alt={commenter.username}
          width={32}
          height={32}
          className="profile-picture-extra-small mr-2"
        />
      )}
      <div>
        <a className="text-sm font-bold" href={`/profile/${commenter ? commenter.username : ''}`}>
          {commenter
            ? `${commenter.firstName} ${commenter.lastName}`
            : "Nieznany użytkownik"}
          <span className="text-gray-500 text-xs ml-2">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </a>
        <div className="text-sm">
          {displayedContent}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-500 ml-2 text-xs"
            >
              Wyświetl więcej
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
