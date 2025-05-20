"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import useReports from "../hooks/useReports";
import AdminUsers from "../components/admin/AdminUsers";
import AdminContent from "../components/admin/AdminContent";
import AdminSettings from "../components/admin/AdminSettings";
import AdminReports from "../components/admin/AdminReports";

export default function AdminPanel() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { reports } = useReports();
  const [activeTab, setActiveTab] = useState("users");
 
  useEffect(() => {
    if (currentUser && currentUser.username && currentUser.username !== "admin") {
      router.push("/404");
    }
  }, [currentUser, router]);


  return (currentUser && currentUser.username && currentUser.username === "admin" && 
    (
    <div className="admin-panel container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel Administracyjny</h1>
      <div className="tabs flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 border rounded ${
            activeTab === "users" ? "bg-blue-500 text-white" : ""
          }`}
        >
          Użytkownicy
        </button>
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 border rounded ${
            activeTab === "content" ? "bg-blue-500 text-white" : ""
          }`}
        >
          Treści
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 border rounded ${
            activeTab === "settings" ? "bg-blue-500 text-white" : ""
          }`}
        >
          Ustawienia
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 border rounded ${
            activeTab === "reports" ? "bg-blue-500 text-white" : ""
          }`}
        >
          Zgłoszenia
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "content" && <AdminContent />}
        {activeTab === "settings" && <AdminSettings />}
        {activeTab === "reports" && <AdminReports reports={reports} />}
      </div>
    </div>
)  
);
}

