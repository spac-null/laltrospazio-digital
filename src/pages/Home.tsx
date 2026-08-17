import { Link } from "react-router-dom";
import { SiteFrame } from "@/components/site/SiteFrame";
import { NoticeBanner } from "@/components/site/NoticeBanner";
import { ArchiveFigure } from "@/components/site/ArchiveFigure";
import { nazarioNotice, venue } from "@/lib/content";
import constructionDoorways from "@/assets/real-material/5-construction-doorways.jpg";
import planCutoutsA from "@/assets/real-material/1-plan-cutouts-a.jpg";
import elevationSketch from "@/assets/real-material/7-elevation-sketch.jpg";
import floorTape from "@/assets/real-material/6-floor-tape-empty-room.jpg";

const formatReopen = (value: string) =>
  new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Rome" }).format(
    new Date(`${value}T12:00:00`),
  );

const Home = () => {
  const notice = nazarioNotice();

  return (
    <SiteFrame>
      <NoticeBanner />

      {/* Orientation — quiet. What this place is, and its status right now, in one view. */}
      <section aria-labelledby="home-hero" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <p className="stamp text-signal-current">Via Nazario Sauro 24/F, Bologna</p>
          <h1 id="home-hero" className="mt-4 max-w-3xl text-4xl leading-[1.1] md:text-6xl">
            &ldquo;Non mancavano loro. Erano i nostri spazi a essere stati costruiti senza pensarle.&rdquo;
          </h1>
          <p className="stamp mt-3 text-foreground/45">— Nunzia Vannuccini, cofondatrice</p>
          <p className="mt-6 max-w-xl text-foreground/70">
            L&apos;intuizione che ha aperto L&apos;Altro Spazio nel 2015 — e che continua a guidarlo oggi,
            come cooperativa, a Via Nazario Sauro e al Parco 11 Settembre.
          </p>

          <div className="mt-10 max-w-xl border border-border bg-field-quiet p-5">
            {notice ? (
              <p className="text-sm">
                <span className="stamp mr-2 text-signal-notice">Temporaneamente chiuso</span>
                Riapertura prevista: {formatReopen(notice.reopening_date)}.
              </p>
            ) : (
              <p className="text-sm">
                <span className="stamp mr-2 text-signal-unverified">Orari non ancora verificati</span>
                Scrivici prima di venire, così siamo sicuri di esserci.
              </p>
            )}
            <p className="mt-2 text-sm text-foreground/60">{venue.address}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/visita"
              className="inline-flex min-h-11 items-center border border-foreground px-6 text-sm font-medium hover:bg-foreground hover:text-background"
            >
              Vieni a trovarci
            </Link>
            <Link
              to="/eventi"
              className="inline-flex min-h-11 items-center border border-border px-6 text-sm font-medium hover:border-foreground"
            >
              Vedi cosa c&apos;è
            </Link>
          </div>
        </div>
      </section>

      {/* "Not just a bar" — 30-second bridge. Quiet, still, but denser text. */}
      <section aria-labelledby="home-not-a-bar" className="border-b border-border section-quiet">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
          <h2 id="home-not-a-bar" className="text-2xl md:text-3xl">Non solo un bar</h2>
          <p className="mt-5 text-foreground/75">
            Dal 2015, a Via Nazario Sauro. Prima ancora, un primo L&apos;Altro Spazio a Via Polese,
            chiuso nel 2014 dopo un allagamento. Oggi la pratica continua sotto Cooperativa
            L&apos;Altro Spazio, registrata nel 2022, che dal 2025 gestisce sia il locale di Via
            Nazario Sauro sia la programmazione culturale al Parco 11 Settembre — due luoghi
            distinti, con storie e condizioni proprie.
          </p>
          <p className="mt-4 text-foreground/75">
            Il locale è nato come uno spazio sociale e culturale con un bar dentro, non il contrario:
            una &ldquo;galleria con un bar&rdquo;, costruita insieme a persone che poi ci hanno
            lavorato.
          </p>
        </div>
      </section>

      {/* Increasing density — the practice made visible through real construction/design material.
          One image supplies the geometry (full-bleed, its own doorways make the section's depth);
          the plan/sketch fragments sit as citations at its edge, not a matched card grid. */}
      <section aria-labelledby="home-practice" className="section-dense">
        <div className="mx-auto max-w-6xl px-6 pt-20 md:px-10 md:pt-28">
          <h2 id="home-practice" className="max-w-xl text-2xl md:text-3xl">
            Uno spazio pensato prima di essere costruito
          </h2>
          <p className="mt-4 max-w-xl text-field-dense-foreground/70">
            Prima delle pareti finite, c&apos;erano piante segnate a mano, prove di misura, e un
            cantiere condiviso con persone che sarebbero poi diventate lo staff.
          </p>
        </div>

        <div className="relative mt-12 w-full">
          <img
            src={constructionDoorways}
            alt="Interno in costruzione di Via Nazario Sauro, con più aperture a profondità diverse e tracce a matita sul muro"
            loading="lazy"
            className="h-[46vw] max-h-[640px] min-h-[320px] w-full object-cover"
          />
          <p className="absolute bottom-3 left-6 text-xs text-field-dense-foreground/60 md:left-10">
            Cantiere di Via Nazario Sauro, prima dell&apos;apertura — 2015
          </p>

          <div className="absolute -bottom-16 right-6 hidden w-64 border border-field-dense-foreground/15 bg-field-dense p-3 shadow-xl md:right-10 md:block">
            <img
              src={planCutoutsA}
              alt="Pianta stampata con ritagli di carta verde disposti a mano per provare la disposizione degli spazi"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <p className="mt-2 text-xs text-field-dense-foreground/55">Prova sulla pianta originale, marzo 2015</p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 md:px-10 md:pb-28 md:pt-16">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <ArchiveFigure
              src={floorTape}
              alt="Stanza vuota con linee di nastro adesivo sul pavimento per segnare la futura disposizione"
              caption="Nastro a terra, prima degli arredi"
              date="2015"
              aspect="square"
              tone="dense"
              className="md:col-span-4"
            />
            <ArchiveFigure
              src={elevationSketch}
              alt="Schizzo a mano di un prospetto con etichette in italiano per spogliatoio e bar"
              caption="Schizzo di prospetto, con gli ambienti etichettati a mano"
              date="2016"
              aspect="wide"
              tone="dense"
              className="md:col-span-8"
            />
          </div>
        </div>
      </section>

      {/* Interruption / depth — Parco is a distinct, current, separate activity. Different rhythm from Nazario. */}
      <section aria-labelledby="home-parco" className="border-b border-border bg-signal-current text-signal-current-foreground">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <p className="stamp text-signal-current-foreground/70">Parco 11 Settembre</p>
          <h2 id="home-parco" className="mt-3 max-w-xl text-2xl md:text-3xl">
            Un luogo diverso, una programmazione attiva ora
          </h2>
          <p className="mt-5 max-w-xl text-signal-current-foreground/85">
            Al Parco 11 Settembre, la cooperativa porta avanti attività culturali estive insieme ad
            Associazione Farm e al Comune di Bologna, nell&apos;ambito di un patto di collaborazione
            triennale firmato nel maggio 2025. La stagione estiva 2026 è attiva; la data di chiusura
            della stagione non è ancora verificata.
          </p>
          <p className="mt-5 max-w-xl text-sm text-signal-current-foreground/70">
            Non abbiamo ancora fotografie aggiornate dell&apos;attività al Parco da pubblicare qui —
            arriveranno con la prossima raccolta di materiale.
          </p>
        </div>
      </section>

      {/* Release — quiet again. Two paths, growing directly out of the field — not cards, not tiles. */}
      <section aria-labelledby="home-paths" className="section-quiet">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-24">
          <h2 id="home-paths" className="sr-only">Continua da qui</h2>
          <div className="divide-y divide-border border-t border-border">
            <Link to="/approccio" className="group flex flex-col gap-2 py-8 md:flex-row md:items-baseline md:justify-between md:gap-10">
              <span className="md:w-56 md:shrink-0">
                <span className="stamp block text-foreground/50">Il metodo</span>
                <span className="mt-1 block font-display text-2xl">Il nostro approccio</span>
              </span>
              <span className="flex-1 text-sm text-foreground/70">
                Come lo spazio, la struttura e la partecipazione lavorano insieme, dal cantiere al
                bancone.
              </span>
              <span className="shrink-0 text-sm underline-offset-4 group-hover:underline">
                Leggi →
              </span>
            </Link>
            <Link to="/lavora-con-noi" className="group flex flex-col gap-2 py-8 md:flex-row md:items-baseline md:justify-between md:gap-10">
              <span className="md:w-56 md:shrink-0">
                <span className="stamp block text-foreground/50">Collaborare</span>
                <span className="mt-1 block font-display text-2xl">Lavora con noi</span>
              </span>
              <span className="flex-1 text-sm text-foreground/70">
                Il tipo di lavoro che sosteniamo, con quali prove, e come iniziare.
              </span>
              <span className="shrink-0 text-sm underline-offset-4 group-hover:underline">
                Scopri →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
};

export default Home;
