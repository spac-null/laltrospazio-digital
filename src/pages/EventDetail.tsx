import { Link, useParams } from "react-router-dom";
import { findEvent, venue } from "@/lib/content";

const formatDate = (value: string) => new Intl.DateTimeFormat("it-IT", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Europe/Rome",
}).format(new Date(value));

const EventDetail = () => {
  const { slug } = useParams();
  const event = findEvent(slug ?? "");

  if (!event) {
    return <main className="min-h-screen bg-background px-6 py-16"><h1 className="text-4xl">Evento non trovato</h1><Link className="mt-6 inline-block underline" to="/eventi">Torna agli eventi</Link></main>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start,
    ...(event.end ? { endDate: event.end } : {}),
    eventStatus: event.event_status === "cancelled" ? "https://schema.org/EventCancelled" : event.event_status === "postponed" ? "https://schema.org/EventPostponed" : "https://schema.org/EventScheduled",
    description: event.description,
    ...(event.image ? { image: [event.image] } : {}),
    location: { "@type": "Place", name: event.location.name, address: event.location.address ?? venue.address },
    ...(event.booking_url ? { url: event.booking_url } : {}),
  };

  return (
    <main className="min-h-screen bg-background px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-4xl">
        <Link to="/eventi" className="text-sm underline underline-offset-4">Tutti gli eventi</Link>
        <article className="mt-12">
          {event.image && <img src={event.image} alt="" className="mb-10 max-h-[28rem] w-full object-cover" />}
          {event.event_status !== "scheduled" && <p className="mb-5 inline-block border border-primary px-3 py-1 text-sm uppercase tracking-wider text-primary">{event.event_status === "cancelled" ? "Evento annullato" : "Evento posticipato"}</p>}
          <h1 className="text-5xl text-secondary md:text-7xl">{event.title}</h1>
          <p className="mt-6 text-lg text-primary">{formatDate(event.start)}</p>
          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-secondary/85">{event.description}</p>
          <dl className="mt-10 grid gap-6 border-y border-border py-8 md:grid-cols-2">
            <div><dt className="font-medium text-secondary">Dove</dt><dd className="mt-1 text-secondary/75">{event.location.name}<br />{event.location.address ?? venue.address}</dd></div>
            {event.accessibility.status !== "unknown" && event.accessibility.summary && <div><dt className="font-medium text-secondary">Accessibilità</dt><dd className="mt-1 text-secondary/75">{event.accessibility.summary}</dd></div>}
          </dl>
          {event.cancellation?.reason && <p className="mt-8 text-secondary/75">Motivo: {event.cancellation.reason}</p>}
          {event.postponement?.reason && <p className="mt-8 text-secondary/75">Nota: {event.postponement.reason}</p>}
          {event.booking_url && <a href={event.booking_url} target="_blank" rel="noreferrer" className="mt-8 inline-block bg-secondary px-6 py-3 text-white">Informazioni e prenotazioni</a>}
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </div>
    </main>
  );
};

export default EventDetail;
