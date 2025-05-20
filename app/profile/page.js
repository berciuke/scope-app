"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push(`/profile/${currentUser.username}`);
    } else {
      router.push("/login");
    }
  }, [currentUser, router]);

  return null;
}