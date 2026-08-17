import { Link, useParams } from "react-router-dom";
import { SiteFrame } from "@/components/site/SiteFrame";
import { Fact } from "@/components/site/Fact";
import { findEvent, venue } from "@/lib/content";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("it-IT", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Rome" }).format(
    new Date(value),
  );

const EventDetail = () => {
  const { slug } = useParams();
  const event = findEvent(slug ?? "");

  if (!event) {
    return (
      <SiteFrame>
        <div className="mx-auto max-w-3xl px-6 py-20 md:px-10">
          <p className="stamp text-signal-current">Cosa c&apos;è</p>
          <h1 className="mt-3 text-3xl">Evento non trovato</h1>
          <Link className="mt-6 inline-block text-sm underline underline-offset-4" to="/eventi">
            Torna agli eventi
          </Link>
        </div>
      </SiteFrame>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start,
    ...(event.end ? { endDate: event.end } : {}),
    eventStatus:
      event.event_status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : event.event_status === "postponed"
          ? "https://schema.org/EventPostponed"
          : "https://schema.org/EventScheduled",
    description: event.description,
    ...(event.image ? { image: [event.image] } : {}),
    location: { "@type": "Place", name: event.location.name, address: event.location.address ?? venue.address },
    ...(event.booking_url ? { url: event.booking_url } : {}),
  };

  const isDisrupted = event.event_status !== "scheduled";

  return (
    <SiteFrame>
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
          <Link to="/eventi" className="text-sm underline underline-offset-4">
            Tutti gli eventi
          </Link>

          {isDisrupted ? (
            <p className="stamp mt-6 text-signal-notice">
              {event.event_status === "cancelled" ? "Evento annullato" : "Evento posticipato"}
            </p>
          ) : (
            <p className="stamp mt-6 text-signal-current">Cosa c&apos;è</p>
          )}

          <h1 className="mt-3 text-3xl md:text-4xl">{event.title}</h1>
          <p className="mt-4 max-w-xl text-foreground/75">{event.description}</p>
        </div>
      </header>

      {event.image ? (
        <img
          src={event.image}
          alt=""
          loading="lazy"
          className="h-[42vw] max-h-[560px] min-h-[220px] w-full border-b border-border object-cover"
        />
      ) : null}

      <section aria-labelledby="event-facts" className="section-quiet">
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
          <h2 id="event-facts" className="sr-only">
            Dettagli pratici
          </h2>

          <Fact label="Quando" status="verified">
            {formatDateTime(event.start)}
            {event.end ? <> — {formatDateTime(event.end)}</> : null}
          </Fact>

          <Fact label="Dove" status="verified">
            {event.location.name}
            {event.location.address ?? venue.address ? (
              <>
                <br />
                {event.location.address ?? venue.address}
              </>
            ) : null}
          </Fact>

          {event.event_status === "cancelled" && event.cancellation?.reason ? (
            <Fact label="Motivo dell'annullamento" status="verified">
              {event.cancellation.reason}
            </Fact>
          ) : null}

          {event.event_status === "postponed" && event.postponement?.reason ? (
            <Fact label="Nota sul rinvio" status="verified">
              {event.postponement.reason}
            </Fact>
          ) : null}

          <Fact
            label="Accessibilità"
            status={event.accessibility.status === "unknown" ? "not-yet-verified" : "verified"}
          >
            {event.accessibility.status === "unknown" || !event.accessibility.summary
              ? "Non ancora verificata per questo evento specifico — scrivici se hai un'esigenza particolare."
              : event.accessibility.summary}
          </Fact>

          {event.booking_url ? (
            <Fact label="Prenotazione" status="verified">
              <a href={event.booking_url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                Informazioni e prenotazioni
              </a>
            </Fact>
          ) : null}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </SiteFrame>
  );
};

export default EventDetail;
