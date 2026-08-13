import { events, venue } from "@/generated/content";

export { events, venue };

export const upcomingEvents = events.filter(
  (event) => event.event_status !== "cancelled" && Date.parse(event.start) >= Date.now(),
);

export const findEvent = (slug: string) => events.find((event) => event.slug === slug);
