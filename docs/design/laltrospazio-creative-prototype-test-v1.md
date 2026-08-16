# L'Altro Spazio — Creative Direction v1: Prototype Test Report

**Working date:** 16 August 2026
**Status:** Continuation + QA result for the disposable prototype laboratory at `prototypes/creative-direction-v1/`. Evidence attached to `laltrospazio-creative-experience-direction-v1.md`; not an approval of the creative direction and not a design sign-off. A later higher-level review makes the final creative judgment.
**Scope:** what was rendered, what technically broke and was fixed, what visibly worked, what failed, comparative findings, and what should not survive into production. Evidence-based; where judgment is involved it is labelled as judgment, not fact.

---

## 1. What was rendered and how

All six pages of the lab (lab index + five studies) were rendered in headless Chromium 147 (Playwright), at **1440px desktop, 768px tablet, 390px mobile**, plus an extreme **200px** width used to emulate ~200% browser zoom on a phone-sized viewport (real browser zoom shrinks the CSS layout viewport; 200px is the equivalent of 200% zoom on a 390px device). Interaction was driven, not just loaded:

- Palette switcher cycled 1→2→3 and type switcher 1→2→3 on every study; `aria-pressed` state, `data-palette`/`data-type` attributes, and localStorage persistence across reload were checked.
- Study 5's linear↔spatial toggle was driven at desktop, tablet and mobile.
- Tab-key focus traversal was exercised through Study 4 (buttons, links, native `<details>` summaries); computed focus outline verified on every focusable element.
- `prefers-reduced-motion: reduce` was emulated on the lab index.
- Console errors and page errors were captured on every load.

Rendering was verified by computed-style probes and DOM measurement, not by pixel comparison — the testing model used here cannot view screenshots. Layout correctness (overflow, wrapping, pseudo-element connectors, computed colors/typography) was therefore verified numerically, which is the stricter of the two checks. Screenshots were generated for the record but are not committed.

### Render results (final, after the fixes in §3)

- **All six pages render clean at 1440 / 768 / 390 / 200px.** Zero horizontal overflow, zero console errors, zero page errors across all 24 page×viewport combinations.
- **Switcher:** all 3 palettes and all 3 type systems apply, update `aria-pressed`, cause no layout break, and persist across reload via localStorage. `--palette-name` resolves correctly (no runtime error).
- **Study 5 toggle:** spatial layout applies at ≥760px (satellites `display: flex`, connector pseudo-elements render), degrades to a linear stack below 760px with no overflow, and `aria-pressed` tracks the chosen treatment. DOM order and markup are identical between treatments by construction.
- **Keyboard:** every focusable element (lab buttons, links, all 8 `<details>` summaries in Study 4) shows the `#1a56ff` 3px outline; no invisible-focus case found.
- **Reduced motion:** loads clean under `reduce`; the base stylesheet kills all transitions/animation (the only motion in the lab is none by design).
- **Internal links:** every relative link resolves; the only `href="#"` values are explicit prototype placeholders (CTA / relationship cards).

## 2. The five studies (inventory confirmed)

All five required studies exist and are structurally complete:

1. `study-1-current-archive/` — three current/archive markers (temporal edge, density/framing, sequence/grouping) on the same four real facts.
2. `study-2-freshness-uncertainty/` — plain-language freshness/uncertainty, each block with a "for reviewers" disclosure mapping to internal tokens (explicitly QA-only, not production).
3. `study-3-typography/` — three two-voice type systems across eight real content kinds.
4. `study-4-accessibility/` — the real nine-dimension access profile as an ordinary page.
5. `study-5-relationship/` — linear vs. spatial treatments of one Cena al Buio cluster, from identical list markup.

Shared assets: `shared/tokens.css` (3 palettes), `shared/type.css` (3 type systems), `shared/base.css`, `shared/lab.js`. No dependencies beyond system fonts; no build step; paths are relative; `file://` loading works.

## 3. Technical errors found and fixed

The previous session's nested-UL/LI edits in Study 5 were inspected first: the structure is **valid** (`<ul>` → two `<li>`, the second wrapping a nested `<ul>` of three cards; heading order H1→H2→H3 intact; no stray tags). No defect there. What was found and fixed instead:

1. **Extreme-zoom horizontal overflow (real, content-level).** At the 200px reflow stress (≈200% zoom on a phone), Study 3's sample grid overflowed because its `auto` grid track sizes to item min-content, and Study 3's archival-quote block overflowed because a long word at 28px exceeded the available measure after the quote block's border+padding. Fixed with: `.sample { min-width: 0 }` (grid item), and `overflow-wrap: break-word` on all three editorial voice classes in `shared/type.css`.
2. **Extreme-zoom overflow in lab chrome.** The lab switcher groups did not wrap, inflating document width at 200px. Fixed with `flex-wrap: wrap` on `.lab-group` in `shared/base.css`. This is disposable chrome, but it is what the reviewer uses, so it needed to survive the same zoom test.
3. **Long-token overflow on the lab index.** The `code` tokens (`docs/design/…`) overflowed at 200px. Fixed with global `code { overflow-wrap: anywhere }` plus `h1,h2,h3 { overflow-wrap: break-word }` in `shared/base.css` (long Italian words in headings are a real production risk; both are standard safeguards).
4. **Study 4 dimension headlines overflowed at 200px.** The flex `summary` row couldn't wrap. Fixed with `flex-wrap: wrap` on `details.dim > summary`.
5. **Fact-fidelity fixes (prototype content):**
   - Study 4 said Braille menus were documented "in a 2018 press guide". No "press guide" source exists in the repository record — the matrix records Braille menus as documented in 2018 without naming a press guide. Reworded to "Braille menus were documented in 2018; we don't yet know if that still holds today."
   - Study 2's Cultura Verde line omitted the canonical editorial-safe phrasing. Aligned to the content model's wording: "delivered in partnership with Associazione Farm **and other local organisations**".

No other factual claims in the prototypes were found to conflict with the Current Public State v1 matrix, the content model's real-content test, or the creative direction (closure dates, Parco summer activity, Via Polese 2014, Cena al Buio Halloween 2025 / Dec 2025 service proposal, SEGNI DI PACE March 2026 submission, contact channels, 2015-era lowered-counter design intent, per-dimension access states — all consistent).

### Verified non-issues (checked, not found)

No duplicate IDs, no orphan in-page anchors, no malformed headings, no broken relative paths, no console errors, no color-only status distinctions in any study (every dot is `aria-hidden` decorative and every state is carried by adjacent text), no text below 16px body / no compressed or rotated text anywhere, no fixed-pixel layout widths (all rem), reduced-motion respected.

### Contrast audit (computed)

| Pair | Ratio | Note |
|---|---|---|
| P1 ink / bg | 14.2 | pass |
| P1 muted / bg | 6.4 | pass AA |
| P1 current (teal) / bg | 5.5 | pass AA as link |
| P1 archive (ochre) / bg | 4.3 | pass non-text 3:1 (used for dots/borders only) |
| P2 ink / bg | 19.3 | pass |
| P2 current (blue) / bg | 6.7 | pass AA as link |
| P3 signal (orange `#e2542a`) / bg | **3.2** | **fails AA for text; passes non-text 3:1** |
| P3 notice (rust) / bg | 5.2 | pass |
| Focus ring `#1a56ff` on P1/P3 bg | 4.9 / 4.6 | pass 3:1 focus |
| `--color-ink-faint` (all palettes) | ~3.0–3.3 | **fails AA for small text — and it is never used anywhere in the lab** (defined, unused) |

The one real contrast defect is Palette 3's signal orange used as link/status colour. Finding below in §7.

## 4. Current / Archive result (Study 1)

Question: **can a visitor distinguish NOW from ARCHIVE in under ~1 second without colour alone?**

- **Treatment A — temporal edge:** YES. The redundant, non-colour channels (a plain word tag "Currently" / "Historical — closed", a solid vs. dashed border edge, and a dated metadata line) each carry the state independently. It survives the hardest case (a mixed list with live and historical items side by side) and works for colour-blind, low-vision and screen-reader users because the word is the real carrier. This is the strongest single answer to the question.
- **Treatment C — sequence/grouping:** YES inside its own region (a heading "Active now" + today's date vs. an "Archive" heading), and the cleanest/cheapest of the three. But it has **no mechanism for a mixed feed** — the prototype names this limitation itself. It is only valid where the page architecture already separates the two surfaces (which the content model's hard surface separation largely does — but a WORK page mixing a live EVENT and a past one, or search results, is exactly the case the direction's "small but consistent visual marker" (§14, §19) was written for).
- **Treatment B — density/framing:** PARTIAL at the 1-second test. It is the strongest *register* (current items tight/dense/dated-today; historical items get museum-label breathing room, a ghost year watermark, and the editorial typographic voice — verified in computed styles). But nothing states "historical" as a word; the signal is spatial + typographic weight, which registers slower than a word. It earns its place as the **historical register's atmosphere** (this is exactly the direction's §21 "background/furniture convention"), not as the primary now/archive discriminator.

**Recommendation:** A is the strongest treatment for the stated test; C is the right default where surfaces are already separated; B is the historical register, not the discriminator. In production the mechanism is a hybrid — section-level separation (C) plus A's per-item marker anywhere the two could plausibly mix — which is what the creative direction already prescribes; the prototypes confirm it and add one nuance (B's editorial voice + whitespace as the "archive register" works well and should be adopted as the History page atmosphere). No direction edit required.

## 5. Freshness / Uncertainty result (Study 2)

Question: can confirmed / historical / unknown / stale / submitted-but-unresolved states be communicated without reading as an admin dashboard, compliance software, or a database debug view?

**PASS.** The visitor-facing copy is entirely plain sentences — "ask before you come", "ask us to check current availability", "outcome not yet known" — each attached to a small, quiet provenance line ("Confirmed by the venue, 16 August 2026", "To be confirmed", "Last confirmed offer: December 2025"). Internal tokens (`OWNER-CONFIRMED CURRENT`, `NEEDS-VERIFICATION`, `STALE`, `SUBMITTED`) appear only inside the explicitly-labelled "for reviewers" disclosure blocks, which are prototype QA aids and would not exist in production. The evidence vocabulary does not leak.

Two findings stand out:

1. **UNKNOWN reads as intentional and useful, never as missing content.** Every unknown carries a real next step ("ask before you come", "ask us to check", "check back"). This is the difference between an honesty mechanism and a gap.
2. **The stale-but-current Cena al Buio block is the strongest implementation of Content Model Invariant 4.** The format is stated plainly as current, its freshness lapse is stated without drama ("No public date confirmed right now — ask us, or check back"), and the CTA is softened by phrasing rather than by a badge. This is exactly the "soften the call-to-action, never lie, never disappear" behaviour the model requires, reached in plain language.
3. **The same-component-family demonstration (Cultura Verde resolved vs. SEGNI DI PACE unresolved) is the most important structural finding.** Identical structure teaches a visitor to read "outcome known" vs. "outcome not yet known" as a normal pattern, not as two different kinds of page. This should survive into production as a component rule.

Caveat to record: the monospace metadata voice is carrying a lot of the provenance reading. In production it must stay genuinely quiet (small, muted) or the pattern can tip toward a compliance readout. The state must always be carried by the sentence, not by the metadata styling.

## 6. Typography result (Study 3)

Three systems, verified numerically to be genuinely different in mechanism:

| System | Editorial voice (computed) | Mechanism |
|---|---|---|
| 1 Editorial Pair | Georgia, italic, 400, 28px quote / 20px statement | Family contrast (serif vs. sans) + italic |
| 2 Modulated | system-ui, 700, 33.6px quote / 22.4px statement | Weight + scale only, single family |
| 3 Grotesk + Spacing | system-ui, 500, 24px quote, +0.03em tracking | Tracking/weight — and **no case treatment is actually applied** (the stylesheet's "case treatment" claim is a dead rule) |

Findings across the required content kinds:

- **Venue status, event title/date, access instructions, CTA, metadata:** identical functional voice in all three systems; all clear. The longest Italian string wraps cleanly at 360px and at 200px in all three (no hyphenation issues).
- **Institutional statement + archival quote:** System 1's serif-italic is the only one where the editorial voice reads as *testimonial/warm rather than merely different* — which is the exact test the direction's §28 item 3 sets. System 2's bold-sans quote reads strong but closer to a menu emphasis; it is a weaker *voice*, though the most space-efficient. **System 3 does not carry a two-voice system at all** — a 500-weight quote with 3% tracking is barely distinguishable from the functional voice, and no case mechanism exists behind the description's claim.
- **Long-form paragraph:** identical in all three (serif, 1.0625rem, 1.75 leading, 38rem measure) — good long-form measure regardless of system.
- **Mobile/zoom/Italian:** rem-only sizing verified; no rotation, no compression, no body text below 16px in any system; all survive 200px reflow after the §3 fixes.

**Recommendation (structural, not a font choice):** System 1's *logic* — family contrast, italic reserved for the editorial voice, mono metadata — is the strongest way to keep the two voices distinct once weights and sizes converge under long Italian strings and small screens. System 2 is the strongest single-family alternative if the visual phase rejects a serif. System 3, as implemented, does not earn a two-voice typography and should be rejected (or its mechanism re-specified — not done here). Final families are deferred to the visual phase, as the direction intends. The direction's §9 two-voice model is validated, not contradicted; no edit required.

## 7. Accessibility display result (Study 4)

Question: does it support VERIFIED and UNKNOWN at once, and can a visitor quickly understand what is known, what is not, how to ask, and whether information is event-specific or venue baseline?

**PASS, and this is the strongest single study.** The design:

- Keeps every one of the nine real dimensions, each as a native `<details>` with the *state visible in the summary line without opening* ("Physical access — not yet confirmed" vs. "Deaf / communication access — text contact confirmed, staff coverage unconfirmed"). State is readable without interaction (direction §19 requirement) and survives keyboard/screen-reader use (verified: focus visible on all summaries, toggle works).
- Never collapses to a boolean: a dimension can be partially known (Deaf access: contact confirmed, staff coverage unconfirmed — in one line).
- Carries the honest-unresolved posture of the Current Public State matrix verbatim: the 2015 lowered-counter design intent is stated as historical and "we won't guess"; Braille menus as "documented in 2018; we don't yet know if that still holds today"; captioning as not established.
- Distinguishes event-specific vs. venue baseline ("Event-specific access — varies, check the listing") and separates the site's own digital-accessibility responsibility from a venue claim.
- Ends with the single "Ask before you come" contact path, making the unknowns resolvable.
- Rejects all four named anti-patterns: no blanket accessible/not-accessible, no green/red tick dashboard, no accessibility icon decoration, no separate "accessibility mode". It is styled with the same fact-line/card language as Studies 1–2.

One production note: the closing CTA link is a prototype `#` placeholder; production must wire the real WhatsApp channel and make explicit which number fields access questions (an open owner decision in the matrix).

## 8. Relationship view result (Study 5)

Question: does the spatial version *improve* understanding, or is it merely visually clever?

**Judgment: it does not yet earn a launch role — keep it out of launch, exactly as the direction's recommended default holds.** But it is a genuinely useful prototype result, for three reasons:

1. **The accessibility blocker is answered.** Because both treatments are the *same* `<ul><li><a>` markup (DOM order and link text identical; only CSS differs), the spatial view costs nothing in semantics. Tab order matches the visual reading order (centre card → three satellites), connectors are decorative pseudo-elements skipped by AT, and the relationship is carried by the eyebrow labels — which are the text equivalents the direction's §8 requires. The "can a relationship view be made accessible" question is answered: yes, when the markup never changes.
2. **The mobile collapse is real and the prototype says so honestly.** Below 760px the connectors disappear and it becomes the linear stack. The relationship then depends entirely on the eyebrow labels ("The format (WORK)", "Historical occurrence", "Book privately") — which work, but which also means the spatial treatment is a desktop-only enhancement.
3. **It does not demonstrate improved comprehension.** In both treatments the same four relationships are conveyed by the same words; spatial adds a hub-and-spoke diagram that says visually what the labels already say textually. No evidence it beats the linear list for a first-time visitor; desktop-only; one more thing to learn. The direction's default (relationship exploration out of launch, prototype-first) is confirmed rather than overturned.

If the later phase wants an opt-in exploratory mode on a WORK page, the pattern proven here (hub-and-spoke, markup-invariant, desktop-only with honest mobile collapse) is a viable, low-risk template — but it is a post-launch decision, not a launch feature.

## 9. Palette result

Three hypotheses were tested behaviorally (all three render, all three keep composition identical, all three pass layout at every width):

- **Palette 1 — warm-neutral cream/charcoal** (muted teal current, rust notice, ochre archive). Contrast is sound (teal-as-link 5.5, all text pairs ≥6.1 except the intentionally-unused faint). Warmth is the strongest of the three; the muted earth-teal status accents keep it clear of generic beige hospitality. Independence from the book is the direction's own flagged convergence question (§24, Owner Decision 3) — the *system* (functional status accents + provenanced facts) is the differentiator even where the *base* overlaps.
- **Palette 2 — white/ink with signal blue.** Best contrast of the three (blue-as-link 6.7); cool, graphic, highest institutional coldness; the blue accent is the closest to generic NGO/tech styling. Strongest visual distance from the book, weakest warmth.
- **Palette 3 — restrained base + one strong orange signal.** The most legible current-vs-archive at a glance (orange live vs. muted archive-brown), and the most faithful to the direction's "color as information, not mood" logic — **but the signal orange `#e2542a` fails AA on cream (3.2:1) for text**, and it is used for links and status text. As a non-text status mark (dots, edges) it passes 3:1; as text it fails.

**Observed strengths/problems (no final choice made, per instructions):** Palette 1's base+warm accents best satisfy the direction's combined warmth + contrast + non-generic goals; Palette 3's *discipline* (one saturated accent reserved for status) is the most aligned with Measure's color logic but its current accent must be darkened to ≥4.5:1 (or restricted to non-text marks) before it could be considered. The strongest candidate logic for the visual phase is "Palette 1's warm-neutral base, Palette 3's one-signal discipline, with the signal darkened to pass AA" — but this is a recommendation for the visual-design phase, not a palette selection.

## 10. Measure + Encounter synthesis result

**PARTIALLY.** MEASURE is fully realised: the family's spine is dated provenance ("Confirmed by the venue, 16 August 2026"), checked states, per-dimension honesty, plain-language status, functional connectors — all as genuine interface conventions, with no rulers, grid overlays, dimension lines or blueprint motifs anywhere. ENCOUNTER is present as *tone* (the editorial voice, the "ask us before you come" hospitality, the first-person "we won't guess", the breathing room of the historical register) but is not yet present as *composition*: there are no images, no zone-with-different-light, no demonstrated density gradient between quiet decision pages and dense History pages. The synthesis is directionally correct (Measure as spine, Encounter as warmth) and the warmth is genuinely carried by copy and typographic voice — but the prototypes under-test Encounter's compositional half, which is the direction's Territory-B graft. This is the single largest gap between the direction's promise and what the lab demonstrates.

## 11. Anti-generic result

The family's single most distinctive element is the **honest-fact system** (dated claims, softened stale CTAs, "we don't know — ask us") — the DNA-2 honesty mechanism. Stripped of that content, the chassis (card lists, cream/charcoal, sans + serif + mono, section headings) would be interchangeable with an architecture studio, a contemporary-art museum, or a boutique hotel; the closest generic pairing is **boutique-hotel / contemporary-cafè culture** (warm neutral + serif editorial + hospitality CTAs), which is precisely the direction's named Territory-B risk. The genericness protection is carried almost entirely by content discipline, not by the visual system — which is consistent with the direction's "Measure is a behavioural idea," but it means the fact discipline must be in production from day one or the visual system alone will not hold the line. The prototypes correctly avoid decorative disability imagery; nothing here suggests fixing genericness that way (standing anti-pattern).

## 12. Book-mimicry assessment

Assessed only against the creative direction's recorded BOOK-SPECIFIC vs. SHARED-DNA distinction — **the unpublished PDF was not opened** (privacy boundary), so a side-by-side skin comparison is not possible and is explicitly outside this report's evidence.

Within that limit: the prototypes contain **none** of the book-specific mechanisms the direction rejects — no rotated text, no compressed/condensed uppercase body copy, no dotted-line cover motif (the dashed borders in the lab are status edges and reviewer boxes, not decorative dividers), no constellation/blueprint linework, no interior materials (no wood/plants imagery of any kind — there are no images at all), and the connectors in Study 5 are functional relationship lines of the kind §8 licenses. The SHARED DNA is present: two-voice typography, visible provisionality, per-dimension accessibility, plain-language facts. The palette overlap is the direction's own flagged convergence issue, not a borrowed skin, because the functional status-accent system is something the book (per the direction's own record) does not have.

**Limitation stated:** final judgment on the "related by logic, not by skin" test requires the PDF and human review of the two side by side (the direction's own Walkthrough F test). This report cannot and does not render that verdict.

## 13. Creative-direction edits

**NONE.** Every §28 prototyping question the lab was built to test (current/archive marker, freshness display, two-voice typography, relationship view, nine-dimension accessibility) produced results that *confirm or refine* the written recommendations; nothing rendered strong evidence that a written recommendation is wrong. The refinements worth carrying into the visual phase (per-item marker for mixed feeds, System 1's two-voice logic, Palette 1 base + Palette 3 discipline with darkened signal, the honesty of the Study 2/4 patterns, relationship-out-of-launch) are additions of evidence to the existing direction, not corrections of it, so the direction document is left untouched.

## 14. What should NOT survive into production

- The palette/type switcher and the lab chrome (prototype tooling only).
- The "for reviewers" internal-token disclosures in Study 2 (QA aid; the tokens must never appear in visitor copy).
- Placeholder `href="#"` links (CTAs, relationship cards) — production must wire real routes/channels.
- System 3's typography as implemented (does not carry a two-voice system).
- Palette 3's signal orange as text/links at 3.2:1 (must be darkened or restricted to non-text).
- The relationship view in launch scope (post-launch candidate only).
- Study 5's connector graphics as anything other than markup-invariant, desktop-only enhancement.
- The extreme-200px layout behaviour is fixed and is a floor for production, not a special case to ignore.

## 15. QA checklist

- [x] All five studies + lab index render; no console-breaking errors.
- [x] Relative links/assets resolve; `file://` works; no build step.
- [x] Mobile (390) / tablet (768) / desktop (1440) verified; extreme reflow (200px) verified clean.
- [x] Keyboard basics checked; focus visible on all interactive elements.
- [x] Reduced-motion respected.
- [x] Colour is never the sole state carrier (dots are decorative; words/sentences carry state).
- [x] UNKNOWN remains unknown; no invented facts; two invented/loose attributions found and corrected (§3).
- [x] No legacy-site inspection; no confidential/unpublished sources opened.
- [x] No new dependencies; no production code touched; `package-lock.json` untouched.

## 16. Recommendation to the reviewing session

**NOT READY FOR FINAL CREATIVE REVIEW — but close, and the direction itself is validated.** The prototypes confirm the direction's core claims (current/archive clarity, honest freshness, accessibility-as-method, two-voice typography, relationship-out-of-launch). The reasons not to call it ready: (a) Encounter's compositional half is under-tested (no images, no density gradient), which is the direction's own Territory-B graft; (b) a final palette and font decision still require the visual phase, with the two concrete findings above (System 1's logic, Palette 1/3 combination with a darkened signal); (c) the book-mimicry sibling test needs the PDF and a human eye, which this report could not and must not perform. The reviewing session should treat this report as validated evidence attached to the direction, not as a sign-off.