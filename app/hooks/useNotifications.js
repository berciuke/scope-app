"use client";
import { useContext } from "react";
import { NotificationsContext } from "../context/NotificationsContext";

export default function useNotifications() {
  return useContext(NotificationsContext);
}
