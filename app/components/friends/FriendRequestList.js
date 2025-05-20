"use client";
import ProfilePicture from "../profile/ProfilePicture";

export default function FriendRequestList({ requests, onRespond }) {
  return (
    <div className="request-list">
      {requests.map(({ id, username, avatar }) => (
        <div key={id} className="request-item">
          <UserAvatar user={{ username, avatar }} />
          <div className="actions">
            <button onClick={() => onRespond(id, true)} className="accept-btn">
              Akceptuj
            </button>
            <button
              onClick={() => onRespond(id, false)}
              className="decline-btn"
            >
              Odrzuć
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
