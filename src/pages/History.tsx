import { ArchiveFigure } from "@/components/site/ArchiveFigure";
import { SiteFrame } from "@/components/site/SiteFrame";
import planCutoutsA from "@/assets/real-material/1-plan-cutouts-a.jpg";
import planCutoutsB from "@/assets/real-material/2-plan-cutouts-b.jpg";

type Current = { date: string; title: string; body: string };
type Closed = { date: string; title: string; body: string; width: "sm" | "md" | "lg"; indent?: boolean };

const current: Current[] = [
  {
    date: "29 ottobre 2015 — oggi, attivo",
    title: "Via Nazario Sauro 24/F",
    body: "Il locale attuale. Gestito dalla cooperativa dal 2025, attraverso un affitto d'azienda.",
  },
  {
    date: "27 giugno 2022 — oggi, attiva",
    title: "Cooperativa L'Altro Spazio",
    body: "L'organizzazione che oggi gestisce sia Via Nazario Sauro sia la programmazione al Parco 11 Settembre.",
  },
];

const closed: Closed[] = [
  {
    date: "Febbraio–aprile 2014 — chiuso",
    title: "Via Polese 7",
    body: "Il primo L'Altro Spazio, aperto da Nunzia Vannuccini con un'associazione distinta. Chiuso dopo pochi mesi per un grave allagamento.",
    width: "md",
  },
  {
    date: "24 aprile 2015 — sciolta",
    title: "L'Altro Spazio S.r.l.",
    body: "La società costituita per ricominciare dopo Via Polese, 50/50 tra i due fondatori. L'atto costitutivo è bilingue, con una procedura di traduzione formalizzata nel documento stesso.",
    width: "lg",
    indent: true,
  },
  {
    date: "2018–settembre 2025 — chiuso",
    title: "L'Altro Spazio al Pratello",
    body: "Un secondo locale, Via del Pratello 29/A, sotto una società separata (L'Altro Spazio Pratello SRLS). Chiuso circa sette anni dopo l'apertura.",
    width: "sm",
  },
  {
    date: "Ottobre 2022–2024 — chiuso",
    title: "L'Altro Spazio da Osvaldo",
    body: "Un terzo locale, Via del Pratello 96/A-B. I costi si sono rivelati più alti del previsto rispetto ai ricavi.",
    width: "md",
    indent: true,
  },
];

const widthClass: Record<Closed["width"], string> = {
  sm: "md:max-w-xs",
  md: "md:max-w-sm",
  lg: "md:max-w-md",
};

const History = () => (
  <SiteFrame>
    <header className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">Storia</p>
        <h1 className="mt-3 text-3xl md:text-4xl">Più di un luogo, non un&apos;unica linea</h1>
        <p className="mt-5 text-foreground/70">
          L&apos;Altro Spazio si capisce meglio come una pratica ripetuta in più ambienti che come
          un unico locale continuo. Quello che è ancora attivo oggi è distinto qui sotto da quello
          che si è concluso — e quando.
        </p>
      </div>
    </header>

    {/* Current — large, image-anchored. What's still standing gets the most space. */}
    <section aria-labelledby="history-current" className="section-dense">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <h2 id="history-current" className="sr-only">
          Attivo oggi
        </h2>
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <img
              src={planCutoutsB}
              alt="Pianta stampata con ritagli di carta verde e etichette scritte a mano per cucina e deposito"
              loading="lazy"
              className="h-[60vw] max-h-[520px] min-h-[280px] w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-10 md:col-span-5">
            {current.map((entry) => (
              <div key={entry.title}>
                <p className="stamp text-signal-current">{entry.date}</p>
                <h3 className="mt-2 text-2xl md:text-3xl">{entry.title}</h3>
                <p className="mt-3 max-w-sm text-field-dense-foreground/75">{entry.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Closed — a denser, uneven cluster. No rail, no rows, no shared card size. */}
    <section aria-labelledby="history-closed" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <h2 id="history-closed" className="stamp text-foreground/50">
          Quello che si è concluso
        </h2>

        <div className="mt-8 flex flex-col gap-12 md:mt-12 md:gap-16">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
            <div className={widthClass[closed[0].width]}>
              <p className="stamp text-foreground/45">{closed[0].date}</p>
              <h3 className="mt-2 text-xl">{closed[0].title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{closed[0].body}</p>
            </div>

            <ArchiveFigure
              src={planCutoutsA}
              alt="Stesso rilievo della pianta, da un'altra angolazione, con ritagli verdi disposti a mano"
              caption="Prova sulla pianta originale, marzo 2015"
              aspect="portrait"
              tone="quiet"
              className="md:w-56 md:shrink-0"
            />

            <div className={`${widthClass[closed[1].width]} md:mt-20`}>
              <p className="stamp text-foreground/45">{closed[1].date}</p>
              <h3 className="mt-2 text-xl">{closed[1].title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{closed[1].body}</p>
            </div>
          </div>

          <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16 md:pl-16">
            <div className={widthClass[closed[2].width]}>
              <p className="stamp text-foreground/45">{closed[2].date}</p>
              <h3 className="mt-2 text-xl">{closed[2].title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{closed[2].body}</p>
            </div>

            <div className={`${widthClass[closed[3].width]} md:mt-8`}>
              <p className="stamp text-foreground/45">{closed[3].date}</p>
              <h3 className="mt-2 text-xl">{closed[3].title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{closed[3].body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="history-caution" className="section-quiet">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="history-caution" className="text-2xl">
          Quello che non diciamo
        </h2>
        <p className="mt-4 text-foreground/75">
          Non descriviamo nessuna delle organizzazioni precedenti come un fallimento imprenditoriale
          in senso generico. Via Polese si è chiusa per un danno esterno, non per un giudizio
          sull&apos;idea. Da Osvaldo si è chiuso dopo una difficoltà economica reale, che non
          dettagliamo qui per riservatezza. Non pubblichiamo una percentuale di personale con
          disabilità come dato attuale: le uniche cifre che esistono sono storiche e
          autodichiarate.
        </p>
      </div>
    </section>
  </SiteFrame>
);

export default History;
