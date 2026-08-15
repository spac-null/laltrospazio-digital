# L'Altro Spazio — Current Public State & Implementation Readiness v1

**Working date treated as current:** 16 August 2026
**Status:** Present-tense verification document. Answers "what is true now, and therefore safe to say," as distinct from Working Paper v0.3 (what has L'Altro Spazio been) and Institutional Architecture v1 (what must it be publicly legible as).
**Scope discipline:** No website implementation, no final marketing copy, no historical re-research, no architecture redesign, no code changes.

---

## GREENFIELD NOTICE (read first)

**The future website is a greenfield system. Existing frontend and public content architecture are legacy and are not implementation constraints.**

Per the owner's direction superseding all prior implicit assumptions: the current production frontend (`src/pages/Index.tsx`, its navigation, sections, components, copy, and route structure), and the current content schemas (`content/venue.json`, `content/events/`, `content/notices/`, `content/candidates/`) have **zero design authority** over the new site. They were inspected in this session only to establish present-tense public facts and to reach one specific, limited conclusion, stated here once and not revisited: **existing public-facing content is non-canonical and must not be migrated without independent verification.** Nothing about the old page's navigation, layout, wording, or component choices should inform the new institutional architecture, content model, or design system. Where this document lists a currently-live fact (a phone number, an active notice, a social handle), that fact may carry forward *as a verified data point* through the migration path the owner specified (verified fact → new content model → migration of useful data), never as an inherited design or schema.

This document's implementation-readiness section (§14) is written entirely on that basis.

---

## 1. Executive status

The venue is **currently closed** as of the working date (16 August 2026), reopening 27 August 2026 — this is the single most important present-tense fact and it is well supported. Beyond that, current public truth is thin: hours, accessibility conditions, current staff composition, current programme cadence, and several organisational facts are either unverified, conflicting, or simply absent from any authoritative current source reviewed in this session. Parco 11 Settembre is owner-confirmed as currently open/active for the summer 2026 programme, which is new, useful, present-tense information this session adds.

The legacy production website currently asserts several claims that must not be treated as current truth by any new system: "completely accessible," a self-reported 50% disabled-staff figure (a *third* number, distinct from the working paper's 2022 self-reported 80% figure — neither is verified), fabricated-looking impact statistics, and three named testimonials with no provenance anywhere in this repository. None of this is usable. That is the full extent of what this session concludes from the legacy site; per the greenfield notice above, no further analysis of it was performed.

This document does not resolve most of what it finds unverified — it makes the gaps explicit, non-blocking, and actionable (§13, §16, §17).

---

## 2. Current venue fact sheet — Via Nazario Sauro

| Fact | Value | Status | Authority | Last verified | Recheck rule | Public-safe? |
|---|---|---|---|---|---|---|
| Venue name | L'Altro Spazio | CURRENT VERIFIED | Repository canonical (`content/venue.json`) + live production site | 16 Aug 2026 (this session) | On rebrand only | YES |
| Address | Via Nazario Sauro 24/F, 40121 Bologna, Italy | CURRENT VERIFIED | Repository canonical + live production site + live Facebook Page "Intro" field ("via Nazario Sauro 24F, Bologna, Italy") | 16 Aug 2026 (this session, cross-checked against a second live public source) | On operational change | YES |
| Map/arrival info | Google Maps short link resolves to the correct coordinates (44.4977164, 11.3394358) | REPOSITORY-CANONICAL BUT NEEDS CURRENT CHECK | Repository canonical | Link resolution confirmed 16 Aug 2026; the destination page itself sat behind a Google cookie-consent wall this session did not click through | Recheck if the short link ever 404s | YES (link only; no hours/status claim was extracted from Maps this session) |
| Open/closed status (right now) | **CLOSED**, reopens 27 August 2026 | CURRENT VERIFIED | Canonical operational notice (`content/notices/temporary-closure-august-2026.json`), owner-confirmed, and independently confirmed live on the production homepage this session | 16 Aug 2026 (live browser check) | Notice has an explicit expiry; recheck automatically at expiry | YES |
| Closure exact start date | Notice record says `valid_from: 2026-08-13`; the owner's direction in this same session states "temporarily closed 12–26 August 2026 inclusive" | **CONFLICTING (minor, one day)** | Notice record vs. owner statement, same session | 16 Aug 2026 | Reconcile the notice record's start date with the owner directly; does not change the reopening date | CONDITIONAL — safe to say "closed until 27 August," not safe to assert the exact first day of closure until reconciled |
| Regular opening hours | Not established. Facebook's own public "Intro" field currently reads **"Always open"** | CONFLICTING / effectively UNKNOWN | Live Facebook Page listing (LIVE-PUBLIC-SOURCE, but implausible on its face — no physical venue is "always open," and it directly conflicts with the very same page's normal operating pattern) | 16 Aug 2026 | Recheck after any owner-confirmed hours are set | NO — do not publish "always open," and do not publish any specific hours without owner confirmation |
| Phone (booking/WhatsApp) | +39 351 704 8064 | CURRENT VERIFIED | Repository canonical + live production site + live Facebook Page ("Prenotazioni 🛎️ 3517048064 (Whatsapp)") — three independent current sources agree | 16 Aug 2026 | On operational change | YES |
| Phone (info/collaborations) | +39 347 327 6768 | LIVE-PUBLIC-SOURCE VERIFIED (new to this repository) | Live Facebook Page "Intro" field only ("📞 Info & collaborazioni 📞 3473276768") | 16 Aug 2026 | Confirm with owner before adding to any canonical record; not previously in repo | CONDITIONAL — real and current on a live public channel, but not yet owner-confirmed as a channel the organisation wants published on a new site |
| Email | nazariosauro@altrospazio.org | LIVE-PUBLIC-SOURCE VERIFIED | Repository (`venue-record.json`, previously `unverified`) is now independently corroborated by the live Facebook Page listing the identical address | 16 Aug 2026 | On operational change | YES — upgraded from `unverified` to `live-public-source verified` by this session's cross-check |
| Instagram | instagram.com/laltrospazio (8,630 followers at check time) | CURRENT VERIFIED | Repository canonical + live check | 16 Aug 2026 | Rare | YES |
| Facebook | facebook.com/laltrospazio.bologna (17K followers, 92% recommend / 274 reviews at check time) | CURRENT VERIFIED | Repository canonical + live check | 16 Aug 2026 | Rare | YES |
| TripAdvisor | Listed in repository; not re-checked live this session (no broad web research) | REPOSITORY-CANONICAL BUT NEEDS CURRENT CHECK | Repository canonical only | Not rechecked this session | Low priority | CONDITIONAL |
| Reservation/contact process | WhatsApp to the booking number is the only confirmed current process | CURRENT VERIFIED (for that one channel only) | Live Facebook Page + live production site agree | 16 Aug 2026 | On process change | YES |
| Temporary closures | The August 2026 closure is the only one currently recorded | CURRENT VERIFIED | Canonical notice | 16 Aug 2026 | Notice-driven, already has expiry | YES |
| Seasonal conditions at Via Nazario itself | Not established — no evidence Via Nazario (as distinct from Parco) has seasonal variation beyond the single recorded closure | UNKNOWN | — | — | Ask the owner if relevant | N/A |

**Note on the second phone number:** this is a genuine finding, not something to silently fold into the existing single-phone model — a live public source shows the organisation itself distinguishes a booking channel from an info/collaboration channel. This is useful signal for the new content model's contact structure (a decision for a later phase, per the greenfield notice) but is not yet owner-confirmed as intended for a new public site.

---

## 3. Current accessibility matrix

Structured on the nine-dimension model from Institutional Architecture v1 §9. This is a **verification matrix, not a claims page** — every "NOT AVAILABLE" or "UNKNOWN" below is a gap to close, not a soft way of saying no.

| # | Dimension | Item | Classification | Note |
|---|---|---|---|---|
| 1 | **Physical access** | Entrance/steps/thresholds | NEEDS ON-SITE CHECK | No current record exists; 2015-era design intent (lowered counter) is historical, not a current verification |
| | | Door width | NEEDS ON-SITE CHECK / MEASUREMENT | |
| | | Internal movement / wheelchair circulation | NEEDS ON-SITE CHECK | |
| | | Counter/service height | NEEDS ON-SITE CHECK | Historically documented as lowered (2018 Lonely Planet); current state not verified |
| | | Seating | NEEDS ON-SITE CHECK | |
| | | Toilet accessibility | NEEDS ON-SITE CHECK | |
| | | External pavement/street approach | NEEDS ON-SITE CHECK | |
| 2 | **Visual access** | Lighting/contrast | NEEDS ON-SITE CHECK | |
| | | Menus/information format | NEEDS OWNER CONFIRMATION | Historical Braille menus documented (2018); current availability unverified |
| | | Large-print availability | UNKNOWN | |
| | | Braille/tactile information | NEEDS OWNER CONFIRMATION | Do not assume 2018-level provision persists |
| | | Obstacles/navigation | NEEDS ON-SITE CHECK | |
| 3 | **Deaf/communication access** | LIS-capable staff, if any | NEEDS OWNER CONFIRMATION | Historically strong (decade-long LIS thread per Working Paper v0.3 §8) but current staffing not established |
| | | Written ordering / visual communication | NEEDS ON-SITE CHECK | |
| | | WhatsApp/text contact | VERIFIED CURRENT | Confirmed live (§2) |
| | | Event interpretation | NEEDS OWNER CONFIRMATION | Event-specific, not a venue default |
| | | Communication practices generally | NEEDS OWNER CONFIRMATION | |
| 4 | **Hearing/audio access** | Amplification | UNKNOWN | |
| | | Induction loop, if any | UNKNOWN | Not evidenced anywhere in repository, historical or current |
| | | Captioning | NOT AVAILABLE (assumed) | No evidence of any captioning capability at the physical venue; would need confirmation to say otherwise |
| | | Event audio conditions | NEEDS EVENT-SPECIFIC RECORDING | Not a venue-baseline fact |
| | | High-noise environments | NEEDS ON-SITE CHECK | Live music runs weekly per historical record; current sound levels not measured |
| 5 | **Cognitive/information access** | Clarity of directions | NEEDS ON-SITE CHECK | |
| | | Menu/information complexity | NEEDS ON-SITE CHECK | |
| | | Predictable arrival information | NEEDS OWNER CONFIRMATION | Depends on hours being settled first (§2) |
| | | Quiet-space options, if any | UNKNOWN | |
| 6 | **Digital access** | Current website | NEEDS TECHNICAL AUDIT | Out of scope for this document (frontend is legacy and will be rebuilt — see greenfield notice); a real accessibility audit belongs to the new implementation, not a patch to the old site |
| | | Event information / contact methods | PARTIALLY VERIFIED | Contact channels verified live (§2); event info currently empty (correct empty state) |
| | | Captions/alt text/process | NOT ASSESSED | Legacy-site concern; not carried into new system design |
| 7 | **Event-specific access** | How event-specific access will be recorded | NOT YET DESIGNED | Belongs to the new content model (later phase); no current event records exist to test against |
| 8 | **Assistance/contact** | Who can answer practical access questions | NEEDS OWNER CONFIRMATION | Two live phone numbers exist (§2); which one (if either) should be the public access-question channel is an owner decision |
| | | Expected response mode | UNKNOWN | |
| 9 | **Temporary limitations** | Broken equipment / construction / seasonal setup | UNKNOWN | No current mechanism records this distinct from the general closure-notice system, which already exists and works (§2) |

**Summary:** of roughly 30 individual items, **zero** are currently VERIFIED CURRENT at the physical/sensory level (only the communication-channel items are). The single largest, most consequential gap is physical/visual/Deaf-communication access at Via Nazario, which is exactly what Institutional Architecture v1 §20 (decision 10) already flagged as the biggest downstream dependency. This session does not close that gap — it makes the checklist to close it actionable (§4).

---

## 4. On-site accessibility verification checklist

Designed to be completed by the owner or a trusted staff member at Via Nazario in approximately 30–60 minutes, without specialist equipment except a basic tape measure.

| # | What to check | How to check it | What to record | Photo useful? | Measurement needed? | Public claim it could support |
|---|---|---|---|---|---|---|
| 1 | Street-level entrance | Look at the entrance from the pavement | Step-free or number of steps; door type (push/pull, width if easy to measure) | Yes | Yes (door width, step height if any) | "Step-free entrance" or "entrance has an N cm step" |
| 2 | Door width | Tape measure across the clear opening | Width in cm | No | Yes | Wheelchair/mobility-aid clearance claim |
| 3 | Path from entrance to bar counter | Walk it with a wheelchair or wide item if possible | Any narrow points, obstacles, uneven flooring | Yes | No | "Clear route from entrance to bar" |
| 4 | Counter height | Measure from floor to counter surface | Height in cm | No | Yes | "Lowered counter" claim, with the actual height stated |
| 5 | Seating | Look at table heights, whether any seating area is reachable without navigating steps | Note any step-only seating areas | Yes | No | "Accessible seating area available" |
| 6 | Toilet | Check door width, turning space, grab rails, sink height | Door width; presence/absence of grab rails; approximate turning space | Yes | Yes (door width) | "Accessible toilet" or specific limitations |
| 7 | Lighting | Note general brightness, whether any area is notably dim | Subjective note; photo captures it better than description | Yes | No | Visual-access planning info, not a formal claim |
| 8 | Menu format | Check what formats currently exist (paper, digital, large-print, Braille) | List formats that exist today, not historically | No | No | "Menu available in X format" — only for what's confirmed today |
| 9 | Signage/way-finding clarity | Walk the space as a first-time visitor would | Note anything unclear or missing (toilet sign, exit, entrance) | Yes | No | Cognitive/information-access planning info |
| 10 | Noise/ambient sound at a normal (non-event) time | Just listen for a few minutes at a quiet hour | Subjective note (quiet / moderate / loud) | No | No | Hearing-access planning info |
| 11 | Current staff communication capability | Ask staff directly: does anyone currently working know LIS, and on which shifts | Names not required — just "yes/no/some shifts" | No | No | Deaf/communication-access claim, or "ask us before you come" default |
| 12 | Which phone number should field access questions | Confirm with the owner which of the two current numbers (booking vs. info/collaborations, §2) is the right one | The chosen number/channel | No | No | The single "assistance/contact" public claim |
| 13 | Any known temporary obstruction right now | Just look/ask | Anything currently broken, under repair, or blocked | Yes | No | Feeds the existing temporary-notice mechanism, not a new system |

**Checks that should require a professional accessibility audit rather than owner self-verification** (not attempted here, and not appropriate for a 30–60 minute self-check):
- Formal compliance measurement against Italian accessibility regulation (e.g. exact gradient/slope tolerances, precise turning-circle diameters, formal fire-safety/emergency-egress accessibility).
- Acoustic measurement for induction-loop or amplification suitability.
- Any claim intended to be used in a grant application, public tender, or formal accessibility certification.

The goal of the checklist above is truthful practical visitor information, not certification — consistent with Institutional Architecture v1 §9's framing of accessibility as operational information rather than institutional self-praise.

---

## 5. Parco 11 Settembre — current state

| Item | Current status | Source |
|---|---|---|
| Currently operating/programming there | **YES — owner-confirmed current** | Direct owner statement in this session: "currently open / active for the summer programme" |
| Current season dates | Not established beyond "summer 2026, in progress as of 16 August" | Owner statement + live Facebook posts dated 19 June–9 July 2026 showing concerts, a poetry series, and general Parco activity |
| Current role of Cooperativa L'Altro Spazio | Per Working Paper v0.3 §13, the cooperative has operated the Parco strand (alongside Via Nazario) since the 2025 board actions — this is carried forward as current, not re-verified independently this session beyond the owner's confirmation that Parco is currently active | Working Paper v0.3 + owner confirmation of current activity |
| Current role of Associazione Farm | Not independently re-verified this session; Working Paper v0.3 §8 established that Farm's public branding persists well past any operational transfer, so its current *public-facing* role should not be assumed absent without a fresh check | Working Paper v0.3 (historical), not re-verified as current |
| Should it appear as a current "place" | Recommended: **as a current seasonal programme/place, clearly labelled seasonal** — distinct in kind from the year-round Via Nazario venue, per Institutional Architecture v1 §3.1 and §6 | This document's own recommendation, consistent with the architecture |
| Should it appear as a current programme/season instead of a standalone "place" | Both are defensible; Institutional Architecture v1 already resolved this conceptually (Parco as seasonal PLACE + WORK entry) — not re-litigated here | Institutional Architecture v1 §3, §6 |
| Contact relationship | Not established — no evidence Parco has its own distinct contact channel separate from the Via Nazario numbers | UNKNOWN / OWNER CONFIRMATION REQUIRED |
| Event relationship | Live Facebook posts show specific dated public events at Parco this summer (a 27 June concert, a 7–21 July poetry series, other dated posts) — these are genuine current EVENTS in the architecture's sense (Institutional Architecture v1 §10), not yet in the canonical event registry | Live Facebook Page (LIVE-PUBLIC-SOURCE, not canonical authority — see §11 below) |
| Accessibility information specific to Parco | Not established | UNKNOWN — Parco is an outdoor public park; its accessibility profile is likely different in kind from an indoor venue and needs its own check, not an inherited assumption from Via Nazario |

**Important distinction preserved:** Parco's *longitudinal institutional importance* (documented at length in Working Paper v0.3 §2, §8) is a historical/evidentiary fact. Its *current 2026 operating status* is a separate, narrower, owner-confirmed present-tense fact. This document uses only the latter for any present-tense claim.

---

## 6. Current programme inventory

| Programme/format | Classification | Source of current status | Last evidence date | Owner confirmation needed? | Public page role |
|---|---|---|---|---|---|
| Parco 11 Settembre seasonal activity (concerts, poetry, general programming) | **ACTIVE / RECURRING CURRENT** | Owner confirmation (§5) + live Facebook posts (19 Jun–9 Jul 2026) | 9 Jul 2026 (live post) | No — already owner-confirmed as currently active; season end date still needed | Current activity / What's on, once individual dates are canonicalised |
| Karaoke / DJ nights at Via Nazario | **RECENT BUT CURRENT STATUS UNVERIFIED** | Live Facebook posts (4 Jun, 19 Jun 2026) show recent instances at Via Nazario | 19 Jun 2026 (live post) | Yes — confirm these are still recurring given the venue is currently closed for the August break | Programme entry once confirmed as ongoing |
| Cena al Buio | **RECENT BUT CURRENT STATUS UNVERIFIED** | No 2026 evidence found in the limited live-public-source check this session (not a broad search); Working Paper v0.3 §11 already flags an unexplained 2024 promotional gap | Last confirmed evidence: Halloween 2025 (per Working Paper v0.3) | Yes — see §7 (Cena al Buio stress test) for the fuller treatment | Programme entry, cadence unstated until confirmed |
| Cineporto / Parco cultural programme | **ACTIVE / RECURRING CURRENT** (folded into the Parco summer-activity finding above) | Owner confirmation + historical continuity (Working Paper v0.3 §8) | 9 Jul 2026 | No, beyond what's already confirmed | Current activity, seasonal |
| LIS-related activity (courses, events) | **PAST/ARCHIVED status for the course lineage; RECENT BUT CURRENT STATUS UNVERIFIED for any 2026 instance** | Working Paper v0.3 §8 traces this through 2023 (university/Ente Nazionale Sordi event) and April 2025 (Sensory Dialogues); no 2026 evidence found this session | Apr 2025 | Yes | Historical/approach content now; programme entry only if a current instance is confirmed |
| Aperitivo dal Mondo | **RECENT BUT CURRENT STATUS UNVERIFIED** | Working Paper v0.3 describes this as continuous 2022–2025; no 2026-specific evidence found this session | 2025 (per working paper) | Yes | Programme entry, cadence unstated until confirmed |
| Music/performance programming generally | **ACTIVE / OCCASIONAL, at minimum** | Live Facebook posts (Jun–Jul 2026, both Via Nazario and Parco) confirm ongoing music events across the period checked | 9 Jul 2026 | Partial — general continuity is evidenced; a canonical current cadence is not | Current activity / programme entry |
| Exhibitions | **RECENT BUT CURRENT STATUS UNVERIFIED** | Working Paper v0.3 describes near-continuous exhibition programming through the archive; no 2026-specific evidence found this session | Not established for 2026 | Yes | Programme entry once confirmed |
| Training (LIS-awareness course lineage) | **PAST/ARCHIVED for the 2016–17 recurring course; not established as current** | Working Paper v0.3 §8 | 2017 for the recurring course specifically | Yes, if the organisation wants to describe training as a current offer | Services, not programme, if revived — see §7 |
| Schools/community work | **RECENT BUT CURRENT STATUS UNVERIFIED** | Working Paper v0.3 §8 (2016–2024 examples); no 2026 evidence | 2024 (Il Porto Ritrovato) | Yes | Work/History depending on confirmation |
| Accessible/sensory cultural work (e.g. Sensory Dialogues-class projects) | **PAST — project-specific, concluded as a defined residency** | Working Paper v0.3 §8 | Apr 2025 | Yes, only if a successor project is planned | History / case-study material, not a current programme entry unless a new instance is confirmed |

**Method note:** "recent but current status unverified" is used deliberately and often above — this session's live-source check was narrow (a handful of the most recent Facebook posts, read without deep scrolling, consistent with "no broad web research"). Silence on a programme in that narrow window is evidence of nothing either way; it is not evidence of discontinuation, and it should not be read as one.

---

## 7. Cena al Buio stress test

Working through Institutional Architecture v1's Task 6 directly, because Cena al Buio is the format most likely to break a single-type content model.

**Does it need to exist as more than one thing? Yes — conceptually, at minimum four related but distinct things:**

- **A. Durable programme/format** — the named, decade-old concept itself: sighted guests served/guided by staff who are blind or low-vision, unchanged mechanism since December 2015 (Working Paper v0.3 §8). This is durable description, not a dated fact.
- **B. Source for dated events** — specific nights (Halloween 2025, e.g.) are individual, dated, bookable occurrences.
- **C. Bookable service** — the December 2025 commercial B2B proposal (Working Paper v0.3 §13) shows it has also been packaged as a corporate offer with its own pricing and an optional training module — a genuinely different transaction (a company books it) from a member of the public buying a seat at a public date.
- **D. Historical case study** — its own ten-year lifecycle (name changes, a 2024 unexplained gap, Working Paper v0.3 §8, §11) is itself evidence worth telling on a History/Research page.

**Recommended conceptual model — CORE WORK/FORMAT with MANIFESTATIONS, not one record with four incompatible types:**

```
Cena al Buio  (CORE WORK RECORD — one durable identity: name, description, mechanism, status)
    │
    ├── PUBLIC PROGRAMME DESCRIPTION   (durable prose — what it is, drawn from the core record)
    ├── DATED PUBLIC EVENT(S)          (0..N — each a normal event record that REFERENCES the core work)
    ├── BOOKABLE SERVICE OFFERING      (0..1 or 0..N — a service record that REFERENCES the core work,
    │                                    carrying its own audience [B2B/private], pricing, and status)
    └── HISTORICAL CASE-STUDY NOTE     (an evidence/learning-layer annotation that references the core
                                         work for citation purposes, not a separate content type)
```

The core insight: **the relationship is one-to-many from a single "work" identity to its manifestations**, not four peer types glued onto one record. A dated event and a bookable service both *point to* the same core work rather than each trying to *be* the work. This lets a canonical event page say "this is a Cena al Buio night" without duplicating the format's description, and lets a services page say "Cena al Buio is available as a corporate booking" without inventing a second identity for the same practice. Each manifestation carries its own status (per Institutional Architecture v1 §12) independently — the core work can be CURRENT PROGRAMME while a specific service package is PROPOSED, or vice versa.

**Testing the same pattern against three other cases:**

- **Cineporto** — fits cleanly: one core work (a Parco-based seasonal cultural programme), with dated public events (specific concerts/screenings) as its main manifestation, and a historical case-study note (its long Farm/SRL/cooperative branding history, Working Paper v0.3 §8) as a second. No bookable-service manifestation currently applies.
- **LIS training** — fits cleanly, with the manifestations reversed in emphasis: the core work is a training capability/format; its main current manifestation (if revived) would be a bookable service (for schools, companies, public bodies) rather than dated public events; its 2016–17 recurring-course incarnation and 2023 university/Ente Nazionale Sordi convening are historical case-study manifestations.
- **Sensory Dialogues / similar project work** — does **not** fit the same pattern as cleanly, and that's an informative result: a funded, time-boxed artistic residency behaves more like a PROJECT (Institutional Architecture v1 §10) than a durable "work" with ongoing manifestations. It is better modeled as a project record in its own right (with its own funder, dates, and outcome status) that may *later* be cited by a case-study note, rather than forced into the Cena al Buio-style core-work/manifestation shape. **This is a useful boundary to keep**: the core-work/manifestations pattern fits durable, repeatable formats; bounded, funded, dated undertakings stay PROJECT records.

**Conclusion for the future content model (not designed here, per the greenfield notice):** the new content model should distinguish, structurally, between (a) durable WORK/FORMAT identities with zero-or-more typed manifestations (events, services, case-study references), and (b) bounded PROJECT records that do not need the manifestation pattern at all. This is a modeling principle to carry into the later content-model design phase, not a schema to freeze now.

---

## 8. Current services/capabilities

| Candidate | Classification | Basis |
|---|---|---|
| Training | **HISTORICAL CAPABILITY**, not currently established as a bookable service | Recurring 2016–17 LIS course is historical; no 2026 evidence of an active training offer |
| LIS / communication work | **CURRENT ORGANISATIONAL CAPABILITY** (the underlying competence clearly still exists and is core to staffing/identity) but **not established as a currently-bookable external service** | Long, continuous historical thread; no current external-facing offer confirmed |
| Accessibility/event design | **NOT ESTABLISHED** as a discrete current offer | No direct evidence of this being sold/offered as a standalone service; it is embedded in how the venue itself operates, not packaged separately |
| Cena al Buio (as B2B) | **PROPOSAL ONLY** as of its last evidence (Dec 2025 commercial proposal) — not established as currently delivered | Working Paper v0.3 §13; no 2026 confirmation of an actual corporate booking delivered |
| Catering/hospitality | **CURRENT ORGANISATIONAL CAPABILITY** (the venue plainly does hospitality daily) but not established as a distinct external catering service beyond the venue itself | No evidence of off-site catering as a service |
| Cultural production | **CURRENT ORGANISATIONAL CAPABILITY** — clearly ongoing (Parco programming, exhibitions historically) | Owner-confirmed current Parco activity (§5) is itself evidence of live cultural production capability |
| Public-space programming | **CURRENT ORGANISATIONAL CAPABILITY**, evidenced directly by the current Parco pact and current Parco activity | Working Paper v0.3 §13 (Comune pact) + owner confirmation of current activity |
| Schools | **HISTORICAL CAPABILITY** | 2016–2024 examples exist; no 2026 evidence |
| Public-administration collaboration | **CURRENT ORGANISATIONAL CAPABILITY**, evidenced by the active Parco pact | Working Paper v0.3 §13; the pact's 36-month term (from May 2025) means it is very likely still current, though this session did not independently re-verify the pact's status |
| Cultural partnerships | **HISTORICAL CAPABILITY**, current instances not established | Long partner roster (Working Paper v0.3, `programme-history.md` §13) is historical; no current partner confirmed as active this session |
| Research/experimental collaboration | **PROPOSAL ONLY**, per the working paper's own treatment of SEGNI DI PACE, Sencity, and the 2026 Cineporto/Parco draft | Working Paper v0.3 §13 explicitly labels these as submitted/drafted, not delivered |

**MePA registration caution applied directly:** none of the above is elevated to "current bookable service" merely because the cooperative's MePA filing (November 2025) lists a matching category. Per Working Paper v0.3 §13 and Institutional Architecture v1 §7/§12, MePA registration indicates procurement-eligibility positioning, not delivery evidence, and this document does not treat it otherwise.

---

## 9. Current organisation public facts

| Fact | Publicly necessary? | Useful? | Optional? | Internal only? | Current verification status |
|---|---|---|---|---|---|
| Legal name (Cooperativa L'Altro Spazio) | YES | — | — | — | CURRENT VERIFIED (Working Paper v0.3 §13, registration 27 June 2022) |
| Legal form (cooperative) | YES, in general terms | — | — | — | CURRENT VERIFIED as "a cooperative"; the specific Italian sub-type (e.g. tipo A/B social cooperative) is **NOT ESTABLISHED** in any evidence reviewed and should not be guessed |
| Registration/fiscal identification (VAT/tax code) | Only where legally required (e.g. formal contracts, invoicing) | Low for general public page | YES for footer/legal page if required | Mostly | NOT ESTABLISHED here (repository confidentiality boundary explicitly excludes tax identifiers; a legally-required disclosure is a separate, narrow need from general public copy) |
| Registered/operating address | YES (as the Via Nazario operating address) | — | — | — | CURRENT VERIFIED as Via Nazario Sauro 24/F for operations; whether this is also the cooperative's own registered legal seat is **NOT ESTABLISHED** |
| Contact (phone/email) | YES | — | — | — | CURRENT VERIFIED (§2) |
| Relationship to the "L'Altro Spazio" public identity | YES — this is exactly the disambiguation Institutional Architecture v1 §5 already designed | — | — | — | Resolvable from existing evidence; no new owner input needed |
| Full board composition | NO | Low for general public | — | Mostly internal, unless legally required elsewhere | Current legal representative is explicitly UNRESOLVED per Working Paper v0.3 §16 (two conflicting internal records five weeks apart) — do not publish a guess |
| Legal representative's biography | NO | Low | Could be optional if a "meet the founders" page is later chosen (Institutional Architecture v1 §21, decision 2) | Mostly | Not established / not needed absent that separate decision |
| Complete governance history | NO | Low for general public; high for a researcher/journalist reader | Belongs on History, not Organisation | Mostly historical, already covered by Working Paper v0.3 | Historical facts already available; no current gap here |
| Worker/team list | NO, per Institutional Architecture v1 §21 decision 2 (no team page recommended at v1) | Low | Optional later, with consent | Yes | Current workforce composition explicitly NOT ESTABLISHED |
| MePA/procurement registration detail | NO as a headline claim | Some, for a public-administration or company reader specifically | Could be a footnote on a Work-with-us page | Mostly | CURRENT VERIFIED as a filing (Nov 2025), but per §8 above it is not evidence of delivery |

**Team page evaluated directly, per Task 8's instruction:** a public team page is **not currently useful** — no current workforce composition is verified, the unverified 50%/80% figures must not be replaced by a guess, and Institutional Architecture v1 already recommends against one at v1 (decision 2). Nothing found in this session changes that recommendation.

---

## 10. Owner-decision reduction

Reviewing all 10 decisions from Institutional Architecture v1 §21 against what current-state verification actually resolved.

| # | Decision (short) | Classification | Basis for classification |
|---|---|---|---|
| 1 | Name a current legal representative on the ORGANISATION page? | **C — owner decision needed before content draft** | Still genuinely unresolved (Working Paper v0.3 §16); this session did not check a current Chamber-of-Commerce registry extract, which is the only thing that could resolve it without the owner |
| 2 | Public team/staff page at all? | **B — safe default, no owner decision needed yet** | Current-state verification confirms no workforce composition is available to publish; the architecture's "no team page at v1" default is directly supported, not just assumed |
| 3 | How much origin-narrative material becomes public copy? | **C — owner decision needed before content draft** | This is a consent question about personal material, not a factual one; nothing in current-state verification resolves it |
| 4 | Assert Cena al Buio's current cadence? | **B — safe default, no owner decision needed yet** | This session's limited live check found no 2026 evidence either way; the architecture's default (describe as a decade-old current format, no asserted cadence) remains exactly correct and requires no owner input to proceed |
| 5 | Credit Associazione Farm publicly for Parco? | **B — safe default, no owner decision needed yet** | The architecture's default ("a seasonal cultural programme run in collaboration with Associazione Farm and the Comune di Bologna") is safe and does not require owner sign-off to draft with; can be refined later |
| 6 | Standing answer for the 80% figure if asked | **C — owner decision needed before content draft** | Unchanged; this is a reputational/communications judgment call only the owner can make, and current-state work adds a complication rather than resolving it — a *third*, different, unverified figure (50%) is now live on the current production site, making a clear standing answer more urgent, not less |
| 7 | Build Research & Evidence layer now or later? | **E — can defer** | Already effectively resolved by the architecture's own recommended default (defer); nothing in current-state verification changes that |
| 8 | Framing for Via Nazario S.r.l. → cooperative relationship | **A — already resolvable from evidence/architecture** | Working Paper v0.3 §13's affitto d'azienda account is clear enough to state plainly: "operated by Cooperativa L'Altro Spazio" |
| 9 | CripMinds link at all? | **E — can defer** | No urgency; nothing currently depends on it |
| 10 | Commission the current accessibility audit? | **D — owner decision needed before launch** (elevated from a content-draft dependency to an explicit launch-blocking one) | This session's accessibility matrix (§3) confirms the gap is exactly as large as the architecture predicted — this is now the clearest single blocker to real Visit/Accessibility content, and it requires an owner *action* (commissioning it), not just a decision |

**Result: the list of 10 shrinks to 4 items genuinely requiring immediate owner input** (1, 3, 6, 10) — see §15. Items 2, 4, 5, 7, 8, 9 are resolved or safely defaulted without further owner involvement.

---

## 11. Current content authority matrix

| Information family | Authority for a CURRENT claim | Note |
|---|---|---|
| Venue address | Live operational/current formal evidence — corroborated this session by two independent live public sources (production site + Facebook Page) | |
| Current hours | Owner/operations, once confirmed — **not** the live Facebook "Always open" field, which is treated as unreliable, not authoritative, despite being live | This is the clearest instance in this document of "a live public source is not automatically authoritative" |
| Current closure | Canonical notice (`content/notices/`) + owner confirmation | Minor date discrepancy noted in §2 |
| Current access condition | Current on-site verification only (§3, §4) | Historical accessibility evidence is never authority for a current claim |
| Current programme status | Programme owner/current schedule; live social posts may corroborate but do not themselves establish canonical status | Used cautiously in §6 |
| Current event | Canonical event record (none currently exist) | Live Facebook event mentions (§5, §6) are evidence a canonical record *could* be created from, not a substitute for one |
| Current service | Owner/service lead + a current offer document | MePA filing is not sufficient authority alone (§8) |
| Current partner | Active agreement / explicit current confirmation | The Parco/Comune pact is the one active agreement with reasonably current standing; others are historical unless reconfirmed |
| Current governance | Current formal record (e.g. Chamber-of-Commerce registry extract) or owner confirmation | Not resolved this session (§10, decision 1) |
| Historical fact | Institutional evidence base (Working Paper v0.3 and its registers) | Unchanged from the architecture's own model |

**Standing rule applied throughout this document, restated once here:** old Facebook posts, old press, and historical interviews are never authority for a current condition. Where this document used a *recent* (June–July 2026) live Facebook post as corroborating evidence, it did so only for present-tense facts within days or weeks of the working date — not as a substitute for canonical records, and always labelled LIVE-PUBLIC-SOURCE rather than CURRENT VERIFIED where no second source agreed.

---

## 12. Freshness/expiry model

| Category | Examples from this document | Recheck rule |
|---|---|---|
| **STABLE** | Venue name, address, legal name, coordinates | Verify only on operational/legal change |
| **SEMI-STABLE** | Contact channels, social handles, organisational relationship framing | Review roughly every few months or on any known change |
| **SEASONAL** | Parco operating status, Parco season dates | Reverify each season; do not carry last year's dates forward |
| **VOLATILE** | Hours (once established), programme cadence, current services | Recheck frequently; do not let a stated cadence go stale silently |
| **EVENT-SPECIFIC** | Any accessibility fact tied to a specific event rather than the venue baseline | Set and verified per event, at authoring time |
| **TEMPORARY** | The August 2026 closure notice | Already has an explicit expiry; the model already works — extend it, don't replace it |

Applied specifically: the accessibility matrix (§3) sits mostly in VOLATILE/EVENT-SPECIFIC once populated, because physical conditions and staffing can change faster than institutional content should assume. The organisation facts in §9 sit mostly in STABLE/SEMI-STABLE, except current governance (§10, decision 1), which behaves more like VOLATILE until the March 2026 conflict is resolved.

---

## 13. Implementation-blocker matrix

| Unresolved current fact | Blocks architecture? | Blocks schema? | Blocks copy draft? | Blocks development? | Blocks public launch? |
|---|---|---|---|---|---|
| Regular opening hours | NO | NO | PARTIAL (Visit-page copy specifically) | NO | YES (cannot publish false/absent hours as if resolved) |
| Physical/visual/Deaf-communication accessibility conditions | NO | NO | PARTIAL (Accessibility-section copy specifically) | NO | YES (for any specific accessibility claim; a well-labelled "to be confirmed" state does not block launch) |
| Current legal representative | NO | NO | PARTIAL (Organisation-page copy specifically) | NO | NO (can launch with the entity fact alone, omitting a named individual) |
| Current Cena al Buio cadence | NO | NO | PARTIAL | NO | NO (safe default copy exists, §10 item 4) |
| Current services list | NO | NO | PARTIAL (Work-with-us copy) | NO | NO (can launch with capabilities honestly framed as historical/organisational rather than currently bookable) |
| Origin-narrative public-use consent | NO | NO | PARTIAL (Our-approach depth) | NO | NO |
| Parco season end date | NO | NO | PARTIAL | NO | NO |
| Second phone number's intended public role | NO | NO | PARTIAL (Contact copy) | NO | NO |

**The load-bearing conclusion:** almost nothing here blocks architecture, schema design, or development work from proceeding. Only two items are real launch blockers as stated (hours, accessibility conditions), and both are already known, already actionable (§4), and already owned by the accessibility-audit decision (§10, item 10). Everything else can proceed in parallel with those two items still open.

---

## 14. Implementation readiness

Per the greenfield notice: every item below is evaluated as a **new, from-scratch** undertaking. None assumes reuse of the existing frontend, components, routes, or content schemas.

| Work item | Readiness | Why |
|---|---|---|
| A. Content schema/model design (new) | **READY NOW**, informed by §7's core-work/manifestations principle and the authority/freshness models in §11–§12 | Nothing here depends on the two open accessibility/hours facts; the modeling principles are independent of the specific current values |
| B. Durable page copy (Our approach, History) | **READY NOW** | Draws on Working Paper v0.3 and Institutional Architecture v1, neither of which depends on current-state verification |
| C. Visit-page operational copy | **READY AFTER OWNER ANSWER** (hours) **AND READY AFTER ACCESSIBILITY CHECK** | Cannot honestly draft "when you can go and what you'll find" without both |
| D. Accessibility component/data model (new) | **READY NOW** for the *structure* (the nine-dimension schema shape); **NOT READY** for populated content until §4's checklist is run | The model doesn't need real values to be designed correctly |
| E. Programme/work records (new) | **READY NOW** for the structural pattern (§7); **PARTIAL** for actual current-status values, several of which are "recent but unverified" (§6) | Structure and content are separable; structure can proceed |
| F. Services/collaboration copy | **READY AFTER OWNER ANSWER** is not strictly required, but genuinely benefits from decision 6 (the 80%-figure standing line) being settled first, since services copy and the workforce-figure question sit close together in tone | Mostly READY NOW with one soft dependency |
| G. Visual design system (new) | **NOT READY** — out of scope for this document entirely; explicitly a later phase per the greenfield sequence the owner specified (institutional evidence → architecture → current state → new content model → new creative direction → ...) | Not evaluated here at all |
| H. React (or any) frontend implementation | **NOT READY** — depends on G and on a technical-architecture evaluation the owner explicitly reserved for its own later phase | Same reason as G |

**Explicit restatement per the owner's direction:** A, B, D (structure), and E (structure) can begin without waiting on the two real blockers (hours, accessibility). C and, to a lesser degree, F should wait. G and H should not begin at all yet — they belong to phases the owner has explicitly placed after "new content model" and "new creative/design direction," neither of which this document performs.

---

## 15. Questions requiring owner input

Reduced to the smallest useful set, per §10's analysis.

**QUESTION 1:**
Is the owner ready to commission the on-site accessibility check (§4's 30–60 minute checklist) in the near term, and if so, who will complete it?
**WHY IT MATTERS:** This is the single largest concrete blocker to real Visit/Accessibility copy (§13), and the checklist is now ready to hand to someone.
**RECOMMENDED DEFAULT:** Owner or a trusted staff member completes §4 within the next few weeks, scoped to Via Nazario first.
**BLOCKS:** Public launch of any specific accessibility claim (not architecture, schema, or most copy drafting).

**QUESTION 2:**
Should the current legal representative be named anywhere on a future Organisation page, given the unresolved March 2026 board-record conflict (Working Paper v0.3 §16)?
**WHY IT MATTERS:** Publishing a guess risks being wrong; omitting looks incomplete to a funder/Comune reader; only the owner (or a fresh registry check the owner authorizes) can resolve this.
**RECOMMENDED DEFAULT:** Omit a named individual; state only the cooperative's name and registration date until resolved.
**BLOCKS:** Organisation-page copy draft only; not architecture, schema, or launch.

**QUESTION 3:**
How much of the personal origin-narrative material (Nunzia's and Jascha's own stories) is the owner comfortable seeing used in future public copy, and in what form?
**WHY IT MATTERS:** This is genuinely distinctive material, but it involves personal biographical content prepared for internal research, not cleared public use.
**RECOMMENDED DEFAULT:** Reserve for compressed, owner-reviewed use only; no verbatim publication without explicit sign-off.
**BLOCKS:** Depth of Our-approach copy only; a workable version exists without it.

**QUESTION 4:**
Given that the currently-live production site already states a third, different, unverified disabled-staff figure (50%, distinct from the working paper's 2022 self-reported 80%), what should the standing answer be if a visitor or journalist asks about workforce composition before any new figure is verified?
**WHY IT MATTERS:** Two different unverified numbers are now circulating in public (80% historically claimed, 50% currently live); a consistent, honest standing line prevents a third accidental one from appearing when the new site launches.
**RECOMMENDED DEFAULT:** A short, honest line acknowledging past figures were self-reported and not re-measured, declining to repeat either number as current fact.
**BLOCKS:** Services/organisation copy tone only; not launch-critical on its own, but increasingly urgent given the live discrepancy.

---

## 16. What remains unknown

- Regular opening hours (Via Nazario).
- Full current physical/visual/Deaf-communication/hearing/cognitive accessibility conditions at Via Nazario (§3, §4 pending).
- Parco's own accessibility profile, distinct from Via Nazario's.
- The exact first day of the current closure (12 vs. 13 August — a one-day discrepancy between the owner's statement and the committed notice record).
- Current Parco season end date.
- Current legal representative / board composition (Working Paper v0.3 §16, unresolved, not addressed further this session).
- Current cadence of Cena al Buio, Aperitivo dal Mondo, and most named historical programmes beyond what a narrow recent-post check could confirm.
- Whether Associazione Farm currently holds any distinct public-facing role at Parco.
- Whether the second phone number (info/collaborations) is intended by the owner as a public-facing channel on a new site.
- The cooperative's specific legal sub-type and whether its registered legal seat matches the Via Nazario operating address.
- Current status of historical partnerships beyond the active Parco/Comune pact.

None of the above blocks architecture, schema design, or the bulk of copy drafting (§13). Each is either already routed to an owner question (§15) or already carries a safe, non-blocking default (§10).

---

## 17. Recommended immediate next step

Begin **A (content schema/model design)** and **B (durable page copy for Our approach and History)** now, in parallel with the owner completing the on-site accessibility check (§4) and answering the four questions in §15. Do not begin visual design or frontend implementation (G, H) — those remain properly sequenced after a new content model and new creative direction, per the owner's greenfield direction, neither of which this document produces.

---

*End of Current Public State & Implementation Readiness v1. This document is a present-tense verification record. It does not replace Working Paper v0.3 (historical synthesis) or Institutional Architecture v1 (public information architecture), and it does not authorize or perform any implementation.*
