import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { findEvent, venue } from "@/lib/content";
import { isUnderConstruction } from "@/lib/siteMode";

const SITE_NAME = "L'Altro Spazio";

/**
 * Production origin. Taken from venue.website rather than hardcoded here: in content/venue.json
 * that field carries status "verified" and authority_level "canonical", so it is the project's own
 * established origin, not a hostname invented by this module.
 */
const ORIGIN = venue.website.replace(/\/$/, "");

/**
 * Static routes, keyed exactly as declared in src/App.tsx. Labels are the ones the primary and
 * secondary navigation already use, so titles match the site's existing information architecture
 * rather than introducing new naming.
 */
const routeLabels: Record<string, string> = {
  "/": SITE_NAME,
  "/visita": "Visita",
  "/eventi": "Cosa c'è",
  "/approccio": "Il nostro approccio",
  "/lavora-con-noi": "Lavora con noi",
  "/organizzazione": "L'organizzazione",
  "/storia": "Storia",
  "/ricerca": "Ricerca e prove",
  "/contatti": "Contatti",
};

const eventSlugOf = (pathname: string) => pathname.match(/^\/eventi\/([^/]+)$/)?.[1];

const titleFor = (pathname: string) => {
  // Every path serves the same holding page, so it gets one title rather than a route-specific one.
  if (isUnderConstruction) return `Sito in costruzione — ${SITE_NAME}`;

  const label = routeLabels[pathname];
  if (label) return label === SITE_NAME ? SITE_NAME : `${label} — ${SITE_NAME}`;

  const slug = eventSlugOf(pathname);
  if (slug) {
    const event = findEvent(slug);
    return `${event ? event.title : "Evento non trovato"} — ${SITE_NAME}`;
  }

  return `Pagina non trovata — ${SITE_NAME}`;
};

/**
 * Only routes that genuinely exist get a canonical URL. An unknown path or an unknown event slug
 * returns null so no canonical is published for a page that is really a 404.
 */
const canonicalFor = (pathname: string) => {
  // One page of content behind every path: canonicalise all of them to the homepage so crawlers
  // consolidate instead of seeing a set of duplicates.
  if (isUnderConstruction) return `${ORIGIN}/`;

  if (routeLabels[pathname]) return `${ORIGIN}${pathname}`;

  const slug = eventSlugOf(pathname);
  if (slug && findEvent(slug)) return `${ORIGIN}/eventi/${slug}`;

  return null;
};

/**
 * Sets the document title and canonical link for the current route. Mounted once inside the
 * router; pages need no per-page metadata code.
 */
export const RouteMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titleFor(pathname);

    const href = canonicalFor(pathname);
    const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!href) {
      existing?.remove();
      return;
    }

    const link = existing ?? document.head.appendChild(Object.assign(document.createElement("link"), { rel: "canonical" }));
    link.href = href;
  }, [pathname]);

  return null;
};
