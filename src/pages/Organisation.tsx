import { SiteFrame } from "@/components/site/SiteFrame";
import { venue } from "@/lib/content";

const Organisation = () => (
  <SiteFrame>
    <header className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">L&apos;organizzazione</p>
        <h1 className="mt-3 text-3xl md:text-4xl">Cooperativa L&apos;Altro Spazio</h1>
        <p className="mt-5 text-foreground/70">
          L&apos;Altro Spazio è il nome pubblico di una pratica più vecchia dell&apos;attuale
          organizzazione che la gestisce. Questa pagina riguarda l&apos;entità legale attuale, non
          l&apos;identità pubblica complessiva — quella è raccontata nella pagina Storia.
        </p>
      </div>
    </header>

    {/* The one number that matters here, rendered as a real dated mark, not a Fact row. */}
    <section aria-labelledby="org-registration" className="section-dense">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <h2 id="org-registration" className="sr-only">
          Registrazione
        </h2>
        <p className="stamp text-field-dense-foreground/55">Registrata nel registro delle cooperative di Bologna</p>
        <p className="mt-3 font-display text-5xl leading-none md:text-8xl">27 giugno 2022</p>
        <p className="mt-6 max-w-lg text-field-dense-foreground/70">
          Non dal 2010, né dal 2014, né dal 2015. La cooperativa attuale è la quarta organizzazione
          nella storia di questo nome — un&apos;associazione, due società, e infine questa
          cooperativa — oltre alla presenza separata e parallela di Associazione Farm al Parco.
        </p>
      </div>
    </section>

    {/* Who runs what, today — two places, two paragraphs, not two Fact rows. */}
    <section aria-labelledby="org-current" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <h2 id="org-current" className="text-2xl">
          Chi gestisce cosa, oggi
        </h2>
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="stamp text-signal-current">Via Nazario Sauro 24/F</p>
            <p className="mt-3 text-foreground/75">
              Dal 2025, la cooperativa gestisce direttamente il locale, attraverso un affitto
              d&apos;azienda deliberato dal consiglio nel marzo 2025 — il passaggio dell&apos;attività,
              delle attrezzature e del contratto d&apos;affitto da L&apos;Altro Spazio S.r.l.
            </p>
          </div>
          <div>
            <p className="stamp text-signal-current">Parco 11 Settembre</p>
            <p className="mt-3 text-foreground/75">
              La cooperativa partecipa alla programmazione del Parco insieme ad Associazione Farm,
              nell&apos;ambito del patto di collaborazione triennale firmato con il Comune di
              Bologna nel maggio 2025.
            </p>
          </div>
        </div>
        <p className="mt-10 max-w-2xl text-sm text-foreground/70">
          Per contatti istituzionali e amministrativi:{" "}
          <a href={`mailto:${venue.emails.cooperativa}`} className="break-all underline underline-offset-4">
            {venue.emails.cooperativa}
          </a>
          .
        </p>
        <p className="mt-6 max-w-2xl text-sm text-foreground/55">
          Da novembre 2025 la cooperativa ha anche richiesto l&apos;ammissione al mercato
          elettronico della pubblica amministrazione (MePA) in sei categorie di servizio — un
          segnale di direzione istituzionale, non una prova di volumi di attività già svolti in
          quelle categorie.
        </p>
      </div>
    </section>
  </SiteFrame>
);

export default Organisation;
