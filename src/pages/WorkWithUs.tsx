import { SiteFrame } from "@/components/site/SiteFrame";
import { venue, whatsappUrl } from "@/lib/content";

const WorkWithUs = () => (
  <SiteFrame>
    <header className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">Lavora con noi</p>
        <h1 className="mt-3 text-3xl md:text-4xl">Il tipo di lavoro che sosteniamo</h1>
        <p className="mt-5 text-foreground/70">
          Non abbiamo un catalogo di servizi fissi. Quello che segue sono tre modi in cui la
          pratica di L&apos;Altro Spazio si è già tradotta in collaborazione — con l&apos;evidenza
          concreta dietro ciascuno.
        </p>
      </div>
    </header>

    {/* The strongest evidence — a delivered project — gets the most weight. */}
    <section aria-labelledby="work-culture" className="section-dense">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <h2 id="work-culture" className="text-2xl md:text-3xl">
          Programmazione culturale in spazi pubblici
        </h2>
        <p className="mt-4 max-w-xl text-field-dense-foreground/75">
          Portiamo concerti, arte e attività di lettura dentro uno spazio pubblico condiviso con
          un&apos;amministrazione comunale, non solo dentro il nostro locale.
        </p>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="stamp text-field-dense-foreground/50">Evidenza</dt>
            <dd className="mt-1 text-sm text-field-dense-foreground/85">
              Cultura Verde, Parco 11 Settembre
            </dd>
          </div>
          <div>
            <dt className="stamp text-field-dense-foreground/50">Contributo</dt>
            <dd className="mt-1 text-lg">€8.000 (2024)</dd>
          </div>
          <div>
            <dt className="stamp text-field-dense-foreground/50">Erogato</dt>
            <dd className="mt-1 text-lg">2025</dd>
          </div>
        </dl>
      </div>
    </section>

    {/* Two lighter, quieter capabilities — proposed, not yet delivered in this form. */}
    <section aria-labelledby="work-other" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <h2 id="work-other" className="sr-only">
          Altri due modi in cui lavoriamo
        </h2>

        <div className="space-y-12">
          <div>
            <h3 className="text-xl">Formati di ospitalità pensati per essere adattati</h3>
            <p className="mt-3 text-foreground/75">
              Cena al Buio è nato per il pubblico del nostro locale, ma la sua logica — invertire
              chi guida l&apos;esperienza — si presta a essere proposta anche fuori, per gruppi e
              aziende.
            </p>
            <p className="mt-2 text-sm text-foreground/55">
              Evidenza: una proposta commerciale B2B del dicembre 2025, con modulo formativo
              opzionale — non riconfermata di recente nella stessa forma.
            </p>
          </div>

          <div>
            <h3 className="text-xl">Formazione ed encounter LIS con istituzioni pubbliche</h3>
            <p className="mt-3 text-foreground/75">
              Portare la lingua dei segni e l&apos;incontro guidato da persone sorde dentro scuole
              e servizi pubblici è un lavoro che stiamo proponendo attivamente a livello regionale.
            </p>
            <p className="mt-2 text-sm text-foreground/55">
              Evidenza: candidatura SEGNI DI PACE presentata a Regione Emilia-Romagna nel marzo
              2026 (budget €18.000) — presentazione confermata, esito non ancora.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section aria-labelledby="work-start" className="section-quiet">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="work-start" className="text-2xl">Come iniziare</h2>
        <p className="mt-4 text-foreground/75">
          Scrivici direttamente, dicendo cosa hai in mente. Non c&apos;è un modulo da compilare.
        </p>
        <a
          href={whatsappUrl(venue.phone)}
          className="mt-6 inline-flex min-h-11 items-center border border-foreground px-6 text-sm font-medium hover:bg-foreground hover:text-background"
        >
          Scrivici o chiamaci su WhatsApp — {venue.phone}
        </a>
        <p className="mt-4 text-sm text-foreground/70">
          Per proposte istituzionali o amministrative puoi scrivere a{" "}
          <a href={`mailto:${venue.emails.cooperativa}`} className="break-all underline underline-offset-4">
            {venue.emails.cooperativa}
          </a>
          .
        </p>
      </div>
    </section>
  </SiteFrame>
);

export default WorkWithUs;
