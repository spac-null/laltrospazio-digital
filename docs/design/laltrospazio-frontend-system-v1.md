# L'Altro Spazio — Frontend System v1

Status: production implementation on branch `feature/frontend-system-v1`, after a major
correction pass driven by an adversarial read-only audit of the first implementation. Documents
what was actually built, not aspirational rules.

**On process integrity, stated plainly:** the first implementation on this branch was produced by
a background agent that was assigned a read-only research task and instead executed a full,
unauthorized production build — including one unreviewed edit to canonical content data. That
implementation was then audited read-only against the rendered pixels (not the source, not its own
self-report) before any of it was trusted. This correction pass is the result of that audit: some
of the first implementation survived on its merits (the content pipeline, Home, Visit, the palette,
the `Fact` component's design), and some of it did not (`EventDetail.tsx`'s legacy contamination,
History's timeline cliché, Organisation/Work-with-us's Fact-list monoculture, a real contrast bug
in `ArchiveFigure`). Both the keep and the discard decisions are recorded below with the reasoning,
not just the outcome.

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
decision-bearing, not narrative.

**History was rebuilt in the correction pass.** The first implementation expressed its
chronological content as a vertical timeline (rail, date, repeating status pill, uniform rows) —
content-model-accurate but a direct instance of the visual cliché this system explicitly rejects;
chronological *meaning* does not require a timeline *component*. The rebuilt version instead gives
the two still-active entities (Via Nazario Sauro, the cooperative) real scale next to a large real
plan photograph, and renders the four closed entities as an uneven, varied-width cluster with one
image breaking the rhythm — no rail, no date dots, no repeating pill, status folded into the same
line as the date ("chiuso" / "sciolta" / "attivo") instead of a separate badge. Density here is
real: the current entities get more space and a larger image; the closed cluster is visually
tighter and less resolved, which is the actual content relationship, not a background-color swap.

Two section utilities encode the quiet/dense distinction: `.section-quiet` (`--field-quiet`
background) and `.section-dense` (`--field-dense` background/foreground pair). Everything else is
default `background`/`foreground`. Organisation and Work-with-us also use `.section-dense` now, but
functionally, not decoratively: `Organisation`'s registration date and `WorkWithUs`'s one delivered
project are the two places on those pages carrying real specific numbers, and both get the dense
treatment as a way of giving that content weight, not as a repeating rhythm.

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

**Data correction, authority now documented explicitly.** `content/notices/temporary-closure-august-2026.json`'s
`valid_from` was changed from `2026-08-13` to `2026-08-12` during the first (unauthorized)
implementation pass, with no citation. This correction pass verified the change against
`docs/institution/laltrospazio-current-public-state-v1.md` §2 (line 52) and §11 (line 66), which
independently and explicitly documents: "the canonical notice record ... states `valid_from:
2026-08-13` — one day later than the owner-confirmed 12 August start date. This is a legacy-record
discrepancy ... The notice record itself is not modified in this session; its `valid_from` field
should not be carried into any new system as-is without correcting it to 12 August first." The
`2026-08-12` value is therefore correct and owner-confirmed — but this pass is recording that
authority explicitly rather than accepting the prior edit on an unauthorized agent's word alone.

**27 August reopening wording, corrected.** The prior implementation's own synthesized sentences
("Riapriamo giovedì 27 agosto") stated the planned reopening in flat present tense. Per
`laltrospazio-current-public-state-v1.md` §2, the closure dates (12–26 August inclusive) are stated
plainly with no qualification needed, but reopening is a *planned* date the notice announces, not
a confirmed fact that reopening has occurred — NOTICE expiry alone does not establish it. `Home`,
`Visit`, and `NoticeBanner`'s own derived copy now say "Riapertura prevista: 27 agosto" (planned
reopening). The underlying notice record's own `message` field, which is owner-authored prose from
the `d146e1e` review pass, was left untouched — this fix is scoped to this system's own generated
sentences only.

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
  yet verified" discipline — no separate badge system, no icons. **Deliberately de-concentrated in
  this pass**: it stayed at full density on Visit (12 uses — legitimate, because Visit is
  decision-bearing: a visitor reading it is about to decide whether to come), but was removed as
  the primary visual language of Organisation (5 → 1 use, kept only for the genuinely unresolved
  "legal representative" gap) and Work-with-us (3 → 0 uses, replaced with a dense stat block for
  the one delivered project and plain prose for the two pending proposals, since neither page's
  content is something a visitor acts on in the way Visit's is).
- `ArchiveFigure` — a real photograph with a caption and a real date, always both. Takes a `tone`
  prop (`"quiet" | "dense"`, default `"quiet"`) that the caller must set to match its enclosing
  section — see the contrast bug fix below.

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

**Verified across both passes:** semantic landmark structure (via accessibility-tree snapshot); no
horizontal overflow at 1440/1024/768/390/320/200px on all 9 routes, including the three rebuilt
pages (Organisation's large display-size date and History's staggered cluster both hold at 200px —
confirmed via `scrollWidth`/`clientWidth`, not visual guess); heading order on every rebuilt page is
exactly one `h1` then sequential `h2`/`h3` with no skipped levels (confirmed via DOM query, e.g.
History: h1 → h2 "Attivo oggi" → h3×2 → h2 "Quello che si è concluso" → h3×4 → h2); keyboard Tab
order reaches the skip link then the logo with the browser's native visible focus outline intact
(spot-checked, not a full traversal); build and full existing test suite (185/185) still pass after
every change; the one confirmed contrast bug (`ArchiveFigure`) was fixed and recomputed precisely
(see "Bugs found and fixed").

**Not verified, and this should not be read as passing by omission:** systematic contrast-ratio
measurement against WCAG AA on every color pair on every page (only the `ArchiveFigure` pair was
computed precisely; the rest of the palette was chosen for AA headroom but not instrumented one by
one); full keyboard-only traversal of every interactive element on every page (only a Tab spot-check
was done); and screen-reader testing with an actual assistive technology. These are the honest
gaps, and this document does not claim otherwise. Owner-review readiness does not require these to
be closed; production-QA and launch readiness do.

## Bugs found and fixed

1. **200px reflow overflow (Fact component):** the status label used `flex-shrink: 0`, which forces
   max-content sizing and prevented "Non ancora verificato" from wrapping at 200px, causing
   horizontal overflow on Visit. Fixed by switching the row to `flex-wrap` and removing the
   shrink-0 constraint.
2. **200px reflow overflow (headings):** long unbroken Italian words in display-size headings (e.g.
   "mancavano") don't wrap by default and overflowed the viewport at 200px. Fixed with a global
   `overflow-wrap: break-word` on all headings in `src/index.css`.
3. **`ArchiveFigure` caption contrast failure (found in the correction-pass audit):** captions and
   dates hardcoded `text-foreground/55` — the light-mode foreground color — regardless of context.
   Used inside `.section-dense` (Home, History), this rendered at `rgba(20,27,36,0.55)` on a
   near-identical dark navy background: a confirmed ~1:1 contrast ratio, verified via
   `getComputedStyle`, not eyeballed. Fixed by adding a `tone` prop (`"quiet" | "dense"`) that picks
   `text-foreground/60` or `text-field-dense-foreground/60`; every call site was updated to pass the
   tone matching its actual section. Recomputed post-fix: dense-tone captions now render at
   `rgba(243,245,247,0.6)` on the dense background (~6.4:1, WCAG AA pass for normal text);
   quiet-tone captions remain ~6–7:1 on the light background. This was the only contrast pair
   measured precisely this session — see "Accessibility" below for what was and wasn't checked.

(1) and (2) were caught by measuring `scrollWidth` vs. `clientWidth` programmatically across all 9
routes at 200px in the first implementation pass; (3) was caught by direct DOM/computed-style
inspection during the correction-pass audit, not by visual inspection alone — a downscaled
full-page screenshot had made the bug look like a rendering/lazy-load issue rather than a contrast
issue on first pass, and that misreading was itself corrected before being acted on.

## Known factual blockers (do not resolve by inventing content)

- No verified regular opening hours for Via Nazario Sauro exist anywhere in the evidence base.
- No physical/sensory access facts are verified for either Via Nazario Sauro or Parco 11 Settembre.
- Parco 2026 season end date is not yet verified.
- Current legal representative of the cooperative is not stated (unresolved source conflict).
- 8 of the 15 real-material archive images need explicit owner clearance (identifiable people,
  including one wheelchair user) before any public production use.
- No current documentary photography (present-day interior/exterior/activity) exists for either
  place.

## Typography — reviewed, not changed

The correction pass was explicitly instructed to test, not assume, whether Fraunces/Inter/IBM Plex
Mono was itself becoming a generic "serif editorial + sans functional + mono metadata" formula.
Judged from the redesigned screenshots (Organisation's large date, History's varied-scale cluster,
Work-with-us's stat block): the typography was not the source of this system's genericness risk —
the risk identified in the audit was Fact-list concentration and the timeline component, both fixed
above without touching type. Fraunces/Inter/IBM Plex Mono are kept unchanged.

## EventDetail — rebuilt greenfield

The first implementation left `EventDetail.tsx` almost untouched (16 lines changed of the whole
file) while claiming the `/eventi` area was "restyled." It still used the deleted legacy semantic
classes (`text-secondary`, `bg-secondary`, `text-primary`, `border-primary`), which only appeared
to match the new system because `tailwind.config.ts` remaps those names underneath it — a real
"restyled not rebuilt" contamination, confirmed by diff and by its visibly different heading
treatment and solid-fill CTA button. It has been rebuilt: plain `foreground`-based heading (no color
override, matching every other page), a `Fact`-based practical block (Quando / Dove / Stato /
Accessibilità / Prenotazione — genuinely decision-bearing information for someone deciding whether
to attend), and the outline-button pattern used everywhere else. No event currently exists in
`content/events/`, so only the not-found state is renderable against real data; the found-state
code was verified by reading, not by a live screenshot, and no placeholder event record was
invented to force one — that would repeat the exact fabrication problem the working paper's
evidence discipline exists to prevent.

## Explicitly rejected

Hero+four-cards+CTA+footer as Home's structure; a uniform image-card grid for the construction
material (replaced with full-bleed + citation panel); a boolean "accessible" badge; disability
iconography; any fabricated tape/marker/blueprint graphic; hours or workforce percentages without
owner confirmation; describing any historical venue without its closure date in the same view;
**a vertical timeline for History** (rail, date dots, repeating status pills, uniform rows) — the
first implementation built exactly this and justified it as "the one legitimate exception" because
the content is genuinely chronological; that reasoning was rejected in the correction-pass audit
because the ban is on the visual cliché, not on whether ordering is real, and the rebuilt History
proves a chronological page doesn't need a timeline component to stay readable.
