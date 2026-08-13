import { Link } from "react-router-dom";
import { upcomingEvents } from "@/lib/content";

const formatDate = (value: string) => new Intl.DateTimeFormat("it-IT", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Europe/Rome",
}).format(new Date(value));

const Events = () => (
  <main className="min-h-screen bg-background px-6 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-5xl">
      <Link to="/" className="text-sm underline underline-offset-4">Torna al sito</Link>
      <header className="mt-12 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">L&apos;Altro Spazio</p>
        <h1 className="mt-3 text-5xl text-secondary md:text-7xl">Eventi</h1>
        <p className="mt-6 max-w-2xl text-secondary/80">Appuntamenti, arte e cultura a Bologna. Le date pubblicate qui provengono dal registro eventi verificato.</p>
      </header>
      {upcomingEvents.length === 0 ? (
        <section className="mt-16 border border-border bg-white p-8 md:p-12">
          <h2 className="text-3xl text-secondary">Nessun evento in programma</h2>
          <p className="mt-4 max-w-xl text-secondary/75">Non ci sono ancora appuntamenti confermati da mostrare. Torna presto per gli aggiornamenti.</p>
        </section>
      ) : (
        <section className="mt-16 grid gap-6 md:grid-cols-2">
          {upcomingEvents.map((event) => (
            <article key={event.id} className="border border-border bg-white p-6">
              <p className="text-sm text-primary">{formatDate(event.start)}</p>
              <h2 className="mt-3 text-3xl text-secondary">{event.title}</h2>
              <p className="mt-3 text-secondary/75">{event.description}</p>
              <Link to={`/eventi/${event.slug}`} className="mt-6 inline-block font-medium underline underline-offset-4">Scopri l&apos;evento</Link>
            </article>
          ))}
        </section>
      )}
    </div>
  </main>
);

export default Events;
