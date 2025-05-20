"use client";
import { useContext } from "react";
import { ReportsContext } from "../context/ReportsContext";

export default function useReports() {
  return useContext(ReportsContext);
}
