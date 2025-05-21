"use client";
import { useState, useEffect } from "react";
import useGroups from "../../hooks/useGroups";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import ProfilePicture from "../profile/ProfilePicture";
import GroupEditForm from "./GroupEditForm";
import useFriends from "../../hooks/userFriends";
import GroupPostList from "./GroupPostList";

function GroupMembers({ group, removeMember, currentUser }) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  return (
    <div>
      <h3>Członkowie grupy:</h3>
      <ul className="mt-2">
        {group.members.map((memberId) => {
          const member = users.find((u) => u.id === memberId);
          if (!member) return null;
          return (
            <li
              key={memberId}
              className="flex items-center justify-between p-2 border-b"
            >
              <div className="flex items-center gap-2">
                <ProfilePicture
                  src={member.photo}
                  alt={member.username}
                  size={32}
                />
                <span>
                  {member.firstName} {member.lastName}
                </span>
              </div>
              {group.creatorId === memberId ? (
                <span>Administrator</span>
              ) : (
                currentUser?.id === group.creatorId && (
                  <button
                    onClick={() => removeMember(group.id, memberId)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Usuń
                  </button>
                )
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function GroupDetails({ groupId }) {
  const { groups, joinGroup, leaveGroup, inviteToGroup, removeMember } =
    useGroups();
  const { currentUser } = useAuth();
  const router = useRouter();
  const { myFriends } = useFriends();

  const [group, setGroup] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inviteList, setInviteList] = useState([]);

  useEffect(() => {
    const foundGroup = groups.find((g) => g.id === groupId);
    if (foundGroup) {
      setGroup(foundGroup);
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const foundAdmin = users.find((user) => user.id === foundGroup.creatorId);
      setAdmin(foundAdmin);
    } else {
      router.push("/404");
    }
  }, [groups, groupId, router]);

  useEffect(() => {
    if (!currentUser || !group) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const myFriendIds = myFriends.map((rel) =>
      rel.fromUserId === currentUser.id ? rel.toUserId : rel.fromUserId
    );

    const filteredFriends = users.filter(
      (u) => myFriendIds.includes(u.id) && !group.members.includes(u.id)
    );
    setInviteList(filteredFriends);
  }, [currentUser, myFriends, group]);

  if (!group) {
    return <div>Ładowanie...</div>;
  }

  const handleJoin = () => {
    joinGroup(groupId, currentUser.id);
  };

  const handleLeave = () => {
    leaveGroup(groupId, currentUser.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInvite = (userId) => {
    inviteToGroup(groupId, userId);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="group-details p-4 border rounded bg-[#403d39] text-white">
      {!isEditing ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
            {currentUser?.id === group.creatorId && (
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleEdit}
              >
                Edytuj
              </button>
            )}
          </div>
          {group.photo && (
            <div className="flex justify-center mb-4">
              <ProfilePicture
                src={group.photo}
                alt={`Zdjęcie grupy ${group.name}`}
                size={144}
              />
            </div>
          )}
          <p>{group.description}</p>
          {admin && (
            <p>
              Administrator: {admin.firstName} {admin.lastName}
            </p>
          )}
          <p>Ilość członków: {group.members.length}</p>
          {currentUser && group.members.includes(currentUser.id) ? (
            <button
              onClick={handleLeave}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Opuść grupę
            </button>
          ) : (
            <button
              onClick={handleJoin}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Dołącz do grupy
            </button>
          )}
          {currentUser?.id === group.creatorId && (
            <div className="mt-4">
              <GroupMembers
                group={group}
                removeMember={removeMember}
                currentUser={currentUser}
              />
            </div>
          )}
        </>
      ) : (
        <GroupEditForm
          group={group}
          onCancel={handleCancelEdit}
          onSubmit={handleCancelEdit}
        />
      )}
      {currentUser?.id === group.creatorId && (
        <div className="mt-4">
          <h3>Zaproś znajomych:</h3>
          <ul className="mt-2">
            {inviteList.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between p-2 border-b"
              >
                <div className="flex items-center gap-2">
                  <ProfilePicture
                    src={user.photo}
                    alt={user.username}
                    size={32}
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <button
                  onClick={() => handleInvite(user.id)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Zaproś
                </button>
              </li>
            ))}
            {inviteList.length === 0 && (
              <div>Brak znajomych do zaproszenia</div>
            )}
          </ul>
        </div>
      )}
      {group.invitations && group.invitations.length > 0 && (
        <div className="mt-4">
          <h3>Zaproszeni:</h3>
          <ul className="mt-2">
            {group.invitations.map((inv) => {
              const usersList = JSON.parse(localStorage.getItem("users")) || [];
              const invitedUser = usersList.find((u) => u.id === inv.userId);
              if (!invitedUser) return null;
              return (
                <li key={inv.userId} className="p-2 border-b">
                  {invitedUser.firstName} {invitedUser.lastName}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <GroupPostList groupId={groupId} />
      </div>
    </div>
  );
}
