"use client";

import { useParams } from "next/navigation";
import EventDetails from "../../components/events/EventDetails";

export default function EventPage() {
    const { eventId } = useParams();

    return <EventDetails eventId={eventId} />;
}