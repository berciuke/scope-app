"use client";
import useEvents from "../../hooks/useEvents";
import useAuth from "../../hooks/useAuth";
import Link from "next/link";

export default function EventList() {
  const { events, joinEvent, leaveEvent } = useEvents();
  const { currentUser } = useAuth();

  const handleJoin = (id) => {
    joinEvent(id);
  };

  const handleLeave = (id) => {
    leaveEvent(id);
  };

  return (
    <div className="event-list">
      <h2 className="text-2xl font-bold mb-4 text-white">Wydarzenia</h2>
      {events.length === 0 ? (
        <p className="text-white">Brak wydarzeń.</p>
      ) : (
        <div className="flex gap-2 flex-col">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="card event-item p-4 border rounded my-2 bg-[#403d39] text-white"
            >
              <h3 className="text-xl font-bold p-2">
                <Link
                  href={`/events/${ev.id}`}
                  className="hover:text-[#eb5e28]"
                >
                  {ev.title}
                </Link>
              </h3>
              <p>{ev.description}</p>
              <p>Data: {new Date(ev.date).toLocaleDateString()}</p>
              {ev.location && <p>Lokalizacja: {ev.location}</p>}
              <p>Ilość uczestników: {ev.participants.length}</p>
              {currentUser && ev.participants.includes(currentUser.id) ? (
                <button
                  onClick={() => handleLeave(ev.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Opuść wydarzenie
                </button>
              ) : (
                <button
                  onClick={() => handleJoin(ev.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Dołącz
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
