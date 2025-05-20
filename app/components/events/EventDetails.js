"use client";
import { useState, useEffect } from "react";
import useEvents from "../../hooks/useEvents";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function EventDetails({ eventId }) {
  const { events, joinEvent, leaveEvent } = useEvents();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const foundEvent = events.find((e) => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      router.push("/404");
    }
  }, [events, eventId, router]);

  if (!event) return <div className="text-white text-center">Ładowanie...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-[#403d39] p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-white">{event.title}</h2>
        <p className="text-gray-300 mb-4">{event.description}</p>
        <p className="text-gray-200 mb-2">
          Data: {new Date(event.date).toLocaleDateString()}
        </p>
        {event.location && (
          <p className="text-gray-200 mb-2">Lokalizacja: {event.location}</p>
        )}
        <p className="text-gray-200 mb-2">Organizator: {event.creatorId}</p>
        <p className="text-gray-200 mb-4">
          Uczestników: {event.participants.length}
        </p>
        {currentUser && event.participants.includes(currentUser.id) ? (
          <button
            onClick={() => leaveEvent(event.id)}
            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
          >
            Opuść wydarzenie
          </button>
        ) : (
          <button
            onClick={() => joinEvent(event.id)}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Dołącz do wydarzenia
          </button>
        )}
      </div>
    </div>
  );
}
