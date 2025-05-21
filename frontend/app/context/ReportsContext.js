"use client";
import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const ReportsContext = createContext();

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(storedReports);
  }, []);

  useEffect(() => {
    localStorage.setItem("reports", JSON.stringify(reports));
  }, [reports]);

  const reportContent = (contentType, contentId, reporterId, reason) => {
    const newReport = {
      id: uuidv4(),
      contentType, 
      contentId, 
      reporterId, 
      reason, 
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [...prev, newReport]);
  };

  return (
    <ReportsContext.Provider value={{ reports, reportContent }}>
      {children}
    </ReportsContext.Provider>
  );
}
