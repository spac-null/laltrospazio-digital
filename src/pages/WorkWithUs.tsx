import { SiteFrame } from "@/components/site/SiteFrame";
import { venue } from "@/lib/content";

const WorkWithUs = () => (
  <SiteFrame>
    <header className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">Lavora con noi</p>
        <h1 className="mt-3 text-3xl md:text-4xl">Cosa sosteniamo, con quali prove</h1>
        <p className="mt-5 text-foreground/70">
          Non abbiamo un catalogo di servizi. Quello che segue è ciò che possiamo mostrare con
          prove concrete oggi — un progetto consegnato, e due proposte che non lo sono ancora.
        </p>
      </div>
    </header>

    {/* Delivered — the one thing with real weight behind it. Dense, specific, in numbers. */}
    <section aria-labelledby="work-delivered" className="section-dense">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-field-dense-foreground/55">Consegnato</p>
        <h2 id="work-delivered" className="mt-2 text-2xl md:text-3xl">
          Cultura Verde — Parco 11 Settembre
        </h2>
        <p className="mt-4 max-w-xl text-field-dense-foreground/75">
          Contributo del Quartiere Porto-Saragozza per concerti, arte e lettura al Parco.
        </p>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="stamp text-field-dense-foreground/50">Anno</dt>
            <dd className="mt-1 text-lg">2024</dd>
          </div>
          <div>
            <dt className="stamp text-field-dense-foreground/50">Contributo</dt>
            <dd className="mt-1 text-lg">€8.000</dd>
          </div>
          <div>
            <dt className="stamp text-field-dense-foreground/50">Erogato</dt>
            <dd className="mt-1 text-lg">2025</dd>
          </div>
        </dl>
      </div>
    </section>

    {/* Proposed — lighter, quieter, explicitly unresolved. Two distinct stories, not two rows. */}
    <section aria-labelledby="work-proposed" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <h2 id="work-proposed" className="text-2xl">
          Candidato, non ancora consegnato
        </h2>

        <div className="mt-8 space-y-10">
          <div>
            <p className="stamp text-signal-unverified">SEGNI DI PACE — presentazione confermata, esito non ancora</p>
            <p className="mt-3 text-foreground/75">
              Candidatura presentata a Regione Emilia-Romagna nel marzo 2026 (budget €18.000), per
              portare la LIS e l&apos;incontro guidato da persone sorde in scuole e servizi
              pubblici. La presentazione è confermata; l&apos;esito e la realizzazione non lo sono
              ancora.
            </p>
          </div>

          <div>
            <p className="stamp text-signal-unverified">Cena al Buio — formato B2B, non riconfermato di recente</p>
            <p className="mt-3 text-foreground/75">
              Una proposta commerciale del dicembre 2025 sviluppa Cena al Buio in un formato per
              aziende, con un modulo formativo opzionale. Non abbiamo una conferma recente che
              l&apos;offerta sia ancora attiva nella stessa forma: scrivici per verificarlo insieme.
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
          href="https://wa.me/393517048064"
          className="mt-6 inline-flex min-h-11 items-center border border-foreground px-6 text-sm font-medium hover:bg-foreground hover:text-background"
        >
          Scrivici su WhatsApp — {venue.phone}
        </a>
      </div>
    </section>
  </SiteFrame>
);

export default WorkWithUs;
