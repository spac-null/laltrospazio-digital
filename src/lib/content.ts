import { events, notices, venue } from "@/generated/content";

export { events, notices, venue };

/**
 * WhatsApp conversation entry point for a stored number. Derived from the number itself so the two
 * distinct contacts — the general WhatsApp Business line and the dedicated LIS/video contact —
 * can never drift out of sync with the links that point at them.
 *
 * Deliberately wa.me and never `tel:`: neither number is a landline, and no reliable web deep-link
 * exists to start a video call, so the site only ever opens a chat.
 */
export const whatsappUrl = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;

/** "5 ottobre 2026" — used wherever a confirmed calendar date is shown in prose. */
export const formatItalianDate = (value: string) =>
  new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Rome" }).format(
    new Date(`${value}T12:00:00`),
  );

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

/** The notice currently in effect for Via Nazario Sauro, if any. Does not affect Parco. */
export const nazarioNotice = (now = new Date()) =>
  activeNotices(now).find((notice) => notice.venue_id === venue.id) ?? null;
