"use client";
import useEvents from "../hooks/useEvents";
import useAuth from "../hooks/useAuth";
import EventList from "../components/events/EventList";
import EventForm from "../components/events/EventForm";

export default function EventPage() {
  const { events, joinEvent, leaveEvent } = useEvents();
  const { currentUser } = useAuth();

  const handleJoin = (id) => {
    joinEvent(id);
  };

  const handleLeave = (id) => {
    leaveEvent(id);
  };

  return (
    <div>
      <EventForm />
      <EventList />
    </div>
  );
}
