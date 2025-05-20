"use client";

import Register from "../components/auth/Register";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

export default function RegisterPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [allowRegister, setAllowRegister] = useState(true);

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
    const allowRegister = JSON.parse(localStorage.getItem("settings"))["allowRegister"];
    setAllowRegister(allowRegister);
  }, [currentUser, router]);

  if (!allowRegister) {
    return <div>Administrator wyłączył możliwość rejestracji.</div>
  }

  return (
    <div>
      <Register />
    </div>
  );
}
