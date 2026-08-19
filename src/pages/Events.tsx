import { Link } from "react-router-dom";
import { SiteFrame } from "@/components/site/SiteFrame";
import { upcomingEvents, venue, whatsappUrl } from "@/lib/content";
import readingPoster from "@/assets/real-material/12-reading-al-buio-poster-2026.jpg";

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
        <p className="mt-5 text-foreground/70">Qui compaiono solo gli appuntamenti con data e luogo confermati — niente promozione anticipata.</p>
      </div>
    </header>
    <div className="mx-auto max-w-5xl px-6 py-14 md:px-10 md:py-16">
      {upcomingEvents.length === 0 ? (
        /* The empty state stays an empty state. One real past poster shows what kind of programme
           this is, explicitly dated so it cannot be mistaken for something currently on. */
        <div className="grid gap-10 md:grid-cols-12 md:items-start md:gap-12">
          <div className="max-w-xl md:col-span-7">
            <p className="stamp text-signal-unverified">Non ancora verificato</p>
            <h2 className="mt-3 text-2xl">Nessun evento confermato al momento</h2>
            <p className="mt-4 text-foreground/70">
              Non appena una data è confermata, la trovi qui. Nel frattempo, le attività al Parco 11
              Settembre e a Via Nazario Sauro si seguono sui canali social, oppure{" "}
              <a href={whatsappUrl(venue.phone)} className="underline underline-offset-4">
                scrivici su WhatsApp
              </a>{" "}
              per sapere cosa c&apos;è in programma.
            </p>
          </div>
          <figure className="md:col-span-4 md:col-start-9">
            <img
              src={readingPoster}
              alt="Locandina dell'evento Reading al Buio, con il titolo in grande e una figura disegnata in basso"
              loading="lazy"
              className="w-full bg-field-quiet object-contain"
            />
            <figcaption className="mt-2 text-xs text-foreground/55">
              Locandina di Reading al Buio, gennaio 2026 — un appuntamento già passato, per dare
              un&apos;idea del tipo di programmazione.
            </figcaption>
          </figure>
        </div>
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
