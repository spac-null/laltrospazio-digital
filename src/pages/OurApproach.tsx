import { SiteFrame } from "@/components/site/SiteFrame";
import { ArchiveFigure } from "@/components/site/ArchiveFigure";
import doorStudies from "@/assets/real-material/3-door-studies-sketch.png";
import trolleyPile from "@/assets/real-material/4-trolley-pile.jpg";
import rampPlan from "@/assets/real-material/23-container-ramp-plan.jpg";
import thresholdDrilling from "@/assets/real-material/13-threshold-drilling-2016.jpg";
import notAccessAssessment from "@/assets/real-material/14-not-access-assessment-2018.jpg";

const OurApproach = () => (
  <SiteFrame>
    <header className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">Il nostro approccio</p>
        <h1 className="mt-3 text-3xl md:text-4xl">Lo spazio comunica prima di una parola</h1>
        <p className="mt-5 text-foreground/70">
          A Via Nazario Sauro, &ldquo;attività, incontro, spazio sociale&rdquo; sono entrate nel
          linguaggio dei fondatori prima della parola &ldquo;bar&rdquo;. Il metodo che ne è nato non
          è una lista di valori: è un modo di costruire, testare e correggere, ripetuto per un
          decennio in condizioni reali.
        </p>
      </div>
    </header>

    <section aria-labelledby="approach-space" className="section-quiet border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="approach-space" className="text-2xl">Spazio e struttura</h2>
        <p className="mt-4 text-foreground/75">
          Il locale del 2015 nasce come una &ldquo;galleria con un bar&rdquo;: uno spazio bianco,
          pensato per ospitare mostre, con il bar come una delle attività al suo interno, non il
          suo scopo. Prima della costruzione definitiva, l&apos;allestimento è stato provato
          fisicamente — nastro a terra, piante disegnate a mano, sopralluoghi in altri locali e
          mercatini per raccogliere riferimenti.
        </p>
      </div>
    </section>

    <section aria-labelledby="approach-testing" className="section-dense">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <h2 id="approach-testing" className="max-w-xl text-2xl">Costruito insieme, adattato per uso</h2>
        <p className="mt-4 max-w-xl text-field-dense-foreground/70">
          Il primo cantiere ha unito artigiani e persone che avrebbero poi lavorato nel locale —
          alcune di loro con disabilità. I dettagli pratici — un rubinetto della spina modificato,
          un bancone adattato nel tempo — non sono nati da una specifica di progetto, ma da un uso
          quotidiano corretto ripetutamente.
        </p>
        {/* The door study directly shows testing/adjustment (the paragraph's subject); the
            materials pile is real but secondary evidence, so it gets a visibly smaller field. */}
        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <ArchiveFigure
            src={doorStudies}
            alt="Disegno a inchiostro di una porta in tre stati, con prezzo indicato a mano"
            caption="Studio di una porta, con prezzo indicato a mano"
            date="2015–2016"
            aspect="wide"
            tone="dense"
            className="md:col-span-8"
          />
          <ArchiveFigure
            src={trolleyPile}
            alt="Carrello pieno di oggetti e arredi accatastati contro una parete verde"
            caption="Materiali accumulati durante l'allestimento"
            date="2015"
            aspect="square"
            tone="dense"
            className="md:col-span-4"
          />
        </div>
      </div>
    </section>

    <section aria-labelledby="approach-translation" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="approach-translation" className="text-2xl">Traduzione come parte del significato</h2>
        <p className="mt-4 text-foreground/75">
          Uno dei due fondatori è sordo; l&apos;atto costitutivo della società del 2015 è bilingue,
          con una procedura di traduzione formalizzata nel documento stesso. La stessa logica ha
          attraversato dieci anni di programmazione: dal servizio quotidiano al bancone in LIS e a
          gesti, fino a progetti recenti che trattano la percezione sorda come materiale
          compositivo, non come accomodamento.
        </p>
      </div>
    </section>

    {/* One threshold, three real stages: a dimensioned proposal, the physical act of installing it,
        and a written verdict that it still failed. Deliberately ends on the failure rather than on a
        finished ramp — the sequence leads into "Cosa questo non significa" below, and the site makes
        no verified claim about current access. Unequal spans and offsets, not a card row. */}
    <section aria-labelledby="approach-threshold" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
        <h2 id="approach-threshold" className="max-w-xl text-2xl">Una soglia, in tre passaggi</h2>
        <p className="mt-4 max-w-xl text-foreground/70">
          Non un prima e dopo. Una misura proposta, il lavoro per farla stare in un edificio
          esistente, e il giudizio scritto sopra quando ancora non bastava.
        </p>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:gap-10">
          <figure className="md:col-span-7">
            <p className="stamp text-signal-current">01 — la misura proposta</p>
            <img
              src={rampPlan}
              alt="Disegno tecnico della pianta con quote in rosso e magenta, fra cui una rampa d'ingresso dimensionata circa 106 per 126 centimetri"
              loading="lazy"
              className="mt-2 aspect-[3/2] w-full bg-field-quiet object-contain"
            />
            <figcaption className="mt-2 text-xs text-foreground/55">
              Pianta quotata del container, con la rampa disegnata a misura
            </figcaption>
          </figure>

          <figure className="md:col-span-5 md:mt-14">
            <p className="stamp text-signal-current">02 — messa in opera</p>
            <img
              src={thresholdDrilling}
              alt="Una persona chinata trapana la pavimentazione per fissare una pedana di gomma all'ingresso, con livella e pinze appoggiate accanto"
              loading="lazy"
              className="mt-2 aspect-[3/4] w-full object-cover"
            />
            <figcaption className="mt-2 text-xs text-foreground/55">
              Fissaggio della pedana d&apos;ingresso — maggio 2016
            </figcaption>
          </figure>

          <figure className="md:col-span-9 md:col-start-4 md:mt-4">
            <p className="stamp text-signal-notice">03 — il giudizio</p>
            <img
              src={notAccessAssessment}
              alt="Bagno grezzo non finito, con lavabo e sanitario installati, su cui è scritto a mano in grande NOT ACCESS con un pennarello azzurro"
              loading="lazy"
              className="mt-2 aspect-[16/9] w-full object-cover"
            />
            <figcaption className="mt-2 text-xs text-foreground/55">
              Verifica di un bagno, annotata a mano — dicembre 2018. Riguarda quello stato di allora,
              non le condizioni attuali: quelle non sono verificate su questo sito.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section aria-labelledby="approach-honesty" className="section-quiet">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="approach-honesty" className="text-2xl">Cosa questo non significa</h2>
        <p className="mt-4 text-foreground/75">
          Non tutte le funzionalità di accessibilità documentate nel tempo — menu in Braille,
          bancone abbassato, ordinazione in LIS — sono state progettate con lo stesso livello di
          intenzionalità dichiarata dell&apos;allestimento artistico. Alcune sono nate per uso,
          altre per scelta esplicita. Non presentiamo questa distinzione come risolta: è parte
          onesta di come descriviamo il nostro stesso metodo.
        </p>
      </div>
    </section>
  </SiteFrame>
);

export default OurApproach;
