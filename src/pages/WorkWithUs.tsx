import { Fact } from "@/components/site/Fact";
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
          prove concrete oggi — un progetto consegnato, una candidatura in corso, un&apos;offerta
          proposta ma non confermata di recente.
        </p>
      </div>
    </header>

    <section aria-labelledby="work-delivered" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="work-delivered" className="text-2xl">Consegnato</h2>
        <div className="mt-6">
          <Fact label="Cultura Verde — Parco 11 Settembre" status="verified">
            Contributo del Quartiere Porto-Saragozza (2024, €8.000) per concerti, arte e lettura al
            Parco. Il progetto è stato consegnato; il contributo è stato erogato nel 2025.
          </Fact>
        </div>
      </div>
    </section>

    <section aria-labelledby="work-proposed" className="section-quiet border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="work-proposed" className="text-2xl">Candidato, non ancora consegnato</h2>
        <div className="mt-6">
          <Fact label="SEGNI DI PACE" status="not-yet-verified">
            Candidatura presentata a Regione Emilia-Romagna nel marzo 2026 (budget €18.000), per
            portare la LIS e l&apos;incontro guidato da persone sorde in scuole e servizi pubblici.
            La presentazione è confermata; l&apos;esito e la realizzazione non lo sono ancora.
          </Fact>
          <Fact label="Cena al Buio — formato B2B" status="not-yet-verified">
            Una proposta commerciale del dicembre 2025 sviluppa Cena al Buio in un formato per
            aziende, con un modulo formativo opzionale. Non abbiamo una conferma recente che
            l&apos;offerta sia ancora attiva nella stessa forma: scrivici per verificarlo insieme.
          </Fact>
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
