"use client";

import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useNotifications from "../../hooks/useNotifications";
import useGroups from "../../hooks/useGroups";
import Link from "next/link";
export default function NotificationList() {
  const { notifications, markAsRead, deleteNotification, markAllAsRead } =
    useNotifications();
  const { respondToGroupInvitation } = useGroups();
  const [uiSettings, setUiSettings] = useState({ notifications: {} });
  const { currentUser } = useAuth();


  useEffect(() => {
    const storedUiSettings = localStorage.getItem("uiSettings");
    if (storedUiSettings) {
      setUiSettings(JSON.parse(storedUiSettings));
    }
  }, []);

  const displayedNotifications = notifications.filter(
    (notif) => uiSettings.notifications[notif.type]
  );
  const unreadNotifications = displayedNotifications.filter((notif) => !notif.read);

  useEffect(() => {
    if (unreadNotifications.length > 0) {
      document.title = `(${unreadNotifications.length}) Scope App`;
    } else {
      document.title = "Scope App";
    }
  }, [unreadNotifications]);

  const handleDelete = (notificationId) => {
    deleteNotification(notificationId);
  };
  const handleMarkAllRead = () => {
    markAllAsRead();
  };
  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };

  return (
    <div className="notification-list">
      <h2>Powiadomienia</h2>
      {unreadNotifications.length > 0 && (
        <button
          onClick={handleMarkAllRead}
          className="bg-blue-500 text-white rounded px-2 py-1 mb-2"
        >
          Oznacz wszystkie jako przeczytane
        </button>
      )}
      {displayedNotifications.length > 0 ? (
        <ul>
          {displayedNotifications.map((notification) => {
            let link = null;
            if (notification.type === "friend_request") {
              link = `/friends`;
            } else if (notification.type === "new_message") {
              link = `/messages`;
            } else if (
              notification.type === "comment" ||
              notification.type === "like"
            ) {
              link = notification.targetId
                ? `/post/${notification.targetId}`
                : null;
            } else if (notification.type === "group_invite") {
              link = `/groups/${notification.targetId}`;
            }
            return (
              <li
                key={notification.id}
                className={`notification-item p-2 border-b ${
                  notification.read ? "bg-gray-700" : "bg-[#403d39] text-white"
                }`}
              >
                {notification.type === "group_invite" && (
                  <div>
                    <button
                      onClick={() =>
                        respondToGroupInvitation(
                          notification.targetId,
                          currentUser.id,
                          true
                        )
                      }
                    >
                      Dołącz
                    </button>
                    <button
                      onClick={() =>
                        respondToGroupInvitation(
                          notification.targetId,
                          currentUser.id,
                          false
                        )
                      }
                    >
                      Odrzuć
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {link ? (
                    <Link
                      href={link}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      {notification.content}
                    </Link>
                  ) : (
                    <div> {notification.content} </div>
                  )}
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Oznacz jako przeczytane
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Brak powiadomień</p>
      )}
    </div>
  );
}
