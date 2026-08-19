import { Link } from "react-router-dom";
import { SiteFrame } from "@/components/site/SiteFrame";

/**
 * Renders inside SiteFrame so a mistyped URL keeps the normal navigation, footer, skip link and
 * <main> landmark — matching the not-found branch of EventDetail rather than introducing a
 * separate bare page.
 */
const NotFound = () => (
  <SiteFrame>
    <div className="mx-auto max-w-3xl px-6 py-20 md:px-10">
      <p className="stamp text-signal-current">Errore 404</p>
      <h1 className="mt-3 text-3xl">Pagina non trovata</h1>
      <p className="mt-4 text-foreground/75">
        L&apos;indirizzo che hai aperto non esiste o è stato spostato.
      </p>
      <Link className="mt-6 inline-block text-sm underline underline-offset-4" to="/">
        Torna alla home
      </Link>
    </div>
  </SiteFrame>
);

export default NotFound;
