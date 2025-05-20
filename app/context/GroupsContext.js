"use client";
import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useNotifications from "../hooks/useNotifications";
import useAuth from "../hooks/useAuth";

export const GroupsContext = createContext();

export function GroupsProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const { createNotification } = useNotifications();
  const { currentUser } = useAuth();
  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem("groups")) || [];
    setGroups(storedGroups);
  }, []);

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  const createGroup = (groupData, creatorId) => {
    const newGroup = {
      id: uuidv4(),
      ...groupData,
      creatorId,
      members: [creatorId],
      createdAt: new Date().toISOString(),
    };
    setGroups([newGroup, ...groups]);
  };

  const updateGroup = (groupId, groupData) => {
    const updatedGroups = groups.map((group) =>
      group.id === groupId ? { ...group, ...groupData } : group
    );
    setGroups(updatedGroups);
  };

  const joinGroup = (groupId, userId) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId && !group.members.includes(userId)
          ? { ...group, members: [...group.members, userId] }
          : group
      )
    );
  };

  const inviteToGroup = (groupId, userId) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          const invitations = group.invitations || [];
          const alreadyInvited = invitations.find(
            (inv) => inv.userId === userId
          );
          if (!alreadyInvited) {
            return {
              ...group,
              invitations: [...invitations, { userId, status: "pending" }],
            };
          }
        }
        return group;
      })
    );
    createNotification(
      "group_invite",
      `Użytkownik ${currentUser.firstName} ${currentUser.lastName} zaprosił Cię do grupy ${groupId}`,
      userId,
      groupId
    );
  };

  const respondToGroupInvitation = (groupId, userId, accept) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId && group.invitations) {
          const invitation = group.invitations.find(
            (inv) => inv.userId === userId
          );
          if (invitation && invitation.status === "pending") {
            if (accept) {
              const updatedMembers = group.members.includes(userId)
                ? group.members
                : [...group.members, userId];
              const updatedInvitations = group.invitations.filter(
                (inv) => inv.userId !== userId
              );
              return {
                ...group,
                members: updatedMembers,
                invitations: updatedInvitations,
              };
            } else {
              const updatedInvitations = group.invitations.filter(
                (inv) => inv.userId !== userId
              );
              return { ...group, invitations: updatedInvitations };
            }
          }
        }
        return group;
      })
    );
  };

  const leaveGroup = (groupId, userId) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, members: group.members.filter((id) => id !== userId) }
          : group
      )
    );
  };

  const removeMember = (groupId, userId) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, members: group.members.filter((id) => id !== userId) }
          : group
      )
    );
  };

  return (
    <GroupsContext.Provider
      value={{
        groups,
        createGroup,
        joinGroup,
        leaveGroup,
        updateGroup,
        inviteToGroup,
        removeMember,
        respondToGroupInvitation
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}
