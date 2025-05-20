"use client";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useFriends from "../hooks/userFriends";
import AcceptFriendRequests from "../components/friends/AcceptFriendRequests";
import ProfilePicture from "../components/profile/ProfilePicture";
import FriendList from "../components/friends/FriendList";

export default function FriendsPage() {
  const { currentUser } = useAuth();
  const { myFriends } = useFriends();
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const friendsData = myFriends
      .map((friendId) => users.find((user) => user.id === friendId))
      .filter(Boolean);

    setFriendsList(friendsData);
  }, [currentUser, myFriends]);

  if (!currentUser) {
    return <div>Zaloguj się, aby zobaczyć znajomych</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Znajomi</h1>

      <AcceptFriendRequests />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Twoi znajomi</h2>
        <FriendList userId={currentUser.id} fullSize={true} />
      </div>
    </div>
  );
}
