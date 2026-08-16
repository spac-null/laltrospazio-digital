# L'Altro Spazio — Page Experience: Home + Visit Prototype

**Working date:** 16 August 2026
**Branch:** `feature/page-experience-home-visit-v1` (based on `main@474938e`)
**Status:** Disposable full-page prototype — mechanical QA complete, owner visual review applied. Visit structurally validated; Home awaits real-photography test. Not a design sign-off.
**Scope:** Two full-page HTML prototypes (Home + Visit) testing the recommended page experience against real content, with a reviewer-only date-state switch for the August 2026 closure/reopening.

---

## 1. What was built

Two standalone HTML pages sharing a common CSS/JS frame:

| Page | File | Purpose |
|------|------|---------|
| Home | `prototypes/page-experience-v1/index.html` | Full landing experience: place status, identity bridge, current activity, recent moments, approach, action paths |
| Visit | `prototypes/page-experience-v1/visit/index.html` | Practical visit info: Via Nazario status/hours, accessibility (nine-dimension), Parco 11 Settembre, contact CTA |

### Shared assets

| File | Role |
|------|------|
| `shared/tokens.css` | Palette (cool/white neutral + functional signal colours), spacing scale, radii, measure limits |
| `shared/type.css` | Two-voice typography: functional (system-ui) + editorial (Georgia serif) + metadata (monospace) |
| `shared/base.css` | Reset, layout primitives, status-dot, fact-line, button, placeholder image, touch-target floor |
| `shared/frame.css` | Sticky header, responsive nav, footer, date-state switch, reviewer-only controls |
| `shared/frame.js` | Mobile nav toggle + date-state switch (localStorage persistence) |

### What the date-state switch tests

The prototype includes a reviewer-only date switch (fixed bottom-left) that toggles between:

- **16 ago — chiuso** (default): Shows "Temporaneamente chiuso dal 12 al 26 agosto 2026" on Via Nazario Sauro
- **27 ago — riaperto**: Shows "Ha riaperto il 27 agosto 2026"

This stands in for the real NOTICE auto-expiry behaviour described in the content model (§12): a production build would exclude an expired NOTICE at build time. This prototype has no build step, so the same before/after states are shown via a manual test switch.

---

## 2. Mechanical QA results

All testing was performed with Playwright (Chromium 147) via computed-style probes and DOM measurement. Screenshots were generated for the record.

### Overflow test (6 widths × 2 pages = 12 combinations)

| Width | HOME | VISIT |
|-------|------|-------|
| 320px | ✅ clean | ✅ clean |
| 375px | ✅ clean | ✅ clean |
| 390px | ✅ clean | ✅ clean |
| 768px | ✅ clean | ✅ clean |
| 1024px | ✅ clean | ✅ clean |
| 1440px | ✅ clean | ✅ clean |

Zero horizontal overflow at all viewport widths. Grid items use `min-width: 0` to prevent long unbreakable tokens (emails, phone numbers) from forcing tracks wider than the viewport.

### Accessibility attributes

| Check | HOME | VISIT |
|-------|------|-------|
| Skip link (`a.skip-link[href="#main"]`) | ✅ | ✅ |
| `aria-current="page"` on active nav | ✅ | ✅ |
| Nav toggle `aria-expanded="false"` | ✅ | ✅ |
| Nav toggle `aria-controls` | ✅ | ✅ |
| Nav `aria-label` | ✅ | ✅ |
| Sections with `aria-labelledby` | 5 | 5 |
| Exactly 1 `<h1>` | ✅ | ✅ |

### Touch targets (2.75rem / 44px minimum)

| Category | Result |
|----------|--------|
| Buttons (`.btn`, nav links) | ✅ All ≥ 2.75rem |
| Site-id header link | ✅ Fixed (added min-height + padding) |
| Footer links | ✅ Fixed (added min-height + padding) |
| Action prompt links | ✅ Fixed (added padding) |
| Quick-answer links (Visit) | ✅ Fixed (added padding) |
| Date switch buttons | ⚠️ h=27px — intentionally small reviewer-only tool, acceptable |

### Date-state switching

| Check | HOME | VISIT |
|-------|------|-------|
| Default state is `16aug` | ✅ | ✅ |
| 27aug content hidden in 16aug state | ✅ | ✅ |
| Click 27aug → state switches | ✅ | ✅ |
| 16aug content hidden in 27aug state | ✅ | ✅ |
| 27aug content visible in 27aug state | ✅ | ✅ |

### Focus-visible

| Check | HOME | VISIT |
|-------|------|-------|
| Focus outline present on skip-link | ✅ | ✅ |

### Footer links

| Check | HOME | VISIT |
|-------|------|-------|
| Email link (`mailto:`) | ✅ | ✅ |
| WhatsApp link (`wa.me`) | ✅ | ✅ |

### Owner visual review (16 August 2026)

| Page | Finding |
|------|---------|
| Visit | Structurally and visually convincing enough for this prototype stage. Content honesty, hierarchy, and nine-dimension accessibility model read clearly at page scale. |
| Home | Structurally convincing. Full creative specificity — warmth, density, rhythm of real photography — remains dependent on a real-photography test. Placeholder images cannot validate the final visual identity. |

---

## 3. Content verification against canonical sources

All content in the prototype was verified against the canonical docs in `docs/institution/`.

### Current operational facts

| Fact | Source |
|------|--------|
| Address: Via Nazario Sauro 24/F, Bologna | `laltrospazio-current-public-state-v1.md` |
| WhatsApp: +39 351 704 8064 | `laltrospazio-current-public-state-v1.md` (two independent sources) |
| Email: nazariosauro@altrospazio.org | `laltrospazio-current-public-state-v1.md` (Facebook corroborated) |
| Closure: 12–26 August 2026, planned reopening 27 August | Owner-confirmed planned date; actual reopening not yet occurred at source date |
| Parco 11 Settembre: active summer 2026 | Owner-confirmed |
| Cooperativa L'Altro Spazio: cooperative registration 2022, operational consolidation of Via Nazario/Parco from 2025 | `laltrospazio-current-public-state-v1.md` |

### Historical / longitudinal facts

| Fact | Source |
|------|--------|
| Cena al Buio: format developed from 2015, last confirmed public date 31 October 2025 | `laltrospazio-current-public-state-v1.md` |
| L'Altro Spazio practice active since 2014 | `laltrospazio-current-public-state-v1.md` |
| Deaf/disabled workforce involvement: historical practice since 2015, current composition not established | `laltrospazio-current-public-state-v1.md` |
| Braille menus: documented 2018, current availability unverified | `laltrospazio-current-public-state-v1.md` |

### Point-in-time evidence (not current service availability)

| Fact | Source |
|------|--------|
| Cena al Buio last confirmed date: 31 Oct 2025 | `laltrospazio-current-public-state-v1.md` |
| No 2026 Cena al Buio public dates found | `laltrospazio-current-public-state-v1.md` |

### Current status unknown

| Fact | Status |
|------|--------|
| Regular opening hours | No authoritative source exists |
| Wheelchair access / door width / toilet | Zero physical access items verified |
| LIS-capable staff per shift | Historically strong, current staffing unestablished |
| Season end date for Parco | Not yet verified |
| Specific 2026 event dates | No 2026 event dates verified |
| Regular WhatsApp monitoring frequency | Not established |

### Claims deliberately NOT included

- "Completely accessible" — unsupported blanket claim from legacy site
- 80% or 50% disabled-staff figures — legacy/unresolved
- Impact statistics — fabricated-looking, no provenance
- Named testimonials — no provenance
- Instagram/Facebook follower counts — not relevant to page experience prototype

---

## 4. Creative direction alignment

The prototype implements the creative direction v1 (`docs/design/laltrospazio-creative-experience-direction-v1.md`) through the structural decisions validated in the prototype test lab (`docs/design/laltrospazio-creative-prototype-test-v1.md`).

### Implemented structural decisions

| Decision | Implementation |
|----------|----------------|
| Cool/white neutral base (not warm cream) | `--color-bg: #f7f8f9`, `--color-surface: #ffffff` in tokens.css |
| Functional signal family (status meaning only) | `--color-current`, `--color-notice`, `--color-archive`, `--color-unknown` |
| Two-voice typography (functional + editorial) | system-ui + Georgia serif + monospace metadata |
| Editorial voice = italic serif (Study 3 validated) | `.v-editorial`, `.v-editorial-lead`, `.v-long-form` classes |
| Metadata = monospace (Study 3 validated) | `.v-metadata` class for dates, verification notes |
| Labels = uppercase small-caps (Study 3 validated) | `.v-label` class for section labels |
| Status dots: never sole carrier of state | Every status dot has text alongside it |
| Placeholder images: never fake-photo | Diagonal-line pattern with "placeholder" flag, not stock photos |
| Accessibility as section of Visit, not standalone | Nine-dimension model embedded in Visit page |
| Date-state switch: stands in for real auto-expiry | localStorage-persisted, reviewer-only, two states |
| Internal design rules → neutral public labels | Design principles ("not a separate section", "not a second bar") preserved in this document, not displayed as public copy |

### What is NOT tested in this prototype

- Typography family choices (system fonts only — structural relationship tested, not final fonts)
- Photography (placeholders only — real images supply warmth, not the base palette; see `docs/design/laltrospazio-production-image-needs-v1.md` for production image requirements)
- Relationship treatments (linear vs. spatial — tested in Study 5 of the creative prototype lab)
- Dark mode (not in scope for v1)
- Build-time NOTICE auto-expiry (manual switch instead)
- Final visual identity of Home (dependent on real-photography test)

---

## 5. Files committed

```
prototypes/page-experience-v1/
├── index.html              (Home prototype)
├── visit/
│   └── index.html          (Visit prototype)
├── shared/
│   ├── tokens.css          (palette + spacing)
│   ├── type.css            (two-voice typography)
│   ├── base.css            (reset + primitives)
│   ├── frame.css           (header/nav/footer + date switch)
│   └── frame.js            (mobile nav + date switch)
└── screenshots/            (8 PNG files — desktop/mobile × 16aug/27aug × home/visit)

docs/design/
├── laltrospazio-page-experience-home-visit-v1.md  (this report)
└── laltrospazio-production-image-needs-v1.md      (image asset request)
```

### Pre-existing working-tree change (NOT part of this work)

`package-lock.json` has a pre-existing unrelated modification. It is NOT staged, NOT committed, and NOT part of this branch's work.

---

## 6. What happens next

1. **Human visual review** — open the HTML files in a browser at 1440px and 390px; evaluate warmth, density, rhythm, perceived quality. Mechanical QA cannot substitute for this.
2. **Photography** — replace placeholders with real documentary images; the palette is designed to recede and let photography supply warmth.
3. **Typography finalisation** — choose production font families (the structural relationship is validated; only the families are placeholder).
4. **Build-time NOTICE expiry** — replace the manual date switch with a real build-time mechanism (e.g., conditional include based on current date).
5. **Expand to other pages** — apply the same pattern to "What's on", "Our approach", "Work with us" once content is ready.
6. **Accessibility verification** — complete the 30–60 minute on-site checklist at Via Nazario to fill in the "da verificare" items.

---

## 7. Known limitations

- **No real photography** — all images are diagonal-line placeholders. The warm/cool balance will shift significantly once real images are present.
- **System fonts only** — Georgia is a proxy for the editorial serif; the actual typeface choice is a separate decision.
- **No build step** — date-state switch is manual (localStorage), not automatic.
- **Inline style attributes** — some `style="..."` attributes are used for one-off layout tweaks (e.g., `grid-column: 1 / -1` on the Cena al Buio card). These are prototype-only and would be refactored into classes for production.
- **No analytics, no scripts beyond frame.js** — this is a static HTML prototype with no JavaScript beyond the nav toggle and date switch.
