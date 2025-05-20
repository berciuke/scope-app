"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import useAuth from "../../hooks/useAuth";
import useFriends from "../../hooks/userFriends";
import useReports from "../../hooks/useReports";
import EditProfile from "./EditProfile";
import ProfilePicture from "./ProfilePicture";
import FriendList from "../friends/FriendList";
import FriendButton from "../friends/FriendButton";

export default function Profile({ user }) {
  const { currentUser, login } = useAuth();
  const { myFriends } = useFriends();
  const { reportContent } = useReports();
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDay = new Date(dob);
    let age = today.getFullYear() - birthDay.getFullYear();
    const monthDifference = today.getMonth() - birthDay.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDay.getDate())
    ) {
      age--;
    }
    return age + " lat";
  };

  const isFriend = useMemo(() => {
    if (!currentUser) return false;
    return myFriends.some(
      (rel) =>
        (rel.fromUserId === currentUser.id && rel.toUserId === user.id) ||
        (rel.fromUserId === user.id && rel.toUserId === currentUser.id)
    );
  }, [myFriends, currentUser, user]);

  const handleReportProfile = () => {
    if (!currentUser) return;
    const reason = prompt("Podaj powód zgłoszenia profilu:");
    if (reason) {
      reportContent("profile", user.id, currentUser.id, reason);
      alert("Zgłoszono profil!");
    }
  };

  if (
    user.privacy === "private" &&
    currentUser.id !== user.id &&
    !isFriend
  ) {
    return (
      <div className="card">
        <ProfilePicture src={user.photo} alt="Profilowe" />
        <strong>{`${user.firstName} ${user.lastName}`}</strong>
        <p> Ten profil jest prywatny.</p>
      </div>
    );
  }

  return (
    <div className="card">
      {message && (
        <div
          className={`alert ${
            message.type === "error" ? "alert-error" : "alert-success"
          }`}
        >
          {message.text}
        </div>
      )}
      {!isEditing ? (
        <>
          <div className="profile-details flex gap-5">
            <ProfilePicture src={user.photo} alt="Profilowe" />
            <div>
              <strong className="text-2xl">
                {user.firstName} {user.lastName}
              </strong>
              {user.dateOfBirth && (
                <span>{calculateAge(user.dateOfBirth)}</span>
              )}
              <p className="italic break-words max-w-xs">{user.description}</p>
              {user.city && <p className="font-semibold">{user.city}</p>}
            </div>
          </div>
          {currentUser && currentUser.username === user.username && (
            <button onClick={() => setIsEditing(true)} className="object-left">
              Edytuj Profil
            </button>
          )}
          {currentUser && currentUser.id !== user.id && (
            <button
              onClick={handleReportProfile}
              className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mt-2"
            >
              Zgłoś profil
            </button>
          )}
          {currentUser && currentUser.id !== user.id && (
            <>
              <FriendButton targetUserId={user.id} />
              {isFriend && (
                <Link href={`/messages/${user.username}`} className="p-2">
                  Wiadomość prywatna
                </Link>
              )}
            </>
          )}
          <div>
            <p className="text-xl">Znajomi:</p>
            <FriendList userId={user.id} fullSize={false} showFriends={true} />
          </div>
        </>
      ) : (
        <EditProfile
          currentUser={user}
          onSubmit={(values) => {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const updatedUsers = users.map((u) =>
              u.id === user.id ? { ...u, ...values } : u
            );
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            login({ ...user, ...values });
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
