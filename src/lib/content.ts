import { events, notices, venue } from "@/generated/content";

export { events, notices, venue };

export const upcomingEvents = events.filter(
  (event) => event.event_status !== "cancelled" && Date.parse(event.start) >= Date.now(),
);

export const findEvent = (slug: string) => events.find((event) => event.slug === slug);

const localCalendarDate = (date: Date, timezone: string) => new Intl.DateTimeFormat("en-US", {
  timeZone: timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).formatToParts(date).reduce<Record<string, string>>((result, part) => {
  if (part.type !== "literal") result[part.type] = part.value;
  return result;
}, {} as Record<string, string>);

export const activeNotices = (now = new Date()) => notices.filter((notice) => {
  const parts = localCalendarDate(now, notice.timezone);
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  return notice.publication_status === "published" && date >= notice.valid_from && date < notice.valid_until;
});
