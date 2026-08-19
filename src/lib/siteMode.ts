/**
 * Which version of the site is served.
 *
 * "under_construction" — every route renders src/pages/UnderConstruction.tsx: a single holding page
 * carrying the venue's current operating state and contact details while the full site is finished.
 * "full" — the complete multi-route site.
 *
 * Restoring the full site is this one word. Nothing else needs changing, and no route, component or
 * content file is removed or disabled to hold the site: the whole site stays in the build and simply
 * is not routed to.
 */
export const SITE_MODE: "under_construction" | "full" = "under_construction";

export const isUnderConstruction = SITE_MODE === "under_construction";
