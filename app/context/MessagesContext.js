"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import useAuth from "../hooks/useAuth";
import useNotifications from "../hooks/useNotifications";

export const MessagesContext = createContext();

export function MessagesProvider({ children }) {
  const { currentUser } = useAuth();
  const { createNotification } = useNotifications();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    setMessages(storedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (toUserId, content) => {
    if (!currentUser) return;
    const newMessage = {
      id: uuidv4(),
      fromUserId: currentUser.id,
      toUserId,
      content,
      createdAt: new Date().toISOString(),
    };
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const targetUser = users.find((u) => u.id === toUserId);
    if (targetUser) {
      createNotification(
        "new_message",
        `Nowa wiadomość od ${currentUser.firstName} ${currentUser.lastName}`,
        toUserId
      );
    }
    setMessages((prev) => [...prev, newMessage]);
  };

  const getConversation = useCallback(
    (otherUserId) => {
      if (!currentUser) return [];
      return messages
        .filter(
          (msg) =>
            (msg.fromUserId === currentUser.id &&
              msg.toUserId === otherUserId) ||
            (msg.fromUserId === otherUserId && msg.toUserId === currentUser.id)
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
    [currentUser, messages]
  );

  const getConversations = useCallback(() => {
    if (!currentUser) return [];
    const convMap = {};
    messages.forEach((msg) => {
      if (
        msg.fromUserId === currentUser.id ||
        msg.toUserId === currentUser.id
      ) {
        const otherUserId =
          msg.fromUserId === currentUser.id ? msg.toUserId : msg.fromUserId;
        if (!convMap[otherUserId]) {
          convMap[otherUserId] = [];
        }
        convMap[otherUserId].push(msg);
      }
    });
    return Object.entries(convMap).map(([otherUserId, msgs]) => ({
      otherUserId,
      messages: msgs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    }));
  }, [currentUser, messages]);

  return (
    <MessagesContext.Provider
      value={{ messages, sendMessage, getConversation, getConversations }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
