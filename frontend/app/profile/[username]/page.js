"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import Profile from "../../components/profile/Profile";

export default function UserProfilePage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (currentUser && username === currentUser.username) {
      setUser(currentUser);
    } else {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userProfile = users.find((user) => user.username === username);
      if (!userProfile) {
        router.push("/404");
      } else {
        setUser(userProfile);
      }
    }
  }, [username, currentUser, router]);

  return <div>{user && <Profile user={user} />}</div>;
}
