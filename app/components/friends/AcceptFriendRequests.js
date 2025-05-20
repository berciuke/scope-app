"use client";
import useFriends from "../../hooks/userFriends";
import useAuth from "../../hooks/useAuth";
import ProfilePicture from "../profile/ProfilePicture";

const AcceptFriendRequests = () => {
  const { friendRequests, respondToRequest } = useFriends();
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const handleRespond = (requesterId, accept) => {
    respondToRequest(requesterId, accept);
  };

  return (
    <div>
      <h3>Oczekujące zaproszenia:</h3>
      {friendRequests.length > 0 ? (
        friendRequests.map((rel) => {
          const requesterId = rel.fromUserId;
          const requester = users.find((u) => u.id === requesterId);
          if (!requester) return null;

          return (
            <div key={requesterId} className="flex gap-2 items-center">
              <ProfilePicture src={requester.photo} alt={requester.username} />
              <span>{requester.username}</span>
              <button onClick={() => handleRespond(requesterId, true)} className="bg-green-700 rounded p-1">
                Akceptuj
              </button>
              <button onClick={() => handleRespond(requesterId, false)} className="bg-red-700 rounded p-1">
                Odrzuć
              </button>
            </div>
          );
        })
      ) : (
        <div>Brak zaproszeń</div>
      )}
    </div>
  );
};

export default AcceptFriendRequests;
