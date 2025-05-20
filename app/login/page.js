"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "../components/auth/Login";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  return (
    <div>
      <Login />
    </div>
  );
}
