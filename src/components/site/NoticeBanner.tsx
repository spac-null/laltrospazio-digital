import { activeNotices } from "@/lib/content";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", timeZone: "Europe/Rome" }).format(
    new Date(`${value}T12:00:00`),
  );

/**
 * The stored notice message is owner-authored prose that includes its own unhedged reopening
 * clause ("Riapriamo ..."). We render the closure explanation from that prose but always state the
 * reopening date from the structured `reopening_date` field, as a single hedged line — never both,
 * which would contradict itself in front of the visitor.
 */
const closureExplanation = (message: string) =>
  message
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !/riapr/i.test(sentence))
    .join(" ");

/** Renders any notice currently in effect for Via Nazario. Nothing to render outside a notice's valid_from/valid_until window — expiry is automatic, not manual cleanup. */
export const NoticeBanner = () => {
  const notices = activeNotices();
  if (notices.length === 0) return null;

  return (
    <div role="status" className="border-b border-signal-notice/30 bg-signal-notice/10">
      <div className="mx-auto max-w-6xl px-6 py-3 md:px-10">
        {notices.map((notice) => (
          <p key={notice.id} className="text-sm text-signal-notice">
            <span className="stamp mr-2 rounded-sm bg-signal-notice px-1.5 py-0.5 text-signal-notice-foreground">Avviso</span>
            {closureExplanation(notice.message)}{" "}
            <span className="text-signal-notice/70">Riapertura prevista: {formatDate(notice.reopening_date)}.</span>
          </p>
        ))}
      </div>
    </div>
  );
};
