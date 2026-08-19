import { ArchiveFigure } from "@/components/site/ArchiveFigure";
import { SiteFrame } from "@/components/site/SiteFrame";
import cenaAlBuio from "@/assets/real-material/20-cena-al-buio-graphic.jpg";
import rainCollapsedTent from "@/assets/real-material/22-rain-collapsed-tent-2018.jpg";

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

    {/* The page says the verification work is not yet citable. Rather than leave it a text stub, it
        now shows two things that genuinely are in the archive: one artefact that was published, and
        one plain record of an operating condition. Both dated, neither presented as a conclusion. */}
    <section aria-labelledby="research-material" className="section-quiet">
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
        <h2 id="research-material" className="max-w-xl text-2xl">Che tipo di materiale esiste</h2>
        <p className="mt-4 max-w-xl text-foreground/70">
          Due esempi, per dare un&apos;idea concreta: materiale pubblicato all&apos;epoca, e
          registrazioni ordinarie di come lo spazio si comportava davvero.
        </p>

        <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-12 md:items-start md:gap-10">
          <ArchiveFigure
            src={cenaAlBuio}
            alt="Grafica promozionale con una forchetta, un coltello e una bocca colorata, e la frase turn off the lights, turn on your senses"
            caption="Materiale promozionale di Cena al Buio. È la comunicazione dell'epoca, non la documentazione di come funzionava la serata."
            aspect="wide"
            tone="quiet"
            className="md:col-span-7"
          />
          <ArchiveFigure
            src={rainCollapsedTent}
            alt="Vista dalla finestra di servizio sotto la pioggia: tavoli da picnic all'aperto e una struttura a tenda piegata dal vento"
            caption="Come si comportava lo spazio esterno con il maltempo"
            date="luglio 2018"
            aspect="portrait"
            tone="quiet"
            className="md:col-span-4 md:col-start-9 md:mt-12"
          />
        </div>
      </div>
    </section>
  </SiteFrame>
);

export default ResearchEvidence;
