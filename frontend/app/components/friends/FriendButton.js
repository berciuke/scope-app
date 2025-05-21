"use client";
import { useEffect, useState } from "react";
import useFriends from "../../hooks/userFriends";
import useAuth from "../../hooks/useAuth";

export default function FriendButton({ targetUserId }) {
  const { currentUser } = useAuth();
  const { getRelations, sendRequest, respondToRequest, removeFriend } = useFriends();
  const [requestStatus, setRequestStatus] = useState("none");
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const relations = getRelations();
    const userRelations = relations.filter(
      (rel) =>
        (rel.fromUserId === currentUser.id || rel.toUserId === currentUser.id) &&
        (rel.fromUserId === targetUserId || rel.toUserId === targetUserId)
    );

    const isAccepted = userRelations.some((rel) => rel.status === "accepted");
    const isPendingOutgoing = userRelations.some(
      (rel) => rel.status === "pending" && rel.fromUserId === currentUser.id
    );
    const isPendingIncoming = userRelations.some(
      (rel) => rel.status === "pending" && rel.toUserId === currentUser.id
    );

    setIsFriend(isAccepted);
    setRequestStatus(
      isAccepted
        ? "friends"
        : isPendingOutgoing
        ? "pending_outgoing"
        : isPendingIncoming
        ? "pending_incoming"
        : "none"
    );
  }, [currentUser, targetUserId, getRelations]);

  const handleAction = async () => {
    if (!currentUser) return;

    switch (requestStatus) {
      case "none":
        await sendRequest(targetUserId);
        break;
      case "pending_incoming":
        await respondToRequest(targetUserId, true);
        break;
      case "friends":
        await removeFriend(targetUserId);
        break;
      default:
        break;
    }
  };

  if (!currentUser || currentUser.id === targetUserId) return null;

  const getButtonText = () => {
    switch (requestStatus) {
      case "friends":
        return "Usuń ze znajomych";
      case "pending_outgoing":
        return "Zaproszenie wysłane";
      case "pending_incoming":
        return "Zaakceptuj zaproszenie";
      default:
        return "Dodaj do znajomych";
    }
  };

  const isDisabled = requestStatus === "pending_outgoing";

  return (
    <button
      onClick={handleAction}
      disabled={isDisabled}
      className={`friend-button ${requestStatus} ${isDisabled ? "disabled" : ""}`}
    >
      {getButtonText()}
    </button>
  );
}
