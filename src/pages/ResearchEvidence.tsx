import { SiteFrame } from "@/components/site/SiteFrame";

const ResearchEvidence = () => (
  <SiteFrame>
    <section aria-labelledby="research-title" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
        <p className="stamp text-signal-unverified">Ricerca e prove</p>
        <h1 id="research-title" className="mt-3 text-3xl md:text-4xl">Non ancora pubblicata</h1>
        <p className="mt-5 max-w-xl text-foreground/70">
          Quello che diciamo su questo sito si basa su un lavoro di verifica che distingue cosa è
          confermato da cosa non lo è ancora. Renderlo leggibile e citabile pubblicamente non è
          ancora stato pubblicato — per scelta, non per dimenticanza.
        </p>
        <p className="mt-4 max-w-xl text-sm text-foreground/55">
          Se ti interessa una fonte specifica citata altrove sul sito, scrivici: possiamo dirti cosa
          sappiamo, anche se non è ancora qui in forma pubblica.
        </p>
      </div>
    </section>
  </SiteFrame>
);

export default ResearchEvidence;
