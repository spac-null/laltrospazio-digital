# L'Altro Spazio — Creative & Experience Direction v1

**Working date:** 16 August 2026
**Status:** Greenfield creative-direction decision record for the new public website. Establishes creative identity and experience system. Does not implement, code, schema, or produce final visual mockups.
**Builds on:** Working Paper v0.3, Institutional & Public Information Architecture v1, Current Public State & Implementation Readiness v1, Greenfield Content Model v1 (+ its real-content stress test). Reads their conclusions into creative direction; does not re-argue them.
**Also draws on:** An owner-supplied, unpublished dummy of a separate 10-year L'Altro Spazio book ("L'Altro Spazio V2.4", ~70 pages, planned for October 2026 publication), read in full — text, images and page composition — as internal creative source material only. Treated per the confidentiality and greenfield rules below.

---

## 1. Purpose

This document answers one question: if L'Altro Spazio had never had a website, what digital environment should it create now? It is not a redesign of the old site (which carries no authority here — see `laltrospazio-current-public-state-v1.md`'s Greenfield Notice) and it is not a plan to turn the forthcoming book into a website. It defines a creative identity and experience system for the new site, derived from the institutional evidence base and tested against, but not copied from, the book.

## 2. Source hierarchy

1. Working Paper v0.3 — what L'Altro Spazio has actually been, evidenced.
2. Institutional & Public Information Architecture v1 — what the public system must communicate, and to whom.
3. Current Public State & Implementation Readiness v1 — what is true right now.
4. Greenfield Content Model v1 + its real-content stress test — the semantic shape the site's knowledge must take.
5. The book prototype — a separate creative project, read for institutional DNA, never for design authority (§4 below).

Where this document's creative judgment conflicts with nothing in 1–4, it stands on its own authority as a design decision. Where it touches a semantic question already settled by the content model (status, freshness, current/historical, accessibility-as-dimensions), it defers to that model rather than reopening it.

## 3. Greenfield rule

The legacy production website, its navigation, components, routes, copy, JSON schemas and visual system carry zero design authority, per the standing instruction already established in `laltrospazio-current-public-state-v1.md`. This document was written without inspecting the legacy site. Every principle below is derived from institutional evidence and from the book prototype's *institutional DNA* (§5), never from what a website "should" look like by category convention (bar, NGO, cultural venue, cooperative).

## 4. Role of the book

The book is an owner-supplied, unpublished dummy of a separate publication — a 10-year retrospective planned for October 2026. It is not the brand manual, not the website design, not a component library, and not approved public copy. Early editorial formulations in it (a hand-lettered "L'INCLUSIONE È UN DIRITTO, NON UN PRIVILEGIO" tote bag, graffiti-style wordmark sketches, a punning "HAHAHAHIA" foodbar name-test sheet) are visibly draft material — the book itself is drafting in front of the reader, and this document treats it exactly that way: as evidence of a working method, not as approved language or approved graphic identity.

Confidentiality: the PDF is not copied into this repository, not committed, not published, and not quoted at length here. Where a specific page mechanism is referenced below, it is described, not reproduced.

The standing discipline for everything that follows: **the book and the website are related by logic, not by skin.** Full treatment in §24.

---

## 5. Institutional creative DNA

Nine principles, each cross-checked against Working Paper v0.3, the Institutional Architecture, the Content Model, and the book — kept only where genuinely evidenced at more than one of these levels, and each stated with an actual design consequence, not a slogan.

**DNA 1 — Meaning has more than one route to it, and none of the routes should be redundant duplication.**
*Evidence:* Proposition 2's whole evidentiary arc (translation as constitutive, not remedial); the content model's manifestation pattern (one WORK, several typed manifestations referencing it rather than duplicating it); the book's own drink-order menu, which pairs written Italian with a LIS hand-sign illustration for the same word, not as two separate menus.
*Digital consequence:* No content fact should have to be duplicated into a "text version" and a "visual version." A fact should have one canonical home, reached by more than one path (a search, a related link, a filtered list), never forked into parallel content nobody maintains.
*Anti-pattern:* a hidden "accessible version" page carrying a stripped-down copy of what the main pages say.

**DNA 2 — Environments are tested against bodies and use before they are declared finished, and the test never fully ends.**
*Evidence:* the book's floor-taped mockups ("lo spazio veniva provato con i corpi prima di essere costruito"); Chiara's beer-tap adaptation; the Comune pact's own provision to reopen and correct terms during implementation; the content model's freshness mechanism, which assumes every claim needs periodic reverification rather than being stated once and trusted forever.
*Digital consequence:* nothing on the site should read as a finished monument. Status labels, "last verified" dates, and visible provisionality (a plainly marked "to be confirmed" rather than a guessed fact) are not caveats bolted onto a confident design — they are the design's actual honesty mechanism, expressed visibly, not just in metadata.
*Anti-pattern:* a glossy "our commitment to accessibility" page with no dated, checkable claim behind it.

**DNA 3 — Accessibility is the design method, not a section added after the design is settled.**
*Evidence:* Chiara's own words in the book, stated as directly as institutional evidence gets: "per noi l'accessibilità non era una sezione del progetto — era il progetto"; the architecture's own hard rule against a standalone "Accessibility" page; AGENTS.md's standing instruction to preserve accessibility as a design-system requirement, not a marketing layer.
*Digital consequence:* accessibility decisions (contrast, focus states, motion, structure, plain language) are made at the same design pass as everything else, by the same people, not audited in afterward. There is no separate "accessible mode."
*Anti-pattern:* an expressive typographic system with an unreadable body-text fallback bolted on for compliance.

**DNA 4 — The person arriving adapts the environment to fit them; the environment does not require the person to adapt to it.**
*Evidence:* Manuela's testimony, quoted directly: "il cliente si adattava al personale, non il contrario" — an explicit inversion of the usual service relationship; Cena al Buio's decade-long mechanism, which inverts who is assumed to see; the content model's insistence that a place's operator does not get to overstate control of a space (Parco) it merely shares.
*Digital consequence:* interface controls (text size, motion, contrast, language) should feel like the site accommodating a specific visitor's way of moving through it, not a visitor being routed through one fixed path with an "accessibility settings" escape hatch bolted to a corner.
*Anti-pattern:* a single default experience with all adaptation pushed into a separate settings panel nobody discovers.

**DNA 5 — Discontinuity is told, not smoothed over; closure is a fact, not an embarrassment.**
*Evidence:* Working Paper v0.3 §11's explicit refusal to hide Via Polese's forced closure or da Osvaldo's economic failure; the content model's Invariant 13 (a page naming a historical place must state, in the same view, that it is closed and since when).
*Digital consequence:* History content shows real discontinuity, not a smoothed "since 2015, continuously..." narrative. A closed venue is never presented ambiguously.
*Anti-pattern:* an "our story" timeline that quietly omits the venues that failed.

**DNA 6 — Translation happens through gesture, object and infrastructure, not only through an interpreter standing between two people.**
*Evidence:* the 2015 incorporation deed's bilingual structure, built into the company's own founding paperwork; the book's illustrated LIS hand-signs for ordinary drink names, used as the actual ordering mechanism, not decoration; "non tutto doveva passare dalla voce," captioning a photo of someone typing on a device instead of speaking.
*Digital consequence:* the site should offer more than one channel to the same practical action (booking, asking a question, understanding an event) — text, structure, and where genuinely useful, a non-verbal path — without any one channel being treated as the "real" one and the others as accommodations.
*Anti-pattern:* a single contact-form-only channel with a note that "alternative formats are available on request."

**DNA 7 — The environment is inhabited porously: the line between building it and using it is not sharp.**
<br>*Evidence:* Maurice's testimony, "non c'era una separazione netta tra chi costruiva il posto e chi ci passava," and "sembrava più un piccolo villaggio che un locale"; the first build team including people who would go on to work there.
*Digital consequence:* the site should let a visitor sense that the practice is made by the people in it (named, specific, current), not administered at them by an anonymous institutional voice. This does not mean a public staff roster (explicitly excluded per Institutional Architecture v1 §21) — it means specific, attributable practice wherever the evidence allows it.
*Anti-pattern:* faceless institutional copy with no attributable voice anywhere.

**DNA 8 — Practice runs ahead of the language used to describe it, in both directions.**
*Evidence:* Working Paper v0.3 §12's own finding that the organisation's 2016–17 public voice sometimes lagged its practice, and its 2024–25 voice sometimes outran what any one activity demonstrated; the seven propositions themselves, only formulated in 2026 by reading back over eleven years of practice already done.
*Digital consequence:* copy should describe specific, checkable practice before it reaches for abstract claims. A claim earns its adjective; the adjective doesn't come first.
*Anti-pattern:* "inclusion," "empowerment," "breaking barriers" used as a substitute for a specific instance.

**DNA 9 — A place's condition is never inferred from another place's, and current is never confused with historical.**
*Evidence:* the content model's whole invariant set (a venue's NOTICE never implies an organisation-wide state; a historical place never renders as current); the working paper's own two-track discipline (practice vs. legal entity) as, in its words, "arguably the organisation's actual intellectual property."
*Digital consequence:* current-state and historical content must be visually and structurally distinguishable at a glance, not just correctly labelled in a caption a visitor might not read.
*Anti-pattern:* one visual treatment applied uniformly to both a live event listing and a decade-old archival photo essay.

---

## 6. Experience character / tensions

Not adjectives — held tensions, each kept deliberately unresolved because collapsing to one side loses something the evidence supports.

**PRECISE ↔ PROVISIONAL.** The book pairs a formally dimensioned wheelchair-ramp technical drawing with hand-taped floor mockups in the same physical building. The site should be capable of stating a measured fact plainly (a door width, a verified date) while also stating plainly that another fact is not yet known — both in the same visual register, neither apologised for. Losing PRECISE reads as vague and unaccountable; losing PROVISIONAL reads as falsely finished, exactly the failure mode Working Paper v0.3 keeps warning against.

**ORDINARY ↔ UNEXPECTED.** A bar that serves cappuccino and a bar with a SpaceX rocket-test poster and a "signal, deviation in frequency" mural are the same room. The site should let ordinary, practical information (hours, menu, how to book) sit unremarkably next to material that is genuinely surprising (a bilingual incorporation deed, a decade-long dark-dining format), without either one performing surprise for its own sake. Losing ORDINARY makes the site exhausting to actually visit; losing UNEXPECTED makes it a generic listings page.

**QUIET ↔ DENSE.** The book's own pacing alternates empty, taped-out rooms with "sembrava più un piccolo villaggio" crowd density. The site needs both states: calm, spare pages for orientation and practical decisions, and denser, richer pages for programme, history and evidence. Losing QUIET produces fatigue before a visitor decides anything; losing DENSE makes a decade of practice look thin.

**STRUCTURED ↔ ADAPTABLE.** Measured ramps and floor plans exist beside tape marks that get moved and remeasured. The content model's whole freshness/status machinery is this tension formalised: a stable structure (the entity model) holding values that are expected to change and be corrected. The site's grammar should feel like a structure built to be corrected, not a structure that resists correction.

**INSTITUTIONAL ↔ HOSPITABLE.** A cooperative registered in 2022, a 36-month public-administration pact, and MePA procurement categories exist alongside a bar where "ordering diventava un piccolo esercizio di traduzione" between strangers. A funder reading the ORGANISATION page and a tonight-visitor reading Visit should never feel they landed on two different organisations, even though the register genuinely differs (Institutional Architecture v1 §5 already licenses this layering). Losing INSTITUTIONAL undermines the funder/Comune reader; losing HOSPITABLE undermines everyone else.

**CURRENT ↔ ARCHIVAL.** Ten years of material and this exact week's opening status must never blur (DNA 9). Held as a tension rather than resolved toward one side because the organisation's credibility rests on both: the depth of the archive earns trust, and the reliability of the current facts earns a visit. Full model in §21.

Deliberately not adopted: "calm ↔ alive" and "hospitality ↔ experiment" as separate tensions — on inspection both collapse into ORDINARY ↔ UNEXPECTED and QUIET ↔ DENSE respectively, and keeping them as duplicate pairs would dilute rather than sharpen the list.

---

## 7. Space

**What it means for L'Altro Spazio:** every physical environment in the evidence base was measured, taped, prototyped, and repeatedly reconfigured around who was actually using it — Parco 11 Settembre's seasonal reuse of the same park for a decade; Via Nazario's construction sequence; the explicit "gallery with a bar" concept where the bar was one part of a larger activity, not the whole footprint.

**How it could be expressed digitally:** variable density across pages rather than a uniform card grid everywhere; generous, deliberate whitespace on decision-critical pages (Visit, hours, accessibility) so the *few* facts that matter there aren't crowded by ambient content; denser, more occupied layouts on History/Approach where a decade of material genuinely earns the space; content that visibly *occupies* a region of the page (a block with real weight and edges) rather than diffusing evenly across it, echoing rooms with distinct identities (Bar / Kitchen / Poetry Room / Play Room in the book's own floor plan) more than one continuous open-plan feed.

**What should remain book-specific:** the literal floor-plan diagram as a graphic motif; architectural cross-section drawings; the specific measurement annotations (0.96m, 1.09m) as decoration.

**What would become a gimmick:** a fake blueprint aesthetic (grid overlays, technical-drawing typefaces) applied wholesale to a marketing page; "spatial" used as a synonym for scroll-triggered parallax.

**Accessibility consequences:** variable density must never come at the cost of a predictable, linear reading/tab order; a visually "occupied" region must still resolve to clean, sequential structure for a screen reader or keyboard user. Space as a design value earns nothing if it produces disorienting DOM order.

---

## 8. Line / path / connection

**What it means for L'Altro Spazio:** the book is full of drawn connections that *do work* — the incorporation deed's translation clause linking two languages within one legal instrument; the RAMP beer label's own copy, which frames a physical ramp and a bottle as two forms of the same underlying idea (removing a barrier that shouldn't have existed); the wall mural's "signal, a deviation in frequency" linking sound and Deaf experience.

**How it could be expressed digitally:** connective devices that have an actual function — a visible link from an EVENT back to the WORK it manifests from (per the content model's own manifestation pattern), a relationship shown between a current programme and the historical case study it grew out of, a route from a PLACE to its ACCESS PROFILE. The line exists because two records are related, not because the page needed a graphic accent.

**What should remain book-specific:** the cover's dotted line motif; the constellation-style wall mural reproduced as a literal background pattern; the specific hand-drawn "signal" imagery.

**What would become a gimmick:** dotted lines used as generic section dividers with no relationship being expressed; an animated "connection-forming" transition used purely for visual flourish between unrelated pages.

**Accessibility consequences:** any line/connector used to communicate relationship must have a text equivalent (a caption, a linked label) — the connection cannot exist only as a decorative SVG a screen reader skips past.

---

## 9. Typography

**What it means for L'Altro Spazio:** the book's typography is loud, compressed, and spatially active — rotated headline blocks, extreme scale contrast, uppercase compression used for emphasis. That is legitimate print-editorial voice, not a transferable lesson about letterforms. The deeper, transferable lesson is different: the book pairs that expressive register with plain, first-person, unpunctuated quotes ("Non tutto doveva passare dalla voce") set in a completely calm, readable serif/humanist face — two registers, not one loud one.

**How it could be expressed digitally:** two coexisting voices, not one compromise voice. A stable, highly legible functional voice for practical information, hours, menu, access facts, event listings — plain hierarchy, generous line length, no compression. A second, more expressive editorial voice reserved for Our Approach, History and case-study material, where scale contrast and confident weight can carry institutional character — but never compressed body copy, never rotated essential content, never sacrificing x-height or line spacing for effect.

**What should remain book-specific:** extreme uppercase compression for body text; rotated headline blocks; the specific display face used in the book (not evaluated here and not assumed as a brand standard).

**What would become a gimmick:** rotating any functional information (hours, an address, a price); using all-caps for anything longer than a short label; choosing a typeface family merely because "the book used something like this."

**Accessibility consequences:** body text never falls below accessible size/contrast/line-height minimums regardless of which voice is active; no essential content is ever rotated or compressed to the point of requiring effort to parse; both voices must survive user font-size overrides and zoom without breaking layout.

---

## 10. Image / archive

**What it means for L'Altro Spazio:** the evidence base is a genuine mix of image *kinds* — grainy phone photos of an empty room in 2015, a technical wheelchair-ramp CAD drawing, hand-drawn LIS pictograms used as functional signage, a magazine clipping, a beer label illustration, blurred low-light event photography, a laser-cut wood sign. None of these were shot to look like each other. That heterogeneity is itself evidence of a practice that documents as it goes, in whatever medium was at hand, rather than commissioning a single polished house style after the fact.

**How it could be expressed digitally:** an image system that keeps *source and status legible* rather than harmonising everything into one Instagram-consistent filter. Concretely, distinguish at minimum: CURRENT DOCUMENTARY (recent, dated, real venue/event photography), ARCHIVAL (pre-dated material, clearly marked with its year), PROCESS (construction, prototyping, testing — legitimately rough), DIAGRAM/PLAN (functional, technical, not decorative), ARTWORK/POSTER (exhibition and programme material, credited), EVENT IMAGE (dated, tied to a specific occurrence). Each kind can have its own light treatment (a date stamp, a small kind-label, a border convention) without forcing a single glossy grade across all of them.

**What should remain book-specific:** the specific grain/exposure character of the 2015 phone photos as a deliberate "look" to imitate; captions styled exactly like the book's italic photo-credit lines.

**What would become a gimmick:** applying a fake-vintage filter to make current photography look archival; treating every image the same way regardless of what it actually documents (this is precisely the "one Instagram-like treatment applied to everything" failure the brief warns against).

**Accessibility consequences:** every image kind needs real alt text describing content and, where relevant, its status (a screen-reader user should be able to tell "this is a 2015 construction photo" as easily as a sighted user reading a small date label); process/archival images with genuinely low legibility (the grainy 2015 shots) need alt text that compensates rather than merely restates "photo of empty room."

---

## 11. Rhythm / density

**What it means for L'Altro Spazio:** the book's own pacing moves between empty rooms, dense crowd photography, quiet single-quote pages, and information-dense drink-sign grids — deliberately, not accidentally. The physical practice itself alternates quiet daytime hours with dense event nights, seasonal Parco density with year-round Nazario Sauro steadiness.

**How it could be expressed digitally:** controlled variation in density and scale from page to page and section to section — Home stays lean and fast (per the homepage argument already set by Institutional Architecture v1 §8); Visit stays sparse and decision-focused; History and Our Approach are allowed to get denser, richer, slower; a single quote or fact can occupy a whole screen's worth of restraint the way the book lets one line of testimony stand alone. What must not vary is navigation predictability — density changes the *content*, never the *controls*.

**What should remain book-specific:** the specific page-turn pacing of a physical book (a full-bleed image followed by a stark text page) as a literal sequence to imitate on scroll.

**What would become a gimmick:** identical card-grid sections repeated down every page (explicitly named as an anti-pattern in the brief); scroll-triggered density changes used as a performance rather than a genuine content decision.

**Accessibility consequences:** density changes must never depend on motion to register — a user with reduced-motion preferences or a screen-reader user must get the same density/rhythm information from structure and heading levels alone, not from an animated reveal.

---

## 12. Translation / interface

**What it means for L'Altro Spazio:** translation is the single most substantively evidenced idea in the whole institutional record — a founder's own lived experience of being routed through interpreters and never quite arriving in the room; a company's own incorporation deed built bilingually because one founder could not read Italian; a decade of drink-order signage using LIS hand-shapes as the actual mechanism, not an accommodation layered on top.

**How it could be expressed digitally:** genuine multiple routes to the same meaning without duplicating content. A visitor should be able to approach one WORK (e.g. Cena al Buio) through a quick practical fact (a date, a booking link), a one-line description, or a deeper case-study link — three depths of the *same* record, not three different records. An EVENT should visibly connect back to its WORK; a WORK should visibly connect forward to its HISTORY ENTRY, letting a visitor go as deep as they want without ever hitting a dead end or a forced detour through institutional theory. Current activity should lead naturally into durable practice (What's On → Our Approach), and a place's accessibility conditions should be reachable from Visit without reading like a separate institutional claim bolted alongside it.

**What should remain book-specific:** "translation" used as a literal chapter theme with its own illustrated glossary of gestures — legitimate as archival material, not as a website section to be built.

**What would become a gimmick:** a decorative "translate this page" toggle with no real multilingual content behind it; using the word "translation" as an abstract slogan rather than building the actual multiple-depth navigation it should produce.

**Accessibility consequences:** every "multiple route to the same meaning" pattern must resolve to standard, predictable navigation semantics (real links, real headings, a real reading order) — this is a content-architecture idea, not licence for novel, hard-to-learn interaction patterns.

---

## 13. Accessibility as creative system

Accessibility is not the pass performed after the creative system is settled; it is one of the constraints the creative system is designed to satisfy from the first sketch, exactly as DNA 3 and DNA 4 require and as the Greenfield Content Model's own nine-dimension ACCESS PROFILE (never a boolean) already structurally enforces at the data layer.

Concrete creative commitments carried from §7–§12 into a single standing discipline:

- **Keyboard and focus:** every interactive element (including any density/rhythm transition, any "expressive voice" heading treatment) has a visible, high-contrast focus state and a logical tab order, tested before any visual polish is signed off.
- **Zoom and reflow:** the two-voice typographic system (§9) must survive 200%+ zoom and user font-size overrides without breaking layout or losing content.
- **Reduced motion:** any density/rhythm change (§11) or connective-line animation (§8) has a static equivalent; `prefers-reduced-motion` is honoured by default, not offered as an opt-out.
- **Contrast and color:** the expressive editorial voice (§9) and any warm/textural image treatment (§10) never drop below accessible contrast for text-over-image compositions; color is never the only carrier of a status distinction (current vs. historical, verified vs. to-be-confirmed).
- **Screen readers:** image-kind legibility (§10), connective relationships (§8), and status/freshness distinctions (data-model concepts from the Content Model) all have real text equivalents, not only visual conventions.
- **Plain language and predictability:** the functional typographic voice (§9) and Visit-page density (§11) prioritize a first-time, unfamiliar visitor's ability to find hours, address, and access facts without parsing institutional register.
- **No separate "accessible mode":** every commitment above is a property of the one system, not a fork of it. This is the structural test the whole creative direction is held to; see Quality Gate 6.

The question this section keeps live, per the brief: *how expressive can the system be while remaining robust and understandable?* The answer given by the recommended direction (§18) is: expressive at the level of typographic voice, image-kind legibility, and density variation; disciplined at the level of structure, navigation, and interaction — expression lives in *what is said and how it looks*, not in *how hard it is to operate*.

---

## 14. Creative Territory A — MEASURE

**Core idea:** the site behaves like an honestly measured space. Every claim that matters carries a visible sense of how it is known — verified, dated, provisional — the way a technical drawing carries a dimension line, but expressed as a genuine interface convention rather than a decorative blueprint.

**Why it belongs to L'Altro Spazio:** this is the most direct digital analogue of DNA 2 and DNA 9, and it maps almost exactly onto the Content Model's own provenance/freshness/status apparatus — a rare case where the semantic model and a visual language are naturally the same idea, expressed twice.

**Relationship to the book:** *Shared DNA* — the book's own wheelchair-ramp technical drawing sits directly beside tape-marked floor mockups; both instrumentalize precision at the service of real bodies and real access, never precision as aesthetic performance. *Not borrowed* — the book's actual blueprint linework, dimension-line typography, and CAD drafting conventions are print-specific artifacts, not a visual system to reproduce on screen.

**Spatial logic:** generous, quiet whitespace on decision pages (Visit, hours); a page's content occupies clearly bounded regions rather than diffusing evenly; density is earned by evidence, not filled by decoration.

**Typographic logic:** the two-voice system from §9, weighted toward the functional voice — plain, highly legible, calm. The expressive voice appears only where the evidence itself is expressive (a quoted testimony, an unusual historical fact), not as ambient brand personality.

**Image logic:** the multi-kind system from §10 in full — every image visibly carries what kind it is and when it's from.

**Color logic:** a restrained, mostly neutral palette with one or two functional accent colors reserved *only* for status meaning (e.g., a distinct, consistent treatment for "current" vs. "historical" vs. "needs verification") — color as information, not mood. **Session-3 correction:** a cooler, whiter neutral (not the book's cream/charcoal register) is now the recommended starting base — see §19's Color strategy and the Prototype Test Report §20–22 for the visual finding that prompted this.

**Line/graphic logic:** connective lines only where a real relationship exists (§8); no decorative dotted-line motif.

**Interaction logic:** calm, predictable, click-to-reveal rather than hover-dependent or scroll-triggered; every status/freshness distinction is visible without requiring interaction to discover.

**Motion logic:** minimal; used only to clarify a state change (a notice appearing, an accessibility fact updating), never for entrance choreography.

**Current-vs-archive logic:** the cleanest possible expression of DNA 9 — a small but consistent visual marker (not just a caption) distinguishes current from historical content wherever they could plausibly appear near each other.

**Accessibility consequences:** naturally strong — the whole territory is built from the same discipline accessibility already demands (explicit, checkable, non-ambiguous states).

**How "Visit" feels:** quiet, precise, quick to answer "can I go, and what will I find."

**How "What's On" feels:** a clean, dated, unambiguous list; nothing invented to fill empty weeks.

**How "Our Approach" feels:** specific and evidenced — claims arrive with their instance attached (DNA 8), not as abstraction first.

**How "Work With Us" feels:** exactly labelled by status (current / proposed / experimental), which reads as credibility rather than caution to a funder or partner.

**Main strength:** near-perfect alignment with the content model's own discipline; nothing in this territory requires inventing a display convention the data can't actually support.

**Main risk:** can read as cold, bureaucratic, or "sterile institutional white site" if the restraint isn't paired with genuine warmth somewhere (this is exactly why §18 grafts lessons from Territory B rather than adopting A in pure form).

**How it could become a gimmick:** dimension-line/annotation styling applied decoratively to content that isn't actually a measured fact; a "verified" badge system so pervasive it starts to look like a design trend rather than an honesty mechanism.

---

## 15. Creative Territory B — ENCOUNTER

**Core idea:** the site is organised as adjacent rooms with porous boundaries rather than one continuous scroll or a single template repeated — echoing "sembrava più un piccolo villaggio che un locale" and the literal floor plan naming distinct rooms (Bar, Kitchen, Poetry Room, Play Room) under one roof.

**Why it belongs to L'Altro Spazio:** this is the most direct digital analogue of DNA 7 — the porous line between building the place and using it — and of the QUIET ↔ DENSE and ORDINARY ↔ UNEXPECTED tensions in §6.

**Relationship to the book:** *Shared DNA* — the practice of mixing hospitality, art, work and social encounter in one continuous space without segregating them into separate visual worlds (Task 1's own hypothesis, and genuinely evidenced: exhibitions, music, food, and disability-community programming all ran through the same rooms). *Not borrowed* — the specific interior materials (birch wood, hanging plants, chalkboard menus) belong to Via Nazario Sauro as a physical venue, not to the organisation's digital identity; reproducing them on screen would be exactly the venue-photography-site risk the brief warns against.

**Spatial logic:** content organised into zone-like sections with their own character (a "programme" zone feels different from a "history" zone) but soft, legible connections between them — never hard page walls that make a visitor feel they've left the site.

**Typographic logic:** the expressive voice used more generously than in Territory A — first-person quotes, testimony, and specific named voices (DNA 7) given real typographic weight, not just italicised as a caption.

**Image logic:** leans toward CURRENT DOCUMENTARY and EVENT kinds more heavily; texture and warmth foregrounded, but never at the cost of the multi-kind legibility from §10.

**Color logic:** warmer, more varied per zone — different sections can carry a distinct (still restrained, still accessible) accent, echoing different rooms having different light.

**Line/graphic logic:** soft zone-dividers rather than the sharp status-marking lines of Territory A.

**Interaction logic:** more textural, more willing to let a visitor browse and encounter rather than query and retrieve.

**Motion logic:** gentle, ambient — a photograph settling into place, not a choreography.

**Current-vs-archive logic:** weaker by default than Territory A — zones risk blurring current and historical material if not deliberately disciplined (this is the specific reason Territory A is recommended as primary, with only rhythm/warmth lessons grafted from here, in §18).

**Accessibility consequences:** zone-based density needs careful heading-level discipline so structure survives for screen-reader and keyboard users even when visual boundaries are soft.

**How "Visit" feels:** warm and specific, closer to "here is the room you'd actually walk into."

**How "What's On" feels:** textured and social, closer to the practice's own event density.

**How "Our Approach" feels:** told through named voices and testimony, more narrative than Territory A.

**How "Work With Us" feels:** relational — "who you'd be meeting" more than "what status this has."

**Main strength:** the strongest at conveying that this is a living, inhabited practice rather than an administered institution.

**Main risk:** bar-reduction and generic-hospitality-startup risk (warm wood, plants, chalkboard menus is a real aesthetic category already, unrelated to disability practice) if the zone metaphor isn't disciplined by the same status/freshness rigor as Territory A.

**How it could become a gimmick:** literal room-shaped page sections (a "Poetry Room" tab) that reproduce the book's floor plan as navigation, rather than translating the underlying porousness into a genuinely web-native structure.

---

## 16. Creative Territory C — SIGNAL

**Core idea:** content exists as multiple simultaneous channels rather than one narrative thread — text, structure, and visual relationship treated as parallel "signals" of the same meaning, with the interface foregrounding route-choice the way translation offers parallel modes of one idea, echoing the mural described as "a signal, a deviation in frequency."

**Why it belongs to L'Altro Spazio:** the most direct digital analogue of DNA 1 and DNA 6 — meaning routed through more than one channel, translation as constitutive rather than remedial — and the deliberate risk-taking direction requested by Task 12.

**Relationship to the book:** *Shared DNA* — the same underlying idea (translation, multiple simultaneous channels to one meaning) that produced the bilingual incorporation deed and the LIS drink-sign system. *Not borrowed* — the specific hand-drawn constellation mural, the rocket-poster imagery, and the graffiti-lettering name-test sheet are print/gallery artifacts of a specific physical wall and a specific draft process, not a transferable graphic system.

**Spatial logic:** asymmetric layouts that make a relationship visually legible (a piece of content sitting deliberately near what it relates to, not centered in isolation).

**Typographic logic:** the most willing to let scale and weight carry relationship (a related fact set smaller and adjacent, not hidden in a dropdown).

**Image logic:** the same multi-kind system as §10, but with kinds allowed to sit in visible dialogue on the same screen (a current photo and an archival one, deliberately paired to show change) rather than segregated by page.

**Color logic:** most willing to use color for wayfinding across a "channel" (e.g., a consistent thread color connecting a WORK to its manifestations across pages).

**Line/graphic logic:** functional connective lines given the most visual prominence of the three territories — genuinely earning Task 5's "function before decoration" test, since here the connections *are* the content, not an accent to it.

**Interaction logic:** the most exploratory — a visitor can follow a relationship sideways (from an event to its programme, from a programme to its history) as a first-class interaction, not a footnote link.

**Motion logic:** used more than the other two territories, but strictly to reveal a relationship (a line drawing itself between two related items) — still bound by the reduced-motion floor in §13.

**Current-vs-archive logic:** requires the most deliberate discipline of the three — the very willingness to put current and historical material in visible dialogue is powerful *and* the riskiest place for DNA 9 to slip.

**Accessibility consequences:** the highest risk of the three territories — asymmetric layout and relationship-first navigation must be proven, not assumed, to survive keyboard and screen-reader use; this is exactly why Task 12's "no novel, hard-to-learn interaction pattern" floor matters most here.

**How "Visit" feels:** the least suited of the three territories to Visit's job — a tonight-visitor needs Territory A's calm precision, not a relationship-exploration interface, which is itself informative about this territory's proper scope.

**How "What's On" feels:** genuinely interesting — a visitor could see an event in relation to its programme's whole decade-long arc without leaving the page.

**How "Our Approach" feels:** the strongest of the three territories at making Proposition 2 (translation) *felt* rather than *stated*.

**How "Work With Us" feels:** could show a prospective partner the actual shape of the practice (how programmes, projects and services interrelate) more vividly than either other territory.

**Main strength:** the only territory that makes translation a structural, felt experience rather than a described value — the genuine creative risk the brief asks for.

**Main risk:** design-school risk — interesting to designers, harder for a first-time or a not-especially-curious visitor to parse quickly; the clearest way this creative direction could fail the "does expression reduce orientation" quality gate.

**How it could become a gimmick:** relationship-lines and asymmetric composition used everywhere regardless of whether a real relationship exists, becoming exactly the kind of decorative graphic device Task 5 rules out.

---

## 17. Territory risk comparison

| Risk | A — Measure | B — Encounter | C — Signal |
|---|---|---|---|
| Book-mimicry | Low — rejects the book's blueprint linework explicitly | Low — rejects the book's specific interior materials | Medium — closest in spirit to the book's own mural/deed themes; must actively resist reproducing its literal imagery |
| Generic-NGO | Low — status/freshness discipline is distinctive, not templated | Medium — warm-hospitality-zone layouts exist widely outside this context | Low — relational structure is not a common NGO template |
| Generic-cultural-venue | Low | Medium — zone-based warmth edges toward contemporary-café-culture aesthetics | Low-Medium — asymmetric relational graphics can read as generic gallery-site design if undisciplined |
| Bar/hospitality-reduction | Low | **Highest** — the territory most literally derived from the physical bar's own materials | Low |
| Design-school | Low-Medium — restraint can tip into cold minimalism read as "design-forward" rather than institutional | Low | **Highest** — the explicitly risk-taking territory, most likely to read as designed for designers |
| Disability-symbolism | Low across all three — none of the territories proposes using wheelchair/sign-language/Braille imagery as decorative branding; this is a standing anti-pattern (§26), not a territory-specific risk |
| Theory-overload | Low — leads with specific instance over abstraction (DNA 8) | Low | Medium — relationship-first navigation risks surfacing institutional interconnection before a casual visitor wants it |
| Navigation | Low | Low-Medium — soft zone boundaries risk disorientation if not disciplined | **Highest** — asymmetric, relationship-first interaction is the direction most likely to reduce orientation for the goal of expression |
| Accessibility | Low — the territory most naturally aligned with accessibility discipline | Low-Medium — zone density needs deliberate heading/structure discipline | **Highest** — novel interaction patterns are the hardest to prove accessible |
| Archive-nostalgia | Low — freshness/status discipline actively prevents nostalgic flattening | Medium — warm, textural image treatment could drift toward soft-focus nostalgia if undisciplined | Low — dialogic current/archive pairing keeps both states active rather than nostalgic |

Read across the row totals: Territory A is the safest on every axis except the risk of reading as cold; Territory B carries the single largest identifiable risk (bar-reduction); Territory C carries the two risks (design-school, navigation, accessibility) most directly in tension with the brief's own non-negotiable floors (accessibility, orientation).

---

## 18. Recommended direction

**Recommendation: Territory A — Measure — as the primary system, with Territory B's rhythm, warmth and porousness lessons deliberately grafted in for tone. Territory C is not adopted for the launch system but is the clearest candidate for a later, narrower prototype (§28).**

**Why this one:** Measure is not a safe default chosen to avoid a decision — it is the territory whose core logic (visible, checkable, honestly-dated claims) is *already* the exact logic the Greenfield Content Model was built around (status never inferred, freshness never silent, provenance always attached). Choosing any other territory as primary would mean building a visual system that fights the semantic system underneath it. Measure is also the territory best positioned to pass the accessibility, navigation, and archive-clarity quality gates without special pleading — it is disciplined by construction, not disciplined by afterthought.

Measure's honestly-named risk — reading as cold or bureaucratic — is real, and is exactly why this recommendation is a graft, not a pure adoption: Territory B's specific lessons on (a) letting named, first-person voice carry real typographic weight, (b) allowing warmer, zone-appropriate color variation between sections rather than one flat palette, and (c) permitting genuine density and textural richness on History/Approach pages, are folded into the recommended system in §19. This is a synthesis that produces a clearer system than either territory alone — Measure supplies the discipline that keeps status, currency and provenance legible; Encounter supplies the warmth that keeps the discipline from reading as institutional distance — not a hedge that avoids choosing.

**What to keep:** the whole of Territory A's spatial, typographic-functional-voice, image-kind, and current/archive logic; Territory B's warmth, named-voice weight, and zone-appropriate density variation.

**What to reject:** Territory B's literal room-based navigation and its specific interior materials (wood, plants, chalkboard) as a design vocabulary; Territory C's asymmetric relationship-first navigation and its heavier motion/graphic-line prominence, for this phase.

**What remains unresolved:** whether a Territory-C-style relationship view belongs anywhere in the launch system as a secondary, opt-in exploration mode (e.g. on a WORK or History page) rather than a primary navigation model — flagged as a prototyping question in §28, not decided here, because it depends on how the concrete content-model schema and the eventual technical architecture actually support relationship queries.

---

## 19. Recommended web grammar

Concrete, cross-cutting system for the recommended direction. Not implementation code — a coherent set of design decisions the next (visual/component) phase should build from.

**Spatial composition:** decision-critical pages (Visit, hours, accessibility, contact) are spare and quiet, generous whitespace, few competing elements. Depth pages (History, Our Approach, Evidence) are allowed real density — multiple content kinds coexisting on one page — but always organised into clearly bounded, named regions, never a single undifferentiated scroll. Homepage follows the ordered argument already set by Institutional Architecture v1 §8 (place+status first, specificity second, activity third, audience routing fourth) expressed spatially as increasing density down the page, thinning back out rather than escalating forever.

**Typographic hierarchy:** two voices (§9). Functional voice: a single, highly legible sans or humanist face family, used for all practical information, navigation, labels, and data (hours, addresses, dates, status). Editorial voice: a second face with more character and confident weight, used only for quoted testimony, essay headlines on Our Approach/History, and case-study titles — never for functional information, never compressed, never rotated. A visible, consistent typographic convention marks *when* the editorial voice is speaking (e.g., it only ever appears attributed to a source or a clearly bounded essay block), so a visitor always knows which register they're reading.

**Image behaviour:** every image carries a visible kind-marker (a small, consistent label or border convention — CURRENT / ARCHIVAL / PROCESS / DIAGRAM / ARTWORK / EVENT) and, where dated, its date, rendered legibly, not buried in metadata only a screen reader sees. No single filter/grade applied uniformly across kinds. **Session-3 addition — verification-metadata restraint:** a dated "confirmed/checked" verification line is required on facts a visitor is about to act on (hours, access, booking status, event dates, a claim's freshness) and on archival dating, but is *not* required on every ordinary current-documentary image caption — stamping a verification line on every photograph in a dense, social page made Measure's honesty apparatus read as a provenance interface exactly where Encounter is meant to lead (Prototype Test Report §19, Study 6, and §27 Edit 2). Ordinary documentary captions in dense/social contexts may simply state what they show.

**Archive behaviour:** History and archival material live in a visually distinct register from current-state pages — a consistent, restrained convention (e.g., a slightly different background treatment or a persistent "historical" marker in the page's own furniture, not just a caption) that a visitor recognises within a second of arriving, satisfying DNA 9 as an experience, not only as a data rule.

**Color strategy — corrected on session-3 visual review:** a restrained neutral base, but **cooler and whiter than the book's own cream/off-white/charcoal register**, paired with one strong, disciplined status-signal accent (darkened to pass AA as text, not only as a non-text mark). The original recommendation treated the book's cream/charcoal base as a legitimate, independently-arrived-at convergence rather than a borrowed skin; having now viewed the actual book PDF directly beside the prototype lab (Prototype Test Report §20, "book/website sibling test"), that base reads as the same paper and ink as the book, not as coincidental convergence, and is withdrawn as the default. ENCOUNTER's warmth (Territory B's graft) should instead come from photography and modest, disciplined per-section accent variation, not from a warm base tone — so History still doesn't feel like it belongs to a colder site than Visit, without the base itself risking imitation.

**Lines / connections / graphic marks:** used only where an actual relationship exists between two records (an EVENT and its WORK; a HISTORY ENTRY and the ARTICLE that cites it) — always with a text equivalent, never as a section divider or generic accent.

**Navigation character:** predictable, shallow, and consistent regardless of how dense a given page's content is — the primary nav from Institutional Architecture v1 §7 (Home / Visit / What's on / Our approach / Work with us, with Organisation / History / Research & evidence / Contact in the footer) is the structural backbone; density and voice vary by page, controls do not.

**Interaction:** click-to-reveal over hover-dependent; no essential information ever gated behind a hover state (which fails on touch and for many assistive-technology users); status/freshness distinctions visible without interaction.

**Motion:** minimal, used only to clarify a state change (a notice appearing/expiring, an accessibility fact updating) or a gentle image settle-in on Encounter-graft sections; always with a static, immediate equivalent; `prefers-reduced-motion` honoured by default.

**Current status / notice expression:** a NOTICE (per the Content Model) renders with a clear, high-contrast, plainly worded convention scoped visibly to exactly the entity it targets (never ambiguous as to whether it's about the whole organisation or one place) — echoing DNA 9 and Invariant 9 of the content model directly in the visual system.

**Event presentation:** dated, unambiguous, always showing date-status (scheduled/occurred/cancelled/postponed) plainly, never a bare listing with an implied "upcoming."

**Work/project/service relationships:** a WORK's manifestations (its events, its service offering, its history) are visibly reachable from the WORK's own page without duplicating its description — satisfying DNA 1 as a felt experience, not just a data rule.

**Accessibility information:** rendered per the nine-dimension model, each dimension showing its own condition and its own "last verified" state honestly, including a plainly worded "to be confirmed" state — never a blanket badge (§13, DNA 2).

**Long-form reading:** History and Our Approach essays use the editorial typographic voice at a generous, book-like measure (line length, leading) for genuine long-form comfort — the one place a print-reading sensibility is a legitimate, non-gimmicky lesson to carry over.

**Responsive adaptation:** density and spatial composition adapt as genuine reflow (regions restack, whitespace compresses proportionally) rather than simple breakpoint shrinking — responsive behaviour treated as the digital equivalent of a space adapting to who's using it (DNA 4), not merely fitting a smaller screen.

---

## 20. Web-native interaction opportunities

Five ideas that could only really exist digitally, each solving a real communication problem rather than adding complexity for its own sake.

1. **Live availability read, never a static "open" claim.** Per the Content Model's own derived availability-status logic (existence + operating pattern + season + active notice, explicitly never a stored field), the site can show Via Nazario's and Parco's current state computed live from canonical data, auto-reverting the moment a closure notice expires — something a book, or a static page, structurally cannot do. Solves: the exact "closure banner survives three weeks past relevance" failure the content model was built to prevent.

2. **Manifestation-aware programme pages.** A WORK page (e.g. Cena al Buio) that shows, without duplicating its own description, whichever manifestations currently exist — a public date if one exists, a "currently bookable privately" note if only the service manifestation is live, or neither with an honest "no current dates" state. Solves: the specific problem the real-content stress test found (a format can be a live service with zero public events, and a static page can't express that gracefully without either lying or looking broken).

3. **Freshness-aware display, not just freshness-aware data.** A programme whose evidence has gone quiet (per the Content Model's CURRENT → REVIEW_DUE → STALE mechanism) can visibly soften its own call-to-action rather than either lying (still shown as freshly current) or disappearing (losing real institutional memory). Solves: the "proposal reads as delivered" and "stale reads as fresh" failure modes named directly in Content Model Invariant 4.

4. **Depth-aware routing, not duplicated content.** A single WORK/EVENT/PLACE record answers a 5-second question, a 30-second question, and a 10-minute question via genuinely different views of the same canonical fact (a quick card, a fuller description, a linked case study) — satisfying DNA 1 without ever forking the underlying content into a "simple version" and a "full version" that drift out of sync with each other over time, which a static book or a hand-maintained page cannot guarantee.

5. **Notice-scoped, auto-expiring state, rendered as an actual experience.** Because a NOTICE (per the Content Model) always carries an explicit scope, an effective window, and an expiry, the interface can show a visitor precisely what is different right now about one place, one event, or one accessibility dimension, without that exception ever leaking into an unrelated part of the site or surviving past its relevance — something no static publication can do, and something the old site's own "completely accessible" and fabricated-statistics failures show a hand-maintained system reliably fails to do either.

---

## 21. Current vs. archive

A visitor must understand, within a second, whether they are looking at THIS IS HAPPENING NOW or THIS IS PART OF THE HISTORY.

**Visual mechanism (not just a caption):** the recommended grammar's archive register (§19) — a consistent background/furniture convention distinguishing historical pages/sections — combined with the Content Model's own hard separation of surfaces (History is never rendered on a "current" surface; a historical PLACE never appears in a current Visit listing; Invariant 13 forces closure status into the same view as any historical name).

**What must never happen:** sepia-nostalgia treatment applied to make the archive "feel old" (this would be exactly the archive-nostalgia risk named in the brief) — historical material should look considered and well-kept, not artificially aged; current material should never look thin or under-designed by comparison just because it's simpler.

**What good looks like:** Via Nazario reads unambiguously as an active destination with a real, current, sometimes-changing status; Via Polese reads unambiguously as a real, respected part of the story that closed in 2014 and stayed closed — both told with the same visual care, at different registers, never competing for the same "is this real?" credibility.

**Session-3 addition — minimum reliable grammar:** prototyping (Study 6, Prototype Test Report §21) found that a single structural signal (an edge/border-style change, a scale change, or a distinct section background) plus one text signal (a kind-label) is sufficient for the current/archive distinction to register within a second — the full catalogue of possible signals (edge style, scale, section framing, a year watermark, the editorial voice, a separate heading region) does not all need to appear on the same page at once. Treat "at least one structural signal plus one text signal" as the floor, not "as many signals as possible" as the goal.

---

## 22. Experience depth

Tested against the four horizons the architecture already established.

**5 seconds** — Where am I? What is this? Can I visit / what's happening? Answered entirely by Home's first block (Institutional Architecture v1 §8) rendered in Territory A's calm, precise register: name, one-line description, current status, address.

**30 seconds** — Why is this different? What kind of activity happens here? Answered by Home's second block (the 2–3 sentence outsider explanation) — specific practice, not slogan, exactly per DNA 8.

**2 minutes** — What's the broader practice? How can I participate/work/collaborate? Answered by Our Approach and Work With Us, reached in one click, written in the recommended grammar's editorial voice with concrete instances (the beer-tap adaptation, the bilingual deed) rather than abstraction.

**10+ minutes** — History, approach, case studies, archive, evidence. Answered by History and, once built, Research & Evidence — rendered in the recommended grammar's denser, archive-registered pages, using the depth-aware routing pattern (§20, item 4) so a visitor arrives there by genuine curiosity, never by being forced through it to reach something simpler.

The visual system supports all four because density and register vary by depth (§11, §19) while navigation and controls stay constant — a visitor at any depth always knows how to get back out.

---

## 23. User walkthroughs

Narrated under the recommended direction. No current facts invented; where a fact (hours, specific access conditions) is not yet established per Current Public State v1, the walkthrough shows the honest "to be confirmed" state, not a guess.

**A. Someone in Bologna looking for something to do tonight.**
First impression: a calm, fast homepage, current status readable in the first second — no institutional throat-clearing. Orientation: immediate — name, address, open/closed state, one clear next action. Information path: Home → What's On or directly to a notice. Visual/interaction character: Territory A's precision at its most valuable — nothing between the visitor and the fact of whether tonight is possible. Next action: come, or check back, with a real reason either way.

**B. A Deaf visitor checking whether practical communication information is available.**
First impression: the site does not perform inclusivity at them with iconography; it states specifics. Orientation: Visit → Access, one click. Information path: a Deaf/communication-access dimension rendered honestly (per Current Public State v1 §3, today this would show "needs on-site confirmation" for current staff LIS capacity, not a guessed yes) alongside the one confirmed fact (WhatsApp/text booking already works). Visual/interaction character: no blanket "accessible" badge; DNA 4's inversion (the visitor's actual need drives what's shown) made concrete by per-dimension honesty. Next action: a real contact channel for a direct question, clearly the assistance/contact dimension's whole purpose.

**C. A wheelchair user trying to understand practical access before visiting.**
First impression: same Access section, same discipline — physical-access dimensions shown as genuinely unresolved today rather than inherited from 2015-era design intent (per Current Public State v1 §3, which explicitly warns against assuming the historical lowered-counter claim still holds). Orientation: Visit → Access. Information path: per-dimension "needs on-site check" states, honestly labelled, with the same contact path as scenario B. Visual/interaction character: DNA 2's visible provisionality — a "to be confirmed" state that reads as honest, not evasive, because the whole system's visual language already treats "to be confirmed" as a normal, non-alarming state elsewhere (freshness, notices). Next action: contact before visiting, exactly as the architecture's own recommended default already states.

**D. A curator/festival producer arriving to understand what collaboration with L'Altro Spazio might mean.**
First impression: Home's second block already signals "not just a bar" within 30 seconds. Orientation: Our Approach, one click from Home. Information path: Our Approach's concrete-instance-first voice (the deed, the beer tap, the decade-long formats) → Work With Us for status-labelled current/proposed offerings → The Organisation if they need the institutional register for a funding conversation. Visual/interaction character: the editorial voice at its most persuasive — specific, evidenced, never a slogan. Next action: a real contact path into Work With Us, with proposals clearly marked as proposals (Content Model §12) so no misunderstanding about what's actually deliverable now.

**E. Someone who knew the Pratello venue and discovers the current organisation.**
First impression: they search or land on History rather than Home. Orientation: History's archive register makes clear immediately this is not a live listing. Information path: History states Pratello 29/A's dates and its September 2025 closure plainly, in the same view as its name (Invariant 13) — no ambiguity, no quiet omission. Visual/interaction character: DNA 5's discontinuity-told-not-hidden, felt directly. Next action: a clear path to Visit, for the venue that is actually still open (Via Nazario), so the visitor isn't left at a dead end.

**F. Someone who finds the project through the 10-year book.**
First impression: the website feels like a sibling, not a digital reprint — recognisably the same institution, unmistakably a different, calmer, more precise medium (§24). Orientation: whatever specific fact drew them from the book (a programme, a person, a place) is findable via search or a direct link, resolving to the canonical current-or-historical record, correctly dated. Information path: depth-aware routing (§20, item 4) lets them go as deep as the book made them curious to go, without the site trying to *be* the book. Visual/interaction character: the two-voice typographic system (§9) gives them one register that feels continuous with the book's own quoted-testimony pages (the editorial voice) and one that is obviously, deliberately different (the functional voice) — exactly the "related by logic, not by skin" test. Next action: Visit, if the book made them want to actually go.

---

## 24. The book and the website

**What they share:** the institutional DNA in §5 — the practice's actual logic of testing space against bodies, treating accessibility as method rather than feature, telling discontinuity honestly, using translation as a constitutive mechanism rather than an afterthought, and letting practice run ahead of (or behind) its own vocabulary. Both projects are honest attempts to represent the same decade-long practice; both should be recognisable, on reflection, as coming from the same underlying logic.

**What they must not share:** the book's specific print-editorial graphic system — its compressed rotated typography, its dotted-line cover motif, its constellation mural, its blueprint linework, its specific page-turn pacing, and (corrected on session-3 visual review, §14/§19) its exact cream/charcoal register — direct comparison found this reads as the book's own paper and ink, not an independently-arrived-at convergence, so it is no longer treated as a shared starting point. None of these are brand standards; all of them are one publication's own creative choices, made for print, for a specific physical object, at a specific moment.

**How they can feel like siblings:** through the deeper logic in §5, not through shared skin — the way two people from the same family can be recognisably related without dressing alike. A reader of the book who later visits the site should feel "this is the same practice, told a different way," never "this looks like someone tried to make the book into a website" and never "this looks like an unrelated project that happens to share a name."

**Why the website is not a digital version of the book:** the book is a bounded, sequential, print-editorial narrative object with a fixed print run and a fixed moment of publication; the website is a live, queryable, continuously-current system whose defining discipline (per the Content Model) is that nothing is ever silently allowed to go stale or unverified. These are structurally different kinds of object, built to do different jobs, and treating one as a digital translation of the other would betray both.

**Which book mechanisms informed the thinking:** the tape-and-body prototyping process (DNA 2); the "accessibility was the whole project, not a section" testimony (DNA 3); the client-adapts-to-staff inversion (DNA 4); the villaggio porousness (DNA 7); the bilingual-deed and LIS-signage forms of translation (DNA 1, DNA 6); the honest telling of "all'inizio era tutto molto improvvisato" alongside precise access drawings (the PRECISE ↔ PROVISIONAL tension, §6).

**Which book mechanisms were deliberately rejected:** the specific typographic compression and rotation (§9); the dotted-line and constellation-mural graphic motifs as literal assets (§8); the blueprint/floor-plan diagram as decoration (§7); the specific interior materials of Via Nazario Sauro as a website "look" (§15); any reuse of the wheelchair/sign-language/Braille imagery as decorative branding, however meaningful it is in the book's own archival context (§26).

**Standing principle:** related by logic, not by skin.

---

## 25. Potential shared brand DNA

These are findings that could, in a later and separate decision, inform identity work beyond the website (print, signage, social, the physical space itself) — recorded here explicitly as *potential*, not as cross-media rules this document is entitled to set.

- The PRECISE ↔ PROVISIONAL tension (§6) as a general communication principle, not just a web pattern: stating what is known and what is not known, plainly, everywhere the organisation communicates.
- The "client adapts to staff, not the reverse" inversion (DNA 4) as a hospitality principle transferable well beyond the website.
- Discontinuity told honestly (DNA 5) as a standing communications policy for any future public history material, in print or otherwise.
- The two-voice register (functional/precise vs. editorial/testimonial) as a general writing principle for any future public copy, not only web copy.
- Attributable, named practice over anonymous institutional voice (DNA 7), wherever consent and privacy allow it.

None of these are adopted as physical-brand or print-identity rules by this document; they are logged here so a later, separate identity conversation does not have to rediscover them from scratch.

---

## 26. Anti-patterns

Kept only where genuinely relevant to the recommended direction; each traced to a specific finding above.

- **Generic NGO aesthetic** (Mission/Vision/Values page, a rainbow "diversity" strip, a donate button) — already excluded by the Content Model itself (§3, §23) and by DNA 8's insistence on specific instance over abstraction.
- **Rainbow/diversity branding used as a visual centrepiece** in place of specific, evidenced practice.
- **Disability pictogram decoration** — wheelchair icons, ear icons, sign-language hand illustrations, Braille dots used as generic ornament. The book's own LIS drink-signs and the RAMP beer label are legitimate *in their original, functional or archival context*; repeating them as decorative web iconography divorced from that context is precisely the trivialisation the brief warns against (Task "Do Not Fetishise Disability").
- **Generic brutalist art-school site** — Territory C's relationship-first graphics, if adopted without discipline, is the direction most exposed to this risk (§17).
- **Sterile institutional white site** — Territory A's own named risk if adopted without Territory B's warmth graft (§18).
- **Nightlife/bar aesthetic** as the whole identity — Territory B's own named risk if its literal interior materials were adopted (§15, §17).
- **Excessive scroll animation / entrance choreography** — ruled out by the motion discipline in §13 and §19.
- **Dotted-line motif used decoratively everywhere** — explicitly rejected in §8 and §24; the book's cover motif is print-specific, not a transferable web device.
- **Fake architectural blueprint graphics** — explicitly rejected in §7; Territory A's "measured" logic is a behavioural/informational idea, never a decorative technical-drawing skin.
- **All-caps, compressed body text** — explicitly ruled out in §9 regardless of which typographic voice is active.
- **Decorative sign-language imagery** used as branding rather than functional communication (see disability-pictogram entry above).
- **Card-grid monoculture** — identical section templates repeated down every page — explicitly ruled out by the rhythm/density discipline in §11.
- **Archival nostalgia treatment** (sepia filters, aged-paper textures applied to make history "feel old") — explicitly ruled out in §21.
- **Accessibility hidden behind a special mode** — explicitly ruled out by DNA 3, DNA 4, and §13's "no separate accessible mode" floor.
- **Vague "inclusion" slogans as a visual centrepiece** — explicitly ruled out by DNA 8.

---

## 27. Open creative questions

Genuinely unresolved by this document, left open rather than forced to a premature decision:

- Whether a Territory-C-style relationship/exploration view belongs anywhere in the launch system as a secondary, opt-in mode (§18, §28) — depends on decisions the next (content-schema/technical) phase hasn't made yet.
- The exact number and visual treatment of image "kinds" (§10, §19) once real photography and archival material are actually gathered and reviewed — this document establishes the principle (source/status must stay legible) and the category list, not final swatches or exact border/label conventions.
- How much of the functional/editorial two-voice distinction (§9) should be expressed through distinct type *families* versus distinct weights/sizes within a smaller family set — a typeface-selection decision properly belonging to the next visual-design pass, not this one.
- Whether the "current vs. archive" visual marker (§19, §21) should be a persistent page-level convention or a more localized per-block treatment — needs prototyping against real page layouts before deciding.
- How the recommended grammar should extend to a physical/venue-facing surface (signage, printed menus) if the owner ever wants shared brand DNA (§25) beyond the website — explicitly out of scope for this document.

## 28. What should be prototyped next

Not polished mockups — small, falsifiable tests of the riskiest specific claims in this document, before committing to a visual-design system:

1. **The current/archive visual marker** (§19, §21): mock up a History page and a Visit page side by side and test, with a handful of real or realistic visitors, whether the distinction actually registers within one second without reading a caption.
2. **The freshness-aware display pattern** (§20, item 3): a rough prototype of how a STALE-but-technically-current WORK/SERVICE record should visually soften its own call-to-action, since the Content Model requires this behaviourally (Invariant 4) but deliberately does not prescribe its presentation.
3. **The two-voice typographic system** (§9, §19) under real content: does the editorial voice actually read as confident-and-warm rather than merely "different," once real testimony and real essay drafts are set in it?
4. **A single Territory-C-style relationship view** (§18, §27), scoped narrowly to one WORK page (e.g. Cena al Buio, given how well-documented its manifestation history already is) — testing specifically whether it can be made accessible and quickly legible before considering it for a wider role.
5. **The nine-dimension accessibility display** (§13, §19) against real, still-partially-"to be confirmed" data from the Current Public State's own accessibility matrix — the single most consequential prototype, since it is where creative expressiveness and the accessibility-as-method DNA are most likely to actually collide in practice.

## 29. Recommended next phase

Per the greenfield sequence already established (institutional evidence → architecture → current state → content model → creative direction → technical architecture), and consistent with the Content Model's own recommended next phase:

1. Resolve the prototyping questions in §28, particularly items 1, 2 and 5, since they most directly test whether this direction's core claims (current/archive clarity, honest freshness, accessibility-as-method) actually hold up against real content rather than only against evidence and argument.
2. Begin concrete content-schema design (per Greenfield Content Model v1 §27, already recommended and unblocked by this document) in parallel — the creative direction and the schema design are independent per the greenfield sequence and should not gate each other.
3. Once both the creative direction (this document, refined by §28's prototypes) and the concrete schema are stable, begin visual/component design — explicitly out of scope for this document and not to be started before then.
4. Defer typeface, exact palette, and final component-level decisions to that visual-design phase, informed by but not decided within this document.

---

## Owner decisions required

Per instruction, kept to genuinely consequential creative judgment calls only. Opening hours and practical access verification are explicitly out of scope for this session (already owned elsewhere).

1. **DECISION:** Is the owner comfortable with the recommended direction's rejection of the book's own graphic vocabulary (typography, dotted-line/constellation motifs, blueprint linework) as website material, given the book is a major, imminent (October 2026) public-facing project that some visitors will encounter first?
   **Why it matters:** a visitor could reasonably expect visual continuity between the two; this document argues deliberately against that expectation in favor of continuity of logic instead (§24).
   **Recommended default:** proceed as recommended — the "related by logic, not by skin" standard, with the sibling-relationship experience described in Walkthrough F (§23) as the intended visitor experience.
   **Consequence of deferring:** the visual-design phase proceeds on this document's assumption; revisiting later mainly affects typography/graphic-motif choices, not the underlying grammar.

2. **DECISION:** Should any Territory-C-style relationship/exploration view (§18, §27, §28 item 4) be scoped into the launch system at all, or held entirely for a post-launch phase?
   **Why it matters:** it is the one genuinely novel, higher-risk interaction idea in this document, and the only place a real trade-off exists between creative ambition and the accessibility/navigation floors this document otherwise treats as non-negotiable.
   **Recommended default:** hold it for post-launch, prototype-first, per §28 item 4 — do not scope it into the initial build.
   **Consequence of deferring:** no loss; the recommended grammar (§19) does not depend on it existing.

3. **RESOLVED on session-3 visual review (no longer an open owner decision).** This document originally asked whether the owner was comfortable with a cream/off-white/charcoal palette starting point, on the argument that the resemblance to the book was coincidental convergence rather than borrowed skin. Having now viewed the actual book PDF directly beside the prototype lab (Prototype Test Report §20), that argument does not hold up: the warm-cream base reads as the same paper and ink as the book, not as independent convergence. The palette starting point is therefore corrected in §14/§19 to a cooler, whiter neutral base with one darkened status accent, with Encounter's warmth carried by photography and per-section accent variation instead of the base tone. This was a visual-evidence question, not a subjective preference, so it is resolved here rather than left open; the owner can of course revisit it once real page mockups exist.

If none of the above need resolving before the next phase can proceed, the recommended defaults above are sufficient to continue.

---

## Quality gates

| # | Gate | PASS/FAIL | Basis |
|---|---|---|---|
| 1 | Does the direction stand independently from the book? | **PASS** | §24; Territory A/B explicitly reject the book's specific graphic vocabulary; only institutional DNA (§5), not skin, is shared |
| 2 | Would a shared L'Altro Spazio logic be recognisable between book and site without mistaking them for one design system? | **PASS** | §24's sibling standard; Walkthrough F (§23) tests this directly |
| 3 | More specific than a generic NGO site? | **PASS** | §26; DNA 8's specific-instance-first discipline; no Mission/Impact/Donate layer anywhere in this system |
| 4 | More than a stylish bar website? | **PASS, with a named risk to manage** | Territory B's bar-reduction risk is the single highest risk in §17; managed by not adopting B's literal materials and by grafting only its warmth/rhythm lessons (§18) |
| 5 | More than a contemporary-art template? | **PASS** | Territory C's design-school risk is explicitly not adopted for launch (§18); Territory A/B do not resemble a gallery template |
| 6 | Does accessibility shape the design rather than appear as a badge/section? | **PASS** | §13 in full; DNA 3/DNA 4; no standalone Accessibility page anywhere in the recommended grammar (§19) |
| 7 | Can practical information remain extremely clear? | **PASS** | §14 (Territory A), §19's functional-voice and spatial-composition rules |
| 8 | Does expressive typography remain readable? | **PASS** | §9's hard floor: no compression, no rotation, no essential content sacrificed to display effect |
| 9 | Does archive/current distinction remain clear? | **PASS — prototype-validated** | §19, §21; validated visually in Study 6 (Prototype Test Report §21) — one structural signal plus one text signal is sufficient, no single page needs the full signal catalogue |
| 10 | Can the system support quiet AND dense states? | **PASS** | §11; §6's QUIET↔DENSE tension held deliberately, not resolved to one side |
| 11 | Are graphic devices functional before decorative? | **PASS** | §8; every territory's line/graphic logic (§14–§16) tied to a real relationship, never ambient accent |
| 12 | Does the experience support multiple routes to meaning? | **PASS** | §12, §20 item 4; DNA 1 realised as depth-aware routing without content duplication |
| 13 | Does it avoid disability symbolism as decoration? | **PASS** | §26's explicit anti-pattern entries; none of the three territories proposes pictogram/iconography branding |
| 14 | Can it work responsively without losing its core character? | **PASS** | §19's responsive-adaptation principle (reflow as genuine spatial adaptation, not just breakpoint shrinking) |
| 15 | Does the creative system remain independent of implementation technology? | **PASS** | No code, framework, or component library referenced anywhere in this document; §29 explicitly defers technical-architecture decisions |

**15/15.** Gate 4 is marked PASS with an explicit named risk to manage (Territory B's bar-reduction risk, §17). Gate 9 was upgraded from "pending prototype validation" to prototype-validated once Study 6 (Prototype Test Report §17–§28) actually tested it visually. That same session-3 visual pass produced one correction that touches gates 1, 2, 9 and 15 (the palette, §14/§19/§22/§24) and one addition touching gate 6/13 (verification-metadata restraint, §19) — both applied in place above rather than left as open findings.

---

*End of Creative & Experience Direction v1. This document does not implement, code, schema, or produce final visual mockups. It does not replace or supersede Working Paper v0.3, Institutional & Public Information Architecture v1, Current Public State & Implementation Readiness v1, or Greenfield Content Model v1.*
