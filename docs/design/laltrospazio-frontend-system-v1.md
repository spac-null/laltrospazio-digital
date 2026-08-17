# L'Altro Spazio — Frontend System v1

Status: first production implementation, built and screenshot-reviewed on branch
`feature/frontend-system-v1`. Documents what was actually built, not aspirational rules.

## What this replaces

The legacy `src/pages/Index.tsx` single-page site has been removed. It carried zero design or
factual authority per the greenfield notice in `laltrospazio-current-public-state-v1.md`, and none
of its markup, copy, or visual system survives in this build. `prototypes/creative-direction-v1/`
and `prototypes/page-experience-v1/` remain in the repo as disposable design/content references
(plain HTML/CSS, not wired into `src/`); nothing was copy-pasted from them — every page is genuine
TSX built against the frozen tokens below.

## Typography

Two voices, chosen to avoid the generic "elegant serif + neutral sans" default:

- **Editorial/cultural** — `Fraunces` (variable, soft/wonky optical sizing). Used for all headings.
  Chosen over the previously-loaded Playfair Display specifically because Playfair is the
  calibration-note AI-cliché display face; Fraunces carries more constructed, less "lifestyle
  brand" character.
- **Functional/practical** — `Inter`. Body copy, facts, navigation, buttons.
- **Measure accent** — `IBM Plex Mono`, used only for the `.stamp` utility (status labels, dates,
  eyebrows). Deliberately restricted to short labels, never body text — the brief's own warning
  against "tiny mono metadata everywhere" is a hard constraint, not a suggestion.

## Palette

Cooler/whiter neutral base, warmth supplied by real photography and section-accent color, not by
the base tone (`src/index.css` `:root`, mirrored in `tailwind.config.ts`):

| Token | Role | Value |
|---|---|---|
| `--background` / `--foreground` | Base quiet field | cool near-white / near-black-navy ink |
| `--field-quiet` | Secondary quiet section background | slightly deeper cool gray |
| `--field-dense` / `--field-dense-foreground` | Dense/interrupt sections | dark cool navy / near-white |
| `--signal-current` | Verified / active / current-place signal | dark teal, ≥4.5:1 on white |
| `--signal-notice` | Notice / closure signal | dark muted brick |
| `--signal-unverified` | "Not yet verified" provenance label | muted warm gray-brown, text-only, never a badge |

The original hardcoded brand palette (`#C84B31` terracotta / `#2B2A4C` navy / `#B4A05A` gold /
`#F5EFE7` cream) was replaced outright — it is the exact warm-cream-plus-terracotta combination the
project's own calibration note names as a current AI-generated-design default, and it is also what
the prior creative-direction review (Study 6) rejected for reading as the owner's unpublished book,
not the site.

## Density grammar

Demonstrated concretely on Home, not asserted as a rule: quiet orientation (hero + status) → quiet
30-second bridge → dense field (real construction/plan material, full-bleed image with an
overlapping citation panel, not a matched card grid) → a second, differently-colored dense
interruption (Parco, teal, not dark navy — a distinct place gets a distinct register) → quiet
release (two paths, footer). Visit and Contact stay quiet throughout, by design — they are
decision-bearing, not narrative. History is the other dense demonstration, using a real
chronological sequence (the one page where a dated list is genuinely earned, not decorative).

Two section utilities encode this: `.section-quiet` (`--field-quiet` background) and
`.section-dense` (`--field-dense` background/foreground pair). Everything else is default
`background`/`foreground`.

## Image system

Real material only, sourced from `/Users/stargatesgx/Documents/LAS-Art-Direction-v1/images/`
(external to this repo). Of 15 archive images reviewed, only the 7 with no identifiable people were
copied into `src/assets/real-material/` and used:

1. `1-plan-cutouts-a.jpg`, `2-plan-cutouts-b.jpg` — hand-cut paper over the 2015 floor plan
2. `3-door-studies-sketch.png` — priced ink door studies
3. `4-trolley-pile.jpg` — accumulated fit-out materials
4. `5-construction-doorways.jpg` — the Home dense-section hero, real depth/opening evidence
5. `6-floor-tape-empty-room.jpg` — real floor tape, zero-density evidence
6. `7-elevation-sketch.jpg` — hand-labeled elevation sketch

The remaining 8 images (including the corpus's single strongest "Measure+Encounter" proof image,
a packed communal table under a real geometric wall diagram) contain identifiable faces — one
includes a wheelchair user, which is disability-related personal data under GDPR — and were
deliberately **not** used pending explicit owner clearance. See "Image rights" below.

No current documentary photography exists anywhere in the project (repo or archive) — the existing
`public/uploads/` images are legacy marketing shots or generic staged hospitality photography and
were not used. Home's Parco section and Visit's access-facts sections say so explicitly rather than
using a stand-in stock image or an old marketing photo.

Rule enforced in every page built: an image never gets a fabricated trace. Every dimension line,
piece of tape, or handwritten label on screen is a real photograph of a real mark; nothing was
drawn to look archival.

## Content model wiring

`src/lib/content.ts` gained one addition: `nazarioNotice()`, which resolves the single notice
currently in effect for Via Nazario Sauro (scoped by `venue_id`, expiry-checked against
`activeNotices()`). It never conflates a Via Nazario notice with Parco status — the two places
render independent status blocks everywhere (Home, Visit).

**Data correction made in this session:** `content/notices/temporary-closure-august-2026.json` had
`valid_from: "2026-08-13"`, one day later than the owner-confirmed 12 August 2026 start date
documented in `laltrospazio-current-public-state-v1.md` §2/§11 as a known legacy-record
discrepancy. Corrected to `2026-08-12` and regenerated `src/generated/content.ts` via
`node scripts/content-build.mjs`.

## Components

Built only after real pages proved the repetition (per the brief's own instruction not to start
with a component library):

- `SiteFrame` — skip link + `Navigation` + `main` + `SiteFooter`
- `Navigation` — primary nav, mobile disclosure menu, `aria-current` via `NavLink`
- `SiteFooter` — secondary nav + the one sentence carrying the whole place/organisation
  disambiguation burden, per `laltrospazio-institutional-architecture-v1.md` §7
- `NoticeBanner` — renders any currently-active notice; nothing when none is active, no manual
  cleanup
- `Fact` — a label + a provenance status (`verified` / `not-yet-verified` / `partially-verified` /
  `historical`) + explanation. This is the single mechanism carrying the entire "verified vs. not
  yet verified" discipline — no separate badge system, no icons.
- `ArchiveFigure` — a real photograph with a caption and a real date, always both

## Routes

| Path | Page | Density |
|---|---|---|
| `/` | Home | quiet → dense → dense-interrupt → quiet |
| `/visita` | Visit | quiet throughout |
| `/eventi`, `/eventi/:slug` | What's on (pre-existing, restyled to the frozen tokens) | quiet |
| `/approccio` | Our approach | quiet → dense → quiet |
| `/lavora-con-noi` | Work with us | quiet throughout |
| `/organizzazione` | Organisation | quiet throughout |
| `/storia` | History | quiet → dense (chronology) → quiet |
| `/ricerca` | Research & evidence | quiet — explicitly states the section is deferred, not silently missing |
| `/contatti` | Contact | quiet throughout |

`/ricerca` is built per this task's instruction that all routes must exist even where content is
incomplete, though `laltrospazio-institutional-architecture-v1.md` records that publishing this
section was an owner decision explicitly deferred — the page states its own deferred status rather
than inventing research content to fill it.

## Accessibility

Built in, not bolted on: skip link to `#main`; one landmark per major region (`banner`, `main`,
`contentinfo`, labeled `section`s via `aria-labelledby`); heading hierarchy is h1 once per page then
sequential h2s; every interactive control is ≥44px (`min-h-11`); focus-visible relies on default
browser/Tailwind outline (not suppressed anywhere); `prefers-reduced-motion` is respected globally
in `src/index.css`; no accessibility badge or wheelchair iconography anywhere — access facts render
through the same `Fact` component as every other practical fact.

**Verified this session:** semantic landmark structure (via accessibility-tree snapshot), no
horizontal overflow at 1440/390/320/200px on all 9 routes (one real bug found and fixed at each of
two layers — see below), build and full existing test suite (185/185) still pass after every
change.

**Not verified this session, and this should not be read as passing by omission:** systematic
contrast-ratio measurement against WCAG AA on every color pair (the palette was chosen for AA
headroom but not instrumented), full keyboard-only traversal of every interactive element, and
screen-reader testing with an actual assistive technology. These are the honest gaps.

## Bugs found and fixed during this build

1. **200px reflow overflow (Fact component):** the status label used `flex-shrink: 0`, which forces
   max-content sizing and prevented "Non ancora verificato" from wrapping at 200px, causing
   horizontal overflow on Visit. Fixed by switching the row to `flex-wrap` and removing the
   shrink-0 constraint.
2. **200px reflow overflow (headings):** long unbroken Italian words in display-size headings (e.g.
   "mancavano") don't wrap by default and overflowed the viewport at 200px. Fixed with a global
   `overflow-wrap: break-word` on all headings in `src/index.css`.

Both were caught by measuring `scrollWidth` vs. `clientWidth` programmatically across all 9 routes
at 200px, not by visual inspection alone — visual inspection at 1440/390 had missed both.

## Known factual blockers (do not resolve by inventing content)

- No verified regular opening hours for Via Nazario Sauro exist anywhere in the evidence base.
- No physical/sensory access facts are verified for either Via Nazario Sauro or Parco 11 Settembre.
- Parco 2026 season end date is not yet verified.
- Current legal representative of the cooperative is not stated (unresolved source conflict).
- 8 of the 15 real-material archive images need explicit owner clearance (identifiable people,
  including one wheelchair user) before any public production use.
- No current documentary photography (present-day interior/exterior/activity) exists for either
  place.

## Explicitly rejected during this build

Hero+four-cards+CTA+footer as Home's structure; a uniform image-card grid for the construction
material (replaced with full-bleed + citation panel); a boolean "accessible" badge; disability
iconography; numbered-step markers on non-sequential content (History's dated list is the one
legitimate exception); any fabricated tape/marker/blueprint graphic; hours or workforce percentages
without owner confirmation; describing any historical venue without its closure date in the same
view.
