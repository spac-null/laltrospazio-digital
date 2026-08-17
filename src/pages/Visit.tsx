import { SiteFrame } from "@/components/site/SiteFrame";
import { NoticeBanner } from "@/components/site/NoticeBanner";
import { Fact } from "@/components/site/Fact";
import { nazarioNotice, venue } from "@/lib/content";

const formatReopen = (value: string) =>
  new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Rome" }).format(
    new Date(`${value}T12:00:00`),
  );

const Visit = () => {
  const notice = nazarioNotice();

  return (
    <SiteFrame>
      <NoticeBanner />

      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
          <p className="stamp text-signal-current">Visita</p>
          <h1 className="mt-3 text-3xl md:text-4xl">Prima di venire</h1>
          <p className="mt-4 text-foreground/70">
            Via Nazario Sauro e il Parco 11 Settembre sono due luoghi distinti, con condizioni e
            stagionalità proprie. Quello che sappiamo su ciascuno è qui sotto — dove non abbiamo
            ancora una verifica diretta, lo diciamo chiaramente.
          </p>
        </div>
      </header>

      {/* Via Nazario Sauro — quiet, functional. */}
      <section aria-labelledby="visit-nazario" className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
          <h2 id="visit-nazario" className="text-2xl">Via Nazario Sauro 24/F</h2>

          <div className="mt-6">
            <Fact label="Stato attuale" status={notice ? "verified" : "not-yet-verified"}>
              {notice ? (
                <>Temporaneamente chiuso. Riapertura prevista: {formatReopen(notice.reopening_date)}.</>
              ) : (
                <>Nessuna chiusura in corso al momento risulta pubblicata; gli orari non sono comunque ancora verificati — scrivici prima di venire.</>
              )}
            </Fact>
            <Fact label="Indirizzo" status="verified">
              {venue.address}
            </Fact>
            <Fact label="Orari regolari" status="not-yet-verified">
              Non ancora verificati in modo affidabile. Non pubblichiamo orari finché non li
              confermiamo direttamente.
            </Fact>
            <Fact label="Menu" status="verified">
              <a href={venue.menu_url} className="underline underline-offset-4">Consulta il menu (PDF)</a>
            </Fact>
            <Fact label="Come raggiungerci" status="verified">
              <a href={venue.map_profile.url} className="underline underline-offset-4">Apri la mappa</a>
            </Fact>
          </div>
        </div>
      </section>

      {/* Accessibility — dimension-based, calm, never a badge. */}
      <section aria-labelledby="visit-access" className="border-b border-border section-quiet">
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
          <h2 id="visit-access" className="text-2xl">Accesso</h2>
          <p className="mt-3 text-sm text-foreground/65">
            Non usiamo un&apos;etichetta unica &ldquo;accessibile&rdquo;. Le condizioni cambiano da
            un aspetto all&apos;altro, e la maggior parte non è ancora verificata direttamente da
            noi su questo sito.
          </p>

          <div className="mt-6">
            <Fact label="Ingresso" status="not-yet-verified">
              Condizioni dell&apos;ingresso non ancora verificate su questo sito.
            </Fact>
            <Fact label="Percorso interno" status="not-yet-verified">
              Percorso e disposizione interna non ancora verificati su questo sito.
            </Fact>
            <Fact label="Bagno" status="not-yet-verified">
              Condizioni del bagno non ancora verificate su questo sito.
            </Fact>
            <Fact label="Comunicazione" status="verified">
              Puoi scriverci in italiano, inglese o LIS via video su WhatsApp; rispondiamo per
              testo se preferisci non parlare al telefono.
            </Fact>
          </div>

          <p className="mt-6 text-sm text-foreground/70">
            Se hai un&apos;esigenza specifica, scrivici prima su WhatsApp: te lo confermiamo
            direttamente, invece di indovinare da qui.
          </p>
        </div>
      </section>

      {/* Parco — separate place, separate facts, no inherited status from Nazario. */}
      <section aria-labelledby="visit-parco" className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
          <h2 id="visit-parco" className="text-2xl">Parco 11 Settembre</h2>
          <div className="mt-6">
            <Fact label="Stagione" status="verified">
              Attiva per l&apos;estate 2026, con programmazione insieme ad Associazione Farm e al
              Comune di Bologna.
            </Fact>
            <Fact label="Orari e fine stagione" status="not-yet-verified">
              Non ancora verificati. La programmazione specifica si segue sui canali social.
            </Fact>
            <Fact label="Accesso" status="not-yet-verified">
              Le condizioni di accesso del parco non sono verificate qui e non vanno assunte
              uguali a quelle di Via Nazario Sauro.
            </Fact>
          </div>
        </div>
      </section>

      {/* Contact — minimal friction, no promises we can't keep. */}
      <section aria-labelledby="visit-contact" className="section-quiet">
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
          <h2 id="visit-contact" className="text-2xl">Contattaci</h2>
          <p className="mt-4 text-foreground/75">
            Il modo più diretto è WhatsApp. Non promettiamo un tempo di risposta preciso, ma è il
            canale che controlliamo più spesso.
          </p>
          <a
            href="https://wa.me/393517048064"
            className="mt-6 inline-flex min-h-11 items-center border border-foreground px-6 text-sm font-medium hover:bg-foreground hover:text-background"
          >
            Scrivici su WhatsApp — {venue.phone}
          </a>
        </div>
      </section>
    </SiteFrame>
  );
};

export default Visit;
