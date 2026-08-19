import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readContent } from "../scripts/content-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = readContent(root);

/**
 * The only email addresses cleared for publication (owner-confirmed 2026-08-19).
 *
 * The guard below is an allowlist rather than a blocklist, deliberately. Listing the owner's private
 * individual addresses in order to test for their absence would put them in the repository and its
 * history — exactly the thing being prevented. Asserting that *nothing except* these three appears
 * catches those addresses without ever naming them, and also catches any other address that might
 * be added later without approval.
 */
const PUBLISHABLE_ADDRESSES = [
  "cooperativa@altrospazio.org",
  "nazariosauro@altrospazio.org",
  "parco@altrospazio.org",
];

const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
};

const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".css", ".html", ".md", ".txt", ".xml", ".jsonc"]);

test("no email address beyond the three approved ones appears in published source or content", () => {
  const files = [...walk(path.join(root, "src")), ...walk(path.join(root, "content")), ...walk(path.join(root, "public")), path.join(root, "index.html")]
    .filter((file) => TEXT_EXTENSIONS.has(path.extname(file)));

  const found = new Map();
  for (const file of files) {
    for (const match of fs.readFileSync(file, "utf8").matchAll(EMAIL_PATTERN)) {
      const address = match[0].toLowerCase();
      if (!PUBLISHABLE_ADDRESSES.includes(address)) found.set(address, path.relative(root, file));
    }
  }
  const offenders = [...found].map(([address, file]) => `${file}: ${address}`);
  assert.deepEqual(offenders, [], `only owner-approved addresses may be published:\n${offenders.join("\n")}`);
});

test("generated public content exposes exactly the three owner-confirmed organisational addresses", () => {
  assert.deepEqual(Object.keys(content.venue.emails).sort(), ["cooperativa", "nazario", "parco"]);
  assert.equal(content.venue.emails.nazario, "nazariosauro@altrospazio.org");
  assert.equal(content.venue.emails.parco, "parco@altrospazio.org");
  assert.equal(content.venue.emails.cooperativa, "cooperativa@altrospazio.org");
});

test("the general number is declared a WhatsApp channel and never surfaces as a tel: link", () => {
  assert.equal(content.venue.phone, "+39 351 704 8064");
  assert.equal(content.venue.phone_channel, "whatsapp_business");

  const sources = [...walk(path.join(root, "src")), path.join(root, "index.html")].filter((file) =>
    [".ts", ".tsx", ".html"].includes(path.extname(file)),
  );
  const digits = content.venue.phone.replace(/\D/g, "");
  const offenders = sources.filter((file) => {
    const text = fs.readFileSync(file, "utf8");
    return text.includes(`tel:+${digits}`) || text.includes(`tel:${digits}`) || /href=["'{]?tel:/.test(text);
  });
  assert.deepEqual(offenders.map((file) => path.relative(root, file)), [], "no tel: link may be published — neither number is a landline");
});

test("the LIS video contact is a distinct number from the general WhatsApp line", () => {
  assert.equal(content.venue.lis_video_phone, "+39 347 327 6768");
  assert.notEqual(content.venue.lis_video_phone, content.venue.phone);
});

test("the withdrawn menu is absent from public content and from shipped assets", () => {
  assert.equal(content.venue.menu_url, undefined, "menu_url must not be emitted while withdrawn");
  assert.equal(fs.existsSync(path.join(root, "public", "menu-gruppo-nazario.pdf")), false, "the March 2025 price list must not ship");
});

test("Parco 11 Settembre is a seasonal place of the same organisation, active to a confirmed date", () => {
  const parco = content.venue.parco_season;
  assert.equal(parco.name, "Parco 11 Settembre");
  assert.equal(parco.active, true);
  assert.equal(parco.season_end, "2026-10-05");
  // No verified Parco map URL exists yet, and Nazario's must never be reused for it.
  assert.equal(parco.map_url, null);
  assert.notEqual(parco.map_url, content.venue.map_profile.url);
});

test("no unverified opening hours or accessibility claims leak into public content", () => {
  assert.equal(content.venue.regular_hours, undefined);
  assert.equal(content.venue.special_hours, undefined);
  assert.equal(content.venue.accessibility, undefined);
});

test("the published sitemap matches the declared site mode", () => {
  // scripts/content-build.mjs reads SITE_MODE from src/lib/siteMode.ts. This guards that coupling:
  // while the holding page is served every path returns the same content, so advertising the full
  // route list would offer crawlers a set of duplicates.
  const mode = /SITE_MODE:[^=]*=\s*"([a-z_]+)"/.exec(fs.readFileSync(path.join(root, "src", "lib", "siteMode.ts"), "utf8"))?.[1];
  assert.ok(mode === "under_construction" || mode === "full", `unexpected SITE_MODE: ${mode}`);

  const locs = (fs.readFileSync(path.join(root, "public", "sitemap.xml"), "utf8").match(/<loc>/g) ?? []).length;
  if (mode === "under_construction") {
    assert.equal(locs, 1, "under construction: only the homepage may be advertised");
  } else {
    assert.equal(locs, 9, "full site: all nine indexable static routes must be advertised");
  }
});
