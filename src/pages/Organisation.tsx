import { Fact } from "@/components/site/Fact";
import { SiteFrame } from "@/components/site/SiteFrame";

const Organisation = () => (
  <SiteFrame>
    <header className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">L&apos;organizzazione</p>
        <h1 className="mt-3 text-3xl md:text-4xl">Cooperativa L&apos;Altro Spazio</h1>
        <p className="mt-5 text-foreground/70">
          L&apos;Altro Spazio è il nome pubblico di una pratica più vecchia dell&apos;attuale
          organizzazione che la gestisce. Questa pagina riguarda l&apos;entità legale attuale, non
          l&apos;identità pubblica complessiva — quella è raccontata altrove su questo sito.
        </p>
      </div>
    </header>

    <section aria-labelledby="org-current" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="org-current" className="text-2xl">Chi gestisce cosa, oggi</h2>
        <div className="mt-6">
          <Fact label="Registrazione" status="verified">
            Cooperativa L&apos;Altro Spazio è registrata nel registro delle cooperative di Bologna
            dal 27 giugno 2022.
          </Fact>
          <Fact label="Via Nazario Sauro" status="verified">
            Dal 2025, la cooperativa gestisce direttamente il locale, attraverso un affitto
            d&apos;azienda deliberato dal consiglio nel marzo 2025.
          </Fact>
          <Fact label="Parco 11 Settembre" status="verified">
            La cooperativa partecipa alla programmazione del Parco insieme ad Associazione Farm,
            nell&apos;ambito del patto con il Comune di Bologna firmato nel maggio 2025.
          </Fact>
          <Fact label="Rappresentanza legale" status="not-yet-verified">
            Non indichiamo qui un legale rappresentante attuale: le fonti a nostra disposizione non
            sono ancora concordi su questo punto.
          </Fact>
        </div>
      </div>
    </section>

    <section aria-labelledby="org-not-single" className="section-quiet border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="org-not-single" className="text-2xl">Non un&apos;unica entità continua</h2>
        <p className="mt-4 text-foreground/75">
          La cooperativa non esiste dal 2010, né dal 2014, né dal 2015. La pratica che oggi chiama
          &ldquo;L&apos;Altro Spazio&rdquo; è passata attraverso almeno quattro organizzazioni
          diverse — un&apos;associazione, due società, e infine questa cooperativa — oltre alla
          presenza separata e parallela di Associazione Farm al Parco. La cronologia completa è
          nella pagina Storia.
        </p>
      </div>
    </section>

    <section aria-labelledby="org-registrations" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="org-registrations" className="text-2xl">Idoneità e candidature pubbliche</h2>
        <div className="mt-6">
          <Fact label="Iscrizione MePA" status="verified">
            Da novembre 2025, la cooperativa ha richiesto l&apos;ammissione al mercato elettronico
            della pubblica amministrazione in sei categorie di servizio. Questo è un segnale di
            direzione istituzionale, non una prova di volumi di attività già svolti in quelle
            categorie.
          </Fact>
        </div>
      </div>
    </section>
  </SiteFrame>
);

export default Organisation;
