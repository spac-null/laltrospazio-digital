import { formatItalianDate, nazarioNotice, venue, whatsappUrl } from "@/lib/content";
import entranceRamp from "@/assets/real-material/08-entrance-ramp-2023.jpg";
import quietInterior from "@/assets/real-material/09-quiet-interior-piano-2023.jpg";
import mezzanineFresco from "@/assets/real-material/10-mezzanine-fresco-2023.jpg";
import parcoTents from "@/assets/real-material/11-parco-tents-2023.jpg";

const formatReopen = (value: string) =>
  new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Rome" }).format(
    new Date(`${value}T12:00:00`),
  );

/**
 * Holding page served on every route while the full site is finished.
 *
 * Deliberately short: the images carry the place and the text only does what a visitor needs. Two
 * things it must still get right, because they are true however brief the page is — the closure comes
 * from the same notices data and expires by itself, and the LIS contact stays visibly separate from
 * the general number.
 *
 * It publishes no opening hours and no access conditions. Note it does not describe them as
 * unconfirmed either: internal wording about what has or has not been checked is not for visitors,
 * so the page simply invites them to ask instead.
 */
const UnderConstruction = () => {
  const notice = nazarioNotice();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 md:px-10">
          <p className="font-display text-lg tracking-tight">L&apos;Altro Spazio</p>
          <p className="stamp text-foreground/45">Bologna</p>
        </div>
      </header>

      <main>
        <section aria-labelledby="uc-title" className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
            <p className="stamp text-signal-current">Sito in costruzione</p>
            <h1 id="uc-title" className="mt-3 text-3xl md:text-4xl">
              Stiamo rifacendo questo sito
            </h1>
            <p className="mt-4 max-w-lg text-foreground/70">
              Torniamo presto. Nel frattempo, qui c&apos;è l&apos;essenziale.
            </p>
          </div>
        </section>

        {/* Both places together: Via Nazario Sauro's closure alone would read as "we are closed",
            when the Parco is open. */}
        <section aria-labelledby="uc-state" className="border-b border-border section-quiet">
          <div className="mx-auto max-w-3xl px-6 py-10 md:px-10 md:py-14">
            <h2 id="uc-state" className="sr-only">I due luoghi, adesso</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-border bg-background p-5">
                <p className="stamp text-signal-notice">
                  {notice ? "Temporaneamente chiuso" : "Via Nazario Sauro"}
                </p>
                <p className="mt-2 text-sm font-medium">Via Nazario Sauro 24/F</p>
                {notice ? (
                  <p className="mt-1 text-sm text-foreground/70">
                    Riapertura prevista: {formatReopen(notice.reopening_date)}.
                  </p>
                ) : null}
                <p className="mt-2 text-sm text-foreground/60">{venue.address}</p>
              </div>

              <div className="border border-border bg-background p-5">
                <p className="stamp text-signal-current">Attivo ora</p>
                <p className="mt-2 text-sm font-medium">Parco 11 Settembre</p>
                <p className="mt-1 text-sm text-foreground/70">
                  Programmazione estiva in corso fino al{" "}
                  {formatItalianDate(venue.parco_season.season_end)}.
                </p>
                <p className="mt-2 text-sm text-foreground/60">Date e orari sui canali social.</p>
              </div>
            </div>

            <p className="mt-5 text-sm text-foreground/65">
              Scrivici prima di venire: ti diciamo orari e accesso.
            </p>
          </div>
        </section>

        {/* The place itself, from the street inwards. Unequal fields, every frame dated. */}
        <section aria-labelledby="uc-place" className="border-b border-border">
          <h2 id="uc-place" className="sr-only">Il locale di Via Nazario Sauro</h2>

          <figure>
            <img
              src={entranceRamp}
              alt="Ingresso di Via Nazario Sauro 24/F visto dalla strada: due vetrine con la scritta L'Altro Spazio, porta a vetri centrale, pedana e ringhiera davanti all'ingresso"
              loading="lazy"
              className="h-[52vw] max-h-[460px] min-h-[200px] w-full object-cover object-[center_70%]"
            />
            <figcaption className="mx-auto max-w-3xl px-6 pt-2 text-xs text-foreground/55 md:px-10">
              Via Nazario Sauro 24/F — settembre 2023
            </figcaption>
          </figure>

          <div className="mx-auto max-w-3xl px-6 pb-10 pt-8 md:px-10 md:pb-14">
            <div className="grid gap-8 md:grid-cols-12 md:items-start md:gap-10">
              <figure className="md:col-span-5">
                <img
                  src={quietInterior}
                  alt="Interno vicino all'ingresso: un pianoforte verticale con piante sopra, tavolini rotondi in legno con sgabelli, un murale sul muro e la strada visibile dalla vetrata alta"
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />
                <figcaption className="mt-2 text-xs text-foreground/55">Dentro — settembre 2023</figcaption>
              </figure>

              <figure className="md:col-span-7 md:mt-14">
                <img
                  src={mezzanineFresco}
                  alt="Soffitto del soppalco con affresco a motivi circensi e un medaglione, illuminato di viola, con piante appese alla struttura metallica"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption className="mt-2 text-xs text-foreground/55">
                  Il soppalco affrescato — settembre 2023
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section aria-labelledby="uc-contact" className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-10 md:px-10 md:py-14">
            <h2 id="uc-contact" className="text-2xl">Scrivici</h2>

            <a
              href={whatsappUrl(venue.phone)}
              className="mt-5 inline-flex min-h-11 items-center border border-foreground px-6 text-sm font-medium hover:bg-foreground hover:text-background"
            >
              WhatsApp — {venue.phone}
            </a>
            <p className="mt-2 text-sm text-foreground/60">Messaggi e chiamate da WhatsApp.</p>

            {/* A separate contact with a separate purpose — never folded into the number above. */}
            <div className="mt-7 border-t border-border pt-5">
              <p className="stamp text-signal-current">Videochiamata LIS</p>
              <p className="mt-2 text-sm text-foreground/85">
                <span className="whitespace-nowrap">{venue.lis_video_phone}</span> — contatto dedicato,
                diverso dal numero qui sopra. FaceTime o WhatsApp.{" "}
                <a href={whatsappUrl(venue.lis_video_phone)} className="underline underline-offset-4">
                  Apri la chat
                </a>
              </p>
            </div>

            <dl className="mt-7 grid gap-5 border-t border-border pt-5 sm:grid-cols-3">
              <div>
                <dt className="stamp text-foreground/50">Nazario</dt>
                <dd className="mt-1">
                  <a href={`mailto:${venue.emails.nazario}`} className="break-all text-sm underline underline-offset-4">
                    {venue.emails.nazario}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="stamp text-foreground/50">Parco</dt>
                <dd className="mt-1">
                  <a href={`mailto:${venue.emails.parco}`} className="break-all text-sm underline underline-offset-4">
                    {venue.emails.parco}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="stamp text-foreground/50">Cooperativa</dt>
                <dd className="mt-1">
                  <a href={`mailto:${venue.emails.cooperativa}`} className="break-all text-sm underline underline-offset-4">
                    {venue.emails.cooperativa}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* The second place — and currently the open one, so it gets a field of its own. */}
        <section aria-labelledby="uc-parco" className="section-dense">
          <figure>
            <img
              src={parcoTents}
              alt="Quattro tende ad arco chiare montate sull'erba del Parco 11 Settembre al crepuscolo, luci a filo tra gli alberi e un muro di pietra antico dietro"
              loading="lazy"
              className="h-[38vw] max-h-[400px] min-h-[190px] w-full object-cover"
            />
            <figcaption className="mx-auto max-w-3xl px-6 pt-2 text-xs text-field-dense-foreground/55 md:px-10">
              Parco 11 Settembre — aprile 2023
            </figcaption>
          </figure>
          <div className="mx-auto max-w-3xl px-6 py-10 md:px-10 md:py-14">
            <p className="stamp text-signal-current-foreground/60">Parco 11 Settembre</p>
            <h2 id="uc-parco" className="mt-3 text-2xl">L&apos;altro luogo, aperto adesso</h2>
            <p className="mt-4 max-w-lg text-field-dense-foreground/80">
              Programmazione culturale estiva in corso fino al{" "}
              {formatItalianDate(venue.parco_season.season_end)}. È un luogo distinto da Via Nazario
              Sauro, con date e orari propri.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-8 md:px-10 md:py-10">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <li>
              <a href={venue.social_profiles.instagram} className="underline-offset-4 hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a href={venue.social_profiles.facebook} className="underline-offset-4 hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href={venue.map_profile.url} className="underline-offset-4 hover:underline">
                Mappa
              </a>
            </li>
          </ul>
          <p className="mt-5 text-xs text-foreground/50">Cooperativa L&apos;Altro Spazio, Bologna</p>
        </div>
      </footer>
    </div>
  );
};

export default UnderConstruction;
