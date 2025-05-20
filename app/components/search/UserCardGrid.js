"use client";
import { memo } from "react";
import Link from "next/link"; 
import ProfilePicture from "../profile/ProfilePicture";

const UserCard = memo(({ user }) => { 
  return (
    <Link href={`/profile/${user.username}`} className="user-card flex flex-col items-center p-4 border rounded shadow-sm bg-[#f0f0f0] relative"> 
      <ProfilePicture src={user.photo} alt={user.username} size={80} />
      <div className="mt-2 text-center">
        <strong>
          {user.firstName} {user.lastName}
        </strong>
        <div className="text-sm text-white-700">{user.city || "Brak miasta"}</div>
        <div className="text-sm text-white-700">{user.age ? `${user.age} lat` : ""}</div>
      </div>
    </Link> 
  );
});

export default function UserCardGrid({ users }) { 
  if (!users || users.length === 0) {
    return <div>Brak wyników 😢</div>;
  }

  return (
    <div className="user-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {users.map((u) => (
        <UserCard key={u.id} user={u} />
      ))}
    </div>
  );
}
