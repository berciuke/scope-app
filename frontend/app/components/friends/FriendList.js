import { memo } from "react";
import Link from "next/link"; 
import ProfilePicture from "../profile/ProfilePicture";
import useFriends from "../../hooks/userFriends";
import { userAgent } from "next/server";

const FriendItem = memo(({ friend, isFullSize }) => {
  const { removeFriend } = useFriends();

  const handleRemove = () => {
    if (window.confirm(`Czy na pewno chcesz usunąć znajomego (${friend.firstName} ${friend.lastName})?`)) {
      removeFriend(friend.id);
    }

  };

  return (
    <div className="friend-item flex items-center justify-between p-2 relative">
      <div className="flex items-center gap-1">
        <Link href={`/profile/${friend.username}`}> 
          <ProfilePicture src={friend.photo} alt={friend.username} size={isFullSize ? 144 : 32} />
          <span className={`text-${isFullSize ? 'base' : 'sm'}`}>
            {friend.firstName} {friend.lastName}
          </span>
        </Link>
      </div>
      {isFullSize && (
        <span className="material-symbols-outlined absolute top-0 right-0" onClick={handleRemove}>
          close
        </span>
      )}
    </div>
  );
});

export default function FriendList({ userId, fullSize, showFriends }) {
  const { getFriendsForUser } = useFriends();
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const friendRelations = getFriendsForUser(userId);
  const friendObjects = friendRelations
    .map((rel) => {
      const friendId = rel.fromUserId === userId ? rel.toUserId : rel.fromUserId;
      return users.find((u) => u.id === friendId);
    })
    .filter(Boolean);

  if (!fullSize) {
    return (
      <div className="friend-grid-compact">
        {friendObjects.length > 0 ? (
          friendObjects.map((friend) => <FriendItem key={friend.id} friend={friend} />)
        ) : (
          <div>Brak 😢</div>
        )}
      </div>
    );
  }

  return (
    <div className="friend-grid p-4 border rounded">
      {friendObjects.length > 0 ? (
        friendObjects.map((friend) => <FriendItem key={friend.id} friend={friend} isFullSize={fullSize} />)
      ) : (
        <div>Brak 😢</div>
      )}
    </div>
  );
}
