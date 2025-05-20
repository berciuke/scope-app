"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import ConversationList from "../components/messages/ConversationList";
import useFriends from "../hooks/userFriends";
import ProfilePicture from "../components/profile/ProfilePicture";
import Link from "next/link";

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const { getFriendsForUser } = useFriends();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const friendsRelations = currentUser ? getFriendsForUser(currentUser.id) : [];
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const friends = friendsRelations
    .map((rel) => {
      const friendId =
        rel.fromUserId === currentUser.id ? rel.toUserId : rel.fromUserId;
      return allUsers.find((u) => u.id === friendId);
    })
    .filter(Boolean);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Rozpocznij nową rozmowę</h2>
        <div className="flex gap-4">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <Link key={friend.id} href={`/messages/${friend.username}`}>
                <ProfilePicture
                  src={friend.photo}
                  alt={friend.username}
                  size={40}
                />
              </Link>
            ))
          ) : (
            <p>Brak znajomych do rozpoczęcia rozmowy.</p>
          )}
        </div>
      </div>
      <ConversationList />
    </div>
  );
}
