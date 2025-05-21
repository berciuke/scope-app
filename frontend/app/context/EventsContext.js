"use client";
import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useAuth from "../hooks/useAuth";

export const EventsContext = createContext();

export function EventsProvider({ children }) {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const createEvent = (eventData) => {
    if (!currentUser) return;
    const newEvent = {
      id: uuidv4(),
      creatorId: currentUser.id,
      ...eventData,
      participants: [currentUser.id],
      createdAt: new Date().toISOString(),
    };
    setEvents([newEvent, ...events]);
  };

  const joinEvent = (eventId) => {
    if (!currentUser) return;
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId && !ev.participants.includes(currentUser.id)
          ? { ...ev, participants: [...ev.participants, currentUser.id] }
          : ev
      )
    );
  };

  const leaveEvent = (eventId) => {
    if (!currentUser) return;
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              participants: ev.participants.filter(
                (id) => id !== currentUser.id
              ),
            }
          : ev
      )
    );
  };

  return (
    <EventsContext.Provider
      value={{ events, createEvent, joinEvent, leaveEvent }}
    >
      {children}
    </EventsContext.Provider>
  );
}
