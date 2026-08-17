import { SiteFrame } from "@/components/site/SiteFrame";
import { venue } from "@/lib/content";

const Contact = () => (
  <SiteFrame>
    <section aria-labelledby="contact-title" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <p className="stamp text-signal-current">Contatti</p>
        <h1 id="contact-title" className="mt-3 text-3xl md:text-4xl">Scrivici direttamente</h1>

        {/* The actually-fastest channel gets the actual visual priority, not just a claim about it. */}
        <a
          href="https://wa.me/393517048064"
          className="mt-8 inline-flex min-h-11 items-center border border-foreground px-6 text-sm font-medium hover:bg-foreground hover:text-background"
        >
          Scrivici su WhatsApp — {venue.phone}
        </a>
        <p className="mt-3 text-sm text-foreground/60">
          Non promettiamo un tempo di risposta preciso su nessun canale.
        </p>
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
