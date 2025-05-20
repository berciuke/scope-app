import React from "react";
import useMessages from "../../hooks/useMessages";
import Link from "next/link";
import ProfilePicture from "../profile/ProfilePicture";

export default function ConversationList() {
  const { getConversations } = useMessages();
  const conversations = getConversations();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Twoje rozmowy</h2>
      <ul className="space-y-2">
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            const otherUser = users.find((u) => u.id === conv.otherUserId);
            const latestMessage = conv.messages[0];
            return (
              <li
                key={conv.otherUserId}
                className="p-3 border rounded hover:bg-[#eb5e28] transition-colors"
              >
                <Link href={`/messages/${otherUser ? otherUser.username : conv.otherUserId}`}>
                  <div className="flex items-center gap-4">
                    <ProfilePicture
                      src={otherUser ? otherUser.photo : "/profile-picture.jpg"}
                      alt={otherUser ? otherUser.username : "Użytkownik"}
                      size={50}
                    />
                    <div>
                      <div className="font-bold text-lg">
                        {otherUser
                          ? `${otherUser.firstName} ${otherUser.lastName}`
                          : "Nieznany użytkownik"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {latestMessage ? latestMessage.content : ""}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })
        ) : (
          <li>Brak rozmów</li>
        )}
      </ul>
    </div>
  );
}
