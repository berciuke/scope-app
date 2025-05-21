"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import useAuth from "../hooks/useAuth";

export const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const storedNotifications =
        JSON.parse(localStorage.getItem(`notifications-${currentUser.id}`)) ||
        [];
      setNotifications(storedNotifications);
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `notifications-${currentUser.id}`,
        JSON.stringify(notifications)
      );
    }
  }, [notifications, currentUser]);

  const createNotification = (type, content, targetId = null) => {
    const recipientId = targetId || (currentUser ? currentUser.id : null);
    if (!recipientId) return;
  
    const newNotification = {
      id: uuidv4(),
      userId: recipientId, 
      type,
      content,
      targetId,
      read: false,
      createdAt: new Date().toISOString(),
    };
  
    const key = `notifications-${recipientId}`;
    const storedNotifications = JSON.parse(localStorage.getItem(key)) || [];
    const updatedNotifications = [newNotification, ...storedNotifications];
    localStorage.setItem(key, JSON.stringify(updatedNotifications));
  
    if (recipientId === currentUser.id) {
      setNotifications(updatedNotifications);
    }
  };
  

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, [setNotifications]);

  const deleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        createNotification,
        markAsRead,
        deleteNotification,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
