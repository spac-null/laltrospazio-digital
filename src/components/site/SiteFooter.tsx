import { Link } from "react-router-dom";
import { venue } from "@/lib/content";

const secondaryLinks = [
  { to: "/organizzazione", label: "L'organizzazione" },
  { to: "/storia", label: "Storia" },
  { to: "/ricerca", label: "Ricerca e prove" },
  { to: "/contatti", label: "Contatti" },
];

export const SiteFooter = () => (
  <footer className="section-dense">
    <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
      <p className="max-w-2xl text-sm leading-relaxed text-field-dense-foreground/80">
        L&apos;Altro Spazio è il nome pubblico di una pratica attiva a Bologna dal 2014, condotta
        sotto più organizzazioni nel tempo. Oggi è gestita da Cooperativa L&apos;Altro Spazio.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        <nav aria-label="Navigazione secondaria">
          <p className="stamp text-field-dense-foreground/50">Approfondisci</p>
          <ul className="mt-3 space-y-2">
            {secondaryLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="stamp text-field-dense-foreground/50">Via Nazario Sauro</p>
          <address className="mt-3 space-y-2 text-sm not-italic text-field-dense-foreground/85">
            <p>{venue.address}</p>
            <p>
              <a href="https://wa.me/393517048064" className="underline-offset-4 hover:underline">
                WhatsApp {venue.phone}
              </a>
            </p>
          </address>
        </div>

        <div>
          <p className="stamp text-field-dense-foreground/50">Canali</p>
          <ul className="mt-3 space-y-2 text-sm text-field-dense-foreground/85">
            <li>
              <a href={venue.social_profiles.instagram} className="underline-offset-4 hover:underline">Instagram</a>
            </li>
            <li>
              <a href={venue.social_profiles.facebook} className="underline-offset-4 hover:underline">Facebook</a>
            </li>
            <li>
              <a href={venue.map_profile.url} className="underline-offset-4 hover:underline">Mappa</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);
