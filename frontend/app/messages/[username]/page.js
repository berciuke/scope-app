"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import MessageList from "../../components/messages/MessageList";
import MessageInput from "../../components/messages/MessageInput";

export default function ConversationPage() {
  const { username } = useParams();
  const { currentUser } = useAuth();
  const [otherUser, setOtherUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((u) => u.username === username);
    if (!foundUser) {
      router.push("/404");
    } else {
      setOtherUser(foundUser);
    }
  }, [username, currentUser, router]);

  if (!otherUser) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <MessageList otherUserId={otherUser.id} />
      <MessageInput otherUserId={otherUser.id} />
    </div>
  );
}
