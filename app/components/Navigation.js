"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import Image from "next/image";
import useNotifications from "../hooks/useNotifications";
import { useState, useCallback, useLayoutEffect, useEffect } from "react";
import { CiMenuBurger } from "react-icons/ci";

export default function Navigation() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { notifications, markAllAsRead } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setMenuOpen(false);
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/");
  }, [logout, router]);

  const handleNotificationsClick = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setUnreadCount(notifications.filter((notif) => !notif.read).length);
    } else {
      setUnreadCount(0);
    }
  }, [notifications, currentUser]);

  const renderNavLinks = useCallback(() => {
    return currentUser ? (
      <>
        <Link href="/groups" className="nav hover:text-[var(--primary-color)]">
          Grupy
        </Link>
        <Link href="/events" className="nav hover:text-[var(--primary-color)]">
          Wydarzenia
        </Link>
        <Link
          href="/messages"
          className="nav hover:text-[var(--primary-color)]"
        >
          Wiadomości
        </Link>
        <Link href="/search" className="nav hover:text-[var(--primary-color)]">
          Ludzie
        </Link>
        <Link href="/friends" className="nav hover:text-[var(--primary-color)]">
          Znajomi
        </Link>
        <Link
          href="/notifications"
          className="nav hover:text-[var(--primary-color)]"
          onClick={handleNotificationsClick}
        >
          Powiadomienia {unreadCount > 0 && `(${unreadCount})`}
        </Link>
        <Link
          href={"/profile/" + currentUser.username}
          className="nav hover:text-[var(--primary-color)]"
        >
          Profil
        </Link>
        <button
          onClick={handleLogout}
          className="nav hover:text-[var(--primary-color)]"
        >
          Wyloguj
        </button>
      </>
    ) : (
      <>
        <Link href="/login" className="nav hover:text-[var(--primary-color)]">
          Logowanie
        </Link>
        <Link
          href="/register"
          className="nav hover:text-[var(--primary-color)]"
        >
          Rejestracja
        </Link>
      </>
    );
  }, [currentUser, handleNotificationsClick, unreadCount, handleLogout]);

  return (
    <nav className="flex justify-between items-center p-4 bg-[var(--background)] text-[var(--foreground)] relative">
      <div className="flex items-center">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={40}
          height={40}
          className="nav-logo"
        />
        <Link
          href="/"
          className="text-xl font-bold hover:text-[var(--primary-color)] ml-2"
        >
          Scope
        </Link>
      </div>
      {isMobile ? (
        <div>
          <button onClick={toggleMenu} className="text-2xl">
            <CiMenuBurger />
          </button>
          {menuOpen && (
            <div className="absolute right-4 top-full mt-2 bg-[var(--background)] border rounded p-2 flex flex-col space-y-2">
              {renderNavLinks()}
            </div>
          )}
        </div>
      ) : (
        <div className="flex space-x-4">{renderNavLinks()}</div>
      )}
    </nav>
  );
}
