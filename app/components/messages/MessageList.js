"use client";

import React from "react";
import useMessages from "../../hooks/useMessages";
import useAuth from "../../hooks/useAuth";
import Link from "next/link";

export default function MessageList({ otherUserId }) {
  const { getConversation } = useMessages();
  const { currentUser } = useAuth();
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const friendData = users.find((u) => u.id === otherUserId);

  const conversation = getConversation(otherUserId);

  return (
    <div className="p-4 border rounded bg-[#403d39] text-white max-w-xl mx-auto">
      {friendData && (
        <div className="flex items-center gap-3 mb-4">
          <img
            src={friendData.photo || "/profile-picture.jpg"}
            alt="Konwersacja z"
            className="w-10 h-10 profile-picture-small"
          />
          <h3 className="text-lg font-bold m-0">
            <Link href={`/profile/${friendData.username}`}>
              {friendData.firstName} {friendData.lastName}
            </Link>
          </h3>
        </div>
      )}

      <div className="message-list space-y-2 max-h-96 overflow-y-auto">
        {conversation.map((msg) => (
          <div
            key={msg.id}
            className={`message p-2 rounded ${
              msg.fromUserId === currentUser.id
                ? "bg-[#252422] self-end text-right"
                : "bg-[#403d39] self-start text-left"
            }`}
          >
            <div>{msg.content}</div>
            <div className="text-xs text-gray-500">
              {new Date(msg.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
