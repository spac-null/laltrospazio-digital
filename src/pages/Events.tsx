import { Link } from "react-router-dom";
import { SiteFrame } from "@/components/site/SiteFrame";
import { upcomingEvents } from "@/lib/content";

const formatDate = (value: string) => new Intl.DateTimeFormat("it-IT", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Europe/Rome",
}).format(new Date(value));

const Events = () => (
  <SiteFrame>
    <header className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">Cosa c&apos;è</p>
        <h1 className="mt-3 text-3xl md:text-4xl">Appuntamenti in programma</h1>
        <p className="mt-5 text-foreground/70">Le date qui sotto provengono dal registro eventi verificato — niente promozione, solo ciò che è confermato.</p>
      </div>
    </header>
    <div className="mx-auto max-w-5xl px-6 py-14 md:px-10 md:py-16">
      {upcomingEvents.length === 0 ? (
        <section className="border border-border bg-field-quiet p-8 md:p-12">
          <p className="stamp text-signal-unverified">Non ancora verificato</p>
          <h2 className="mt-3 text-2xl">Nessun evento confermato al momento</h2>
          <p className="mt-4 max-w-xl text-foreground/70">
            Non ci sono ancora appuntamenti confermati da mostrare qui. Le attività al Parco 11
            Settembre e a Via Nazario Sauro si seguono anche sui canali social nel frattempo.
          </p>
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2">
          {upcomingEvents.map((event) => (
            <article key={event.id} className="border border-border p-6">
              <p className="stamp text-signal-current">{formatDate(event.start)}</p>
              <h2 className="mt-3 text-2xl">{event.title}</h2>
              <p className="mt-3 text-foreground/70">{event.description}</p>
              <Link to={`/eventi/${event.slug}`} className="mt-6 inline-block text-sm font-medium underline underline-offset-4">Scopri l&apos;evento →</Link>
            </article>
          ))}
        </section>
      )}
    </div>
  </SiteFrame>
);

export default Events;
