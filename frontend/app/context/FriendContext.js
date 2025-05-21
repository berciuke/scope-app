"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import useNotifications from "../hooks/useNotifications";

export const FriendContext = createContext();

export function FriendProvider({ children }) {
  const { currentUser } = useAuth();
    const { createNotification } = useNotifications()
  const [friendRequests, setFriendRequests] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [pendingSent, setPendingSent] = useState([]);

  const loadFriendsData = useCallback(() => {
    if (!currentUser) {
      setFriendRequests([]);
      setMyFriends([]);
      setPendingSent([]);
      return;
    }

    const relations = JSON.parse(localStorage.getItem("friends")) || [];
    const myId = currentUser.id;
    const incomingRequests = relations.filter(
      (f) => f.status === "pending" && f.toUserId === myId
    );

    const accepted = relations.filter(
      (f) =>
        f.status === "accepted" &&
        (f.fromUserId === myId || f.toUserId === myId)
    );

    const outgoingRequests = relations.filter(
      (f) => f.status === "pending" && f.fromUserId === myId
    );

    setFriendRequests(incomingRequests);
    setMyFriends(accepted);
    setPendingSent(outgoingRequests);
  }, [currentUser]);

  useEffect(() => {
    loadFriendsData();
    window.addEventListener("storage", loadFriendsData);
    return () => window.removeEventListener("storage", loadFriendsData);
  }, [loadFriendsData]);

  const saveRelations = (updated) => {
    localStorage.setItem("friends", JSON.stringify(updated));
  };

  const sendRequest = (targetUserId) => {
    if (!currentUser) return false;
    const relations = JSON.parse(localStorage.getItem("friends")) || [];

    const exists = relations.find(
      (f) =>
        (f.fromUserId === currentUser.id && f.toUserId === targetUserId) ||
        (f.fromUserId === targetUserId && f.toUserId === currentUser.id)
    );
    if (exists) {
      return false;
    }

    relations.push({
      fromUserId: currentUser.id,
      toUserId: targetUserId,
      status: "pending",
    });
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const targetUser = users.find((u) => u.id === targetUserId)
    if(targetUser) {
       createNotification("friend_request",`Użytkownik ${currentUser.firstName} ${currentUser.lastName} zaprosił Cię do znajomych`, targetUserId);
    }

    saveRelations(relations);
    loadFriendsData();
    return true;
  };

  const respondToRequest = (requesterId, accept) => {
    if (!currentUser) return false;
    const relations = JSON.parse(localStorage.getItem("friends")) || [];

    const index = relations.findIndex(
      (f) =>
        f.status === "pending" &&
        f.fromUserId === requesterId &&
        f.toUserId === currentUser.id
    );
    if (index === -1) {
      return false;
    }

    if (accept) {
      relations[index].status = "accepted";
    } else {
      relations.splice(index, 1);
    }

    saveRelations(relations);
    loadFriendsData();
    return true;
  };

  const removeFriend = (friendId) => {
    if (!currentUser) return;
    const relations = JSON.parse(localStorage.getItem("friends")) || [];

    const index = relations.findIndex((f) => {
      const isAccepted = f.status === "accepted";
      const matchCurrentUser =
        f.fromUserId === currentUser.id || f.toUserId === currentUser.id;
      const matchFriend = f.fromUserId === friendId || f.toUserId === friendId;
      return isAccepted && matchCurrentUser && matchFriend;
    });

    if (index !== -1) {
      relations.splice(index, 1);
      saveRelations(relations);
      loadFriendsData();
    }
  };

  const getRelations = () => JSON.parse(localStorage.getItem("friends")) || [];

  const getFriendsForUser = useCallback((userId) => {
    const relations = getRelations();
    return relations.filter(
      (rel) =>
        (rel.fromUserId === userId || rel.toUserId === userId) &&
        rel.status === "accepted"
    );
  }, []);

  const getPendingForUser = useCallback((userId) => {
    const relations = getRelations();
    return relations.filter(
      (rel) => rel.fromUserId === userId && rel.status === "pending"
    );
  }, []);

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        myFriends,
        pendingSent,
        sendRequest,
        respondToRequest,
        removeFriend,
        getFriendsForUser,
        getPendingForUser,
        getRelations,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
}