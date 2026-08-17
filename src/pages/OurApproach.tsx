import { SiteFrame } from "@/components/site/SiteFrame";
import { ArchiveFigure } from "@/components/site/ArchiveFigure";
import doorStudies from "@/assets/real-material/3-door-studies-sketch.png";
import trolleyPile from "@/assets/real-material/4-trolley-pile.jpg";

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
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <ArchiveFigure
            src={doorStudies}
            alt="Disegno a inchiostro di una porta in tre stati, con prezzo indicato a mano"
            caption="Studio di una porta, con prezzo indicato a mano"
            date="2015–2016"
            aspect="landscape"
          />
          <ArchiveFigure
            src={trolleyPile}
            alt="Carrello pieno di oggetti e arredi accatastati contro una parete verde"
            caption="Materiali accumulati durante l'allestimento"
            date="2015"
            aspect="landscape"
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
