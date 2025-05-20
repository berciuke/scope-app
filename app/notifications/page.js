"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import NotificationList from "../components/notifications/NotificationList";

export default function NotificationsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  return (
    <div className="container mx-auto p-4">
      <NotificationList />
    </div>
  );
}
