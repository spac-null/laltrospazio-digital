import { SiteFrame } from "@/components/site/SiteFrame";
import { venue, whatsappUrl } from "@/lib/content";

const Contact = () => (
  <SiteFrame>
    <section aria-labelledby="contact-title" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">Contatti</p>
        <h1 id="contact-title" className="mt-3 text-3xl md:text-4xl">Scrivici direttamente</h1>

        {/* The actually-fastest channel gets the actual visual priority, not just a claim about it. */}
        <a
          href={whatsappUrl(venue.phone)}
          className="mt-8 inline-flex min-h-11 items-center border border-foreground px-6 text-sm font-medium hover:bg-foreground hover:text-background"
        >
          Scrivici o chiamaci su WhatsApp — {venue.phone}
        </a>
        <p className="mt-3 text-sm text-foreground/60">
          È un numero WhatsApp: ci arrivano i messaggi e le chiamate fatte da WhatsApp. Non
          promettiamo un tempo di risposta preciso su nessun canale.
        </p>

        {/* Separate contact, separate purpose — never folded into the general number above. */}
        <div className="mt-8 border-t border-border pt-6">
          <p className="stamp text-signal-current">Videochiamata LIS</p>
          <p className="mt-2 text-sm text-foreground/85">
            <span className="whitespace-nowrap">{venue.lis_video_phone}</span> — un contatto
            dedicato, diverso dal numero qui sopra. Funziona in videochiamata con FaceTime o con
            WhatsApp.
          </p>
          <a
            href={whatsappUrl(venue.lis_video_phone)}
            className="mt-2 inline-block text-sm underline underline-offset-4"
          >
            Apri la chat WhatsApp per la LIS
          </a>
        </div>
      </div>
    </section>

    <section aria-labelledby="contact-channels" className="section-quiet">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="contact-channels" className="sr-only">Altri canali</h2>
        <dl className="grid gap-8 sm:grid-cols-3">
          <div>
            <dt className="stamp text-foreground/50">Indirizzo</dt>
            <dd className="mt-1 text-sm text-foreground/85">{venue.address}</dd>
          </div>
          <div>
            <dt className="stamp text-foreground/50">Via Nazario Sauro</dt>
            <dd className="mt-1">
              <a href={`mailto:${venue.emails.nazario}`} className="break-all text-sm underline underline-offset-4">
                {venue.emails.nazario}
              </a>
            </dd>
          </div>
          <div>
            <dt className="stamp text-foreground/50">Parco 11 Settembre</dt>
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
          <div>
            <dt className="stamp text-foreground/50">Instagram</dt>
            <dd className="mt-1">
              <a href={venue.social_profiles.instagram} className="text-sm underline underline-offset-4">
                @laltrospazio
              </a>
            </dd>
          </div>
          <div>
            <dt className="stamp text-foreground/50">Facebook</dt>
            <dd className="mt-1">
              <a href={venue.social_profiles.facebook} className="text-sm underline underline-offset-4">
                L&apos;Altro Spazio
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  </SiteFrame>
);

export default Contact;
