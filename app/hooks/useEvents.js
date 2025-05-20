"use client";
import { useContext } from "react";
import { EventsContext } from "../context/EventsContext";

export default function useEvents() {
  return useContext(EventsContext);
}
