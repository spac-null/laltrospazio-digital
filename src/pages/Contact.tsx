import { SiteFrame } from "@/components/site/SiteFrame";
import { venue } from "@/lib/content";

const Contact = () => (
  <SiteFrame>
    <section aria-labelledby="contact-title" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">Contatti</p>
        <h1 id="contact-title" className="mt-3 text-3xl md:text-4xl">Scrivici direttamente</h1>
      </div>
    </section>

    <section aria-labelledby="contact-channels" className="section-quiet">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-16">
        <h2 id="contact-channels" className="sr-only">Canali</h2>
        <dl className="space-y-8">
          <div>
            <dt className="stamp text-foreground/50">WhatsApp — il più diretto</dt>
            <dd className="mt-1">
              <a href="https://wa.me/393517048064" className="text-lg underline underline-offset-4">
                {venue.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="stamp text-foreground/50">Indirizzo</dt>
            <dd className="mt-1 text-lg">{venue.address}</dd>
          </div>
          <div>
            <dt className="stamp text-foreground/50">Instagram</dt>
            <dd className="mt-1">
              <a href={venue.social_profiles.instagram} className="text-lg underline underline-offset-4">
                @laltrospazio
              </a>
            </dd>
          </div>
          <div>
            <dt className="stamp text-foreground/50">Facebook</dt>
            <dd className="mt-1">
              <a href={venue.social_profiles.facebook} className="text-lg underline underline-offset-4">
                L&apos;Altro Spazio
              </a>
            </dd>
          </div>
        </dl>
        <p className="mt-10 max-w-xl text-sm text-foreground/60">
          Non promettiamo un tempo di risposta preciso su nessun canale. WhatsApp è quello che
          controlliamo più spesso.
        </p>
      </div>
    </section>
  </SiteFrame>
);

export default Contact;
