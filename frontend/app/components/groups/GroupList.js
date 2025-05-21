"use client";
import { useState, useEffect } from "react";
import useGroups from "../../hooks/useGroups";
import useAuth from "../../hooks/useAuth";
import Link from "next/link";

export default function GroupList() {
  const { groups, joinGroup, leaveGroup } = useGroups();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);

  const handleJoin = (groupId) => {
    joinGroup(groupId, currentUser.id);
  };

  const handleLeave = (groupId) => {
    leaveGroup(groupId, currentUser.id);
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  return (
    <div className="group-list">
      <h2 className="text-2xl font-bold mb-4 text-white">Grupy</h2>
      {groups.length === 0 ? (
        <p className="text-white">Brak grup.</p>
      ) : (
        groups.map((group) => (
          <div
            key={group.id}
            className="group-item p-4 border rounded mb-4 bg-[#403d39] text-white flex items-center"
          >
            {group.photo && (
              <img
                src={group.photo}
                alt={`${group.name} image`}
                className="profile-picture mr-3"
              />
            )}
            <div className="group-info flex-grow">
              <h3 className="text-xl font-bold">
                <Link
                  href={`/groups/${group.id}`}
                  className="hover:text-[#eb5e28]"
                >
                  {group.name}
                </Link>
              </h3>
              <div className="flex flex-col">
                <p>{group.description}</p>
                <p>
                  Administrator:{" "}
                  {(() => {
                    const creator = users.find(
                      (user) => user.id === group.creatorId
                    );
                    return creator
                      ? `${creator.firstName} ${creator.lastName}`
                      : "Nieznany";
                  })()}
                </p>
                <p>Ilość członków: {group.members.length}</p>
                {currentUser && group.members.includes(currentUser.id) ? (
                  <button
                    onClick={() => handleLeave(group.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 mt-2"
                  >
                    Opuść grupę
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(group.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
                  >
                    Dołącz do grupy
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  ); 
} 
