import { ArchiveFigure } from "@/components/site/ArchiveFigure";
import { SiteFrame } from "@/components/site/SiteFrame";
import planCutoutsB from "@/assets/real-material/2-plan-cutouts-b.jpg";

type Entry = {
  date: string;
  title: string;
  body: string;
  status: "closed" | "ongoing";
};

const entries: Entry[] = [
  {
    date: "Febbraio–aprile 2014",
    title: "Via Polese 7",
    body: "Il primo L'Altro Spazio, aperto da Nunzia Vannuccini con un'associazione distinta. Chiuso dopo pochi mesi per un grave allagamento.",
    status: "closed",
  },
  {
    date: "24 aprile 2015",
    title: "L'Altro Spazio S.r.l.",
    body: "Costituzione della società, 50/50 tra i due fondatori. L'atto costitutivo è bilingue, con una procedura di traduzione formalizzata nel documento stesso.",
    status: "closed",
  },
  {
    date: "29 ottobre 2015 — oggi",
    title: "Via Nazario Sauro 24/F",
    body: "Apertura del locale attuale. Ancora attivo, oggi gestito dalla cooperativa.",
    status: "ongoing",
  },
  {
    date: "2018–settembre 2025",
    title: "L'Altro Spazio al Pratello",
    body: "Un secondo locale, Via del Pratello 29/A, sotto una società separata (L'Altro Spazio Pratello SRLS). Chiuso nel settembre 2025, circa sette anni dopo l'apertura.",
    status: "closed",
  },
  {
    date: "Ottobre 2022–2024",
    title: "L'Altro Spazio da Osvaldo",
    body: "Un terzo locale, Via del Pratello 96/A-B. Chiuso nel 2024: i costi si sono rivelati più alti del previsto rispetto ai ricavi.",
    status: "closed",
  },
  {
    date: "27 giugno 2022 — oggi",
    title: "Cooperativa L'Altro Spazio",
    body: "Registrazione della cooperativa attuale. Dal 2025 gestisce sia Via Nazario Sauro sia la programmazione al Parco 11 Settembre.",
    status: "ongoing",
  },
];

const History = () => (
  <SiteFrame>
    <header className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">Storia</p>
        <h1 className="mt-3 text-3xl md:text-4xl">Più di un luogo, non un'unica linea</h1>
        <p className="mt-5 text-foreground/70">
          L&apos;Altro Spazio si capisce meglio come una pratica ripetuta in più ambienti che come
          un unico locale continuo. Ogni voce qui sotto indica chiaramente se è ancora attiva o se
          si è conclusa — e quando.
        </p>
      </div>
    </header>

    <section aria-labelledby="history-timeline" className="section-dense">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <h2 id="history-timeline" className="sr-only">Cronologia</h2>
        <ol className="space-y-10">
          {entries.map((entry) => (
            <li key={entry.title} className="border-l-2 border-field-dense-foreground/20 pl-6">
              <p className="stamp text-field-dense-foreground/50">{entry.date}</p>
              <h3 className="mt-1 text-xl">
                {entry.title}{" "}
                <span
                  className={`stamp ml-2 align-middle ${
                    entry.status === "ongoing" ? "text-signal-current" : "text-field-dense-foreground/45"
                  }`}
                >
                  {entry.status === "ongoing" ? "attivo" : "chiuso"}
                </span>
              </h3>
              <p className="mt-2 max-w-2xl text-field-dense-foreground/75">{entry.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <ArchiveFigure
            src={planCutoutsB}
            alt="Pianta con etichette scritte a mano per cucina e deposito"
            caption="Pianta di lavoro con ambienti etichettati a mano"
            date="marzo 2015"
            aspect="landscape"
          />
        </div>
      </div>
    </section>

    <section aria-labelledby="history-caution" className="section-quiet">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="history-caution" className="text-2xl">Quello che non diciamo</h2>
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
