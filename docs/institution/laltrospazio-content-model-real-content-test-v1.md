# L'Altro Spazio — Content Model Real-Content Stress Test v1

**Working date:** 16 August 2026
**Status:** Model-validation document. Instantiates the Greenfield Content Model v1 (`laltrospazio-content-model-v1.md`, as corrected by this document) against real, evidence-backed L'Altro Spazio content, to find out whether the model survives actual material before it is treated as canonical.
**Tests, does not redesign:** This document does not propose a better ontology for its own sake. Every change recorded in §26 was caused by a specific, named real instance failing to fit the model as originally written — not by a preference for elegance.
**Greenfield discipline maintained:** No legacy frontend, routes, `content/*.json`, or old schemas were inspected. Sources used: Working Paper v0.3, Institutional & Public Information Architecture v1, Current Public State & Implementation Readiness v1, and the content model itself.
**No code, no schema, no visual design:** All records below are human-readable conceptual instantiations — structured Markdown, not JSON/TypeScript/Zod.

---

## 1. Purpose and method

The content model (`laltrospazio-content-model-v1.md`, commits `bec71db` + `445c8fa` on `feature/greenfield-content-model-v1`) was designed and internally corrected without being pushed against a single real record. This document does that pushing. The question throughout is **"can real L'Altro Spazio material live naturally inside this model?"** — not "can the ontology be made more elegant?"

Method: instantiate thirteen representative real (plus one clearly-labelled synthetic) content items in conceptual form; run the model's own relationships, lifecycle rules, freshness mechanism, and provenance layer against each; only then run the cross-cutting stress tests (partnership, season, place operational-state, freshness, provenance, duplication, entity necessity, boundary questions, public-identity). Where a real instance exposed a genuine semantic problem, `laltrospazio-content-model-v1.md` was corrected surgically (§26 records exactly what and why); where an instance simply confirmed the model works, no change was made.

---

## 2. Test corpus

| # | Item | Entity type(s) exercised |
|---|---|---|
| 1 | Via Nazario Sauro 24/F | PLACE, operator, NOTICE, CONTACT CHANNEL, ACCESS PROFILE |
| 2 | Parco 11 Settembre + Summer 2026 season | PLACE, SEASON, EVENT, PARTNERSHIP |
| 3 | Via Polese 7 | PLACE (historical), ORGANISATION (historical), HISTORY ENTRY |
| 4 | Cena al Buio | WORK |
| 5 | Cena al Buio — Halloween 2025 | EVENT |
| 6 | Cena al Buio — December 2025 corporate proposal | SERVICE |
| 7 | Cultura Verde | PROJECT (full lifecycle) |
| 8 | SEGNI DI PACE | PROJECT (partial lifecycle) |
| 9 | Booking/info contact channels | CONTACT CHANNEL |
| 10 | Via Nazario accessibility facts | ACCESS PROFILE |
| 11 | Synthetic temporary-access-limitation fixture | NOTICE + ACCESS PROFILE (labelled non-factual) |
| 12 | 24 April 2015 incorporation | HISTORY ENTRY |
| 13 | "Understanding L'Altro Spazio as a practice of environments" | ARTICLE |

Cross-cutting: PARTNERSHIP, SEASON, PLACE operational-state, freshness, provenance, duplication, entity necessity, WORK/EVENT/SERVICE/PROJECT boundaries, ARTICLE vs. HISTORY ENTRY, public identity, homepage assembly.

---

## 3. Via Nazario instantiation

| Field | Value | Provenance |
|---|---|---|
| identity | L'Altro Spazio — Via Nazario Sauro; Via Nazario Sauro 24/F, 40121 Bologna | `VERIFIED-CURRENT` — repository canonical, cross-checked against a live Facebook Page "Intro" field independent of the legacy site (Current Public State v1 §2) |
| lifecycle | `ACTIVE` | Established by continuous operation since 2015; no evidence of closure |
| operating_pattern | `YEAR-ROUND` | No evidence of seasonal variation distinct from the single recorded closure (Current Public State v1 §2) |
| operator | Cooperativa L'Altro Spazio (ORGANISATION, current) | `VERIFIED-CURRENT` — the March 2025 affitto d'azienda transferred the operating business from L'Altro Spazio S.r.l. to the cooperative (Working Paper v0.3 §13) |
| availability status (derived, not stored) | Reads as **currently closed** — not because lifecycle changed, but because an `ACTIVE` NOTICE overrides the default `ACTIVE`+`YEAR-ROUND` reading | See NOTICE row below |
| schedule | `NEEDS-VERIFICATION` — no regular hours established; a live source claims "Always open," explicitly rejected as implausible and non-authoritative (Current Public State v1 §2, §11) | This is the field whose absence must never be mistaken for availability status answering "open right now" — see §18 |

**NOTICE (scope = this PLACE):**

| Field | Value |
|---|---|
| scope_target | PLACE — Via Nazario |
| effective_start / effective_end | 12 August 2026 → 26 August 2026, inclusive; reopens 27 August |
| severity | closure-level |
| public_message | "Temporarily closed 12–26 August 2026; reopens 27 August" (functional placeholder, not final copy) |
| source/authority | Direct owner confirmation, this working session (Current Public State v1 §2) |
| status | `ACTIVE` as of the 16 August 2026 working date (inside the effective window) |
| migration note (internal only) | The existing canonical notice record states `valid_from: 2026-08-13` — one day later than the owner-confirmed 12 August start. This is a legacy-record discrepancy, not a current-fact conflict; the owner-confirmed date is authoritative for this instantiation and any future record derived from it (Current Public State v1 §2). |

**CONTACT CHANNEL(s), owner = this PLACE:**

| purpose | value | verification | note |
|---|---|---|---|
| booking | WhatsApp +39 351 704 8064 | `VERIFIED-CURRENT` (repository canonical + independent live cross-check) | preferred channel |
| general-info | nazariosauro@altrospazio.org | `VERIFIED-CURRENT` (upgraded this session from `NEEDS-VERIFICATION` by independent live cross-check) | |
| candidate — purpose unconfirmed | +39 347 327 6768, live source labels it "info & collaborazioni" | value: `NEEDS-VERIFICATION` (real, live-evidenced number); **purpose: `NEEDS-VERIFICATION`, explicitly not owner-confirmed for the new site** | **Not instantiated as a public-facing channel.** Per instruction, its purpose is not assigned as fact — only recorded as a live source's claim, pending owner confirmation. `public/private` defaults to not-yet-designated-public until confirmed. |

**ACCESS PROFILE:** see §12.

**Historical operator note:** Via Nazario's operator relationship is a *current* pointer only (Cooperativa). The fact that L'Altro Spazio S.r.l. operated it from 2015–2025 is not a second live "operator" field — it lives as a HISTORY ENTRY (subject_ref = this PLACE, narrative: "operating business transferred from L'Altro Spazio S.r.l. to Cooperativa L'Altro Spazio via affitto d'azienda, March 2025"). A single polymorphic subject_ref, with the other party named in prose, proved sufficient — no dedicated "operator history" list was needed.

**Result: clean instantiation, no forced duplication, no impossible lifecycle.** This is also the first live confirmation that §5's own pre-existing worked example (written before any real record existed) matches the actual current data exactly.

---

## 4. Parco 11 Settembre + 2026 season instantiation

| Field | Value | Provenance |
|---|---|---|
| identity | Parco 11 Settembre | Repository canonical |
| lifecycle | `ACTIVE` | Owner-confirmed current activity, this session |
| operating_pattern | `SEASONAL` | Structural fact — an outdoor public-park cultural programme, not a year-round venue |
| operator | Cooperativa L'Altro Spazio | Owner-confirmed: "operates both Via Nazario and Parco since the 2025 board actions" (Working Paper v0.3 §13) — **see the operator clarification below; this is not a claim of site ownership** |
| schedule | `NEEDS-VERIFICATION` — exact daily hours not established | Current Public State v1 §5 |

**Operator clarification (this is where the real-content test found a genuine ambiguity):** Parco is a public park; the cooperative does not own or manage the physical site the way it leases Via Nazario. `operator` here means "the ORGANISATION responsible for L'Altro Spazio's activity at this place," not facility control. Site-level authority is a separate fact, carried entirely by the PARTNERSHIP below, not by this field — this distinction is now stated explicitly in the corrected model (§5).

**SEASON:**

| Field | Value |
|---|---|
| identity | "Parco 11 Settembre — Summer 2026" |
| occurs_at | PLACE — Parco 11 Settembre |
| status | `CURRENT` |
| start_date | `NEEDS-VERIFICATION` — evidence shows activity from at least 19 June 2026 posts onward; no declared start date exists |
| end_date | `NEEDS-VERIFICATION` — not established |
| instantiates (WORK) | Left unset/generic — evidence shows a *mix* of activity (concerts, a poetry series, general programming) that does not map cleanly to one single WORK identity for this specific season instance; see §17 |
| groups | Individual dated EVENTs as they are canonicalised (e.g. the 27 June concert, the 7–21 July poetry series — currently only live-Facebook-evidenced, not yet in a canonical event registry, Current Public State v1 §5) |

**Availability status (derived):** reads as **seasonally active** because "now" (16 August 2026) falls inside this SEASON's `CURRENT` window. This licenses "Parco activity is active this summer." **It does not license "Parco is open right now"** — that would additionally require a populated schedule and a real-time clock check, neither of which this model performs. This is the exact distinction the brief asked to be tested for, and it is the reason §5 and §18 of the content model were corrected (§26, Model Change 1).

**PARTNERSHIP (Comune di Bologna):**

| Field | Value |
|---|---|
| partner_name | Comune di Bologna |
| relationship_type | `FORMAL-PUBLIC-ADMINISTRATION-AGREEMENT` |
| status | `ACTIVE` |
| scope_ref | **both** WORK (Parco/Cineporto cultural programming) **and** PLACE (Parco) — a real case of a partnership scoped to more than one target at once, which the corrected model now states explicitly is permitted (§26, Model Change 7) |
| dates | Signed 21 May 2025; 36-month term |
| evidence | Working Paper v0.3 §13 (S18); `VERIFIED-HISTORICAL` for the signing fact, `VERIFIED-CURRENT` for the ongoing-term claim |

**Result: this is the instance that most directly exercised the "seasonally active ≠ open now" distinction the brief specifically worried about, and it surfaced a genuine (if narrow) semantic risk in the original model's phrasing — corrected in §26, Model Change 1. It also surfaced the operator/site-ownership ambiguity (Model Change 2) and the multi-target PARTNERSHIP scope question (Model Change 7).**

---

## 5. Via Polese instantiation

| Field | Value | Provenance |
|---|---|---|
| identity | Via Polese 7, Bologna | `DOCUMENTED` (Working Paper v0.3 §4) |
| lifecycle | `HISTORICAL` | Closed since 2014; never reopened |
| operating_pattern | `YEAR-ROUND` (preserved as historical fact, not a currently-meaningful field) | Working Paper v0.3 §4 |
| operator (historical) | Associazione L'Altro Spazio (ORGANISATION, lifecycle = `HISTORICAL`) | `OWNER-CONFIRMED` per Working Paper v0.3 §4 |

**HISTORY ENTRY:**

| Field | Value |
|---|---|
| subject_ref | PLACE — Via Polese 7 |
| date | April 2014 |
| discontinuity | `true` |
| narrative | "Via Polese 7 operated from February to April 2014, run by Associazione L'Altro Spazio. Closed after serious water damage; the association ceased operating shortly afterward." |
| evidence | Working Paper v0.3 §4, §11 (C-FB-01, C-FB-02) |
| public-safety flag | Public-safe — this is exactly the class of discontinuity Working Paper v0.3 §17 licenses stating at the organisational-lesson level |

**Access/programme facts (deafblind framing, per a 1914... [sic — 2014] Swiss press article) are not instantiated as a formal ACCESS PROFILE.** They live entirely as HISTORY ENTRY / ARTICLE narrative. This is a deliberate, confirmed choice, not a gap: a closed place with nobody re-verifying anything does not need a live, recheck-bearing ACCESS PROFILE record — narrative is the correct home for historical access framing once a place is `HISTORICAL`.

**Invariant check:** Invariant 2 (lifecycle = HISTORICAL never in a current Visit listing) and Invariant 13 (a page naming a historical place must state its closure in the same view) both apply cleanly and were not stressed by anything unusual here.

**Result: clean pass, no findings.** This is the strongest confirmation in the corpus that the current/historical boundary (§7 of the content model) works exactly as designed once real dates and real closure causes are dropped in.

---

## 6. Cena al Buio — core WORK

| Field | Value | Provenance |
|---|---|---|
| identity | "Cena al Buio" (formerly "aperitivo al buio," briefly "Prove al Buio") | `DOCUMENTED` — decade-long Facebook trace, Working Paper v0.3 §8 |
| status | `CURRENT` | Real-world claim: this is a durable, currently-offered format, not a concluded one |
| last_verified | ~31 October 2025 (last dated public occurrence found in evidence) | Working Paper v0.3 §8 |
| review_after | **Not asserted a specific value here** — see §19; this stress test deliberately does not invent a threshold |
| freshness condition (qualitative, not asserted with a specific number) | Given ~10 months with no further public dated occurrence and no reconfirmation, this record would plausibly read `REVIEW_DUE` or `STALE` under most reasonable recheck cadences — the exact threshold is a later editorial-policy decision, not fixed here |
| documented_by | ARTICLE (placeholder title: "Cena al Buio: a decade of one mechanism") + HISTORY ENTRY (the 2024 promotional-gap note, explicitly labelled unexplained rather than resolved, Working Paper v0.3 §11) |

**Manifestations:** one EVENT (§7), one SERVICE (§8). Zero currently-scheduled public EVENTs exist as of the working date — **this does not touch `status`, which stays `CURRENT`.**

**Result: clean pass on the durable-identity question.** The real stress came from this WORK's manifestations, not from the WORK record itself — see §7–8 below.

---

## 7. Cena al Buio — Halloween 2025 EVENT

| Field | Value | Provenance |
|---|---|---|
| title | "Cena al Buio — Halloween 2025" (functional placeholder) | Working Paper v0.3 §8 |
| date | 31 October 2025 | `DOCUMENTED` |
| date-status | `OCCURRED` | |
| references (WORK) | Cena al Buio | Direct |
| occurs_at (PLACE) | Via Nazario — **inferred, not independently document-confirmed for this specific instance** | By 2025, Via Nazario and Parco were the organisation's only two active addresses (Working Paper v0.3 §10); Parco is not a plausible host for an indoor dark-dining format, so Via Nazario is the reasonable inference, but the evidence excerpted for this paper does not name the venue explicitly for this specific night. Marked accordingly rather than asserted with false confidence. |
| access_override | None set — no event-specific access facts published for this occurrence | Absence, not a gap requiring a value |

**Result: clean pass, with one useful confirmation** — the model tolerates a relationship field (`occurs_at`) carrying a stated confidence caveat ("inferred, not confirmed for this instance") exactly as cleanly as a scalar field can. No change required; this is the field-level provenance granularity §17 already claimed, now demonstrated on a relationship rather than a plain value.

---

## 8. Cena al Buio — SERVICE manifestation (the December 2025 corporate proposal)

This turned out to be **the single most revealing instance in the entire corpus.**

| Field | Value | Provenance |
|---|---|---|
| manifests_from (WORK) | Cena al Buio | Direct |
| audience | B2B / corporate | Working Paper v0.3 §13 (S24) |
| status | `CURRENT-SERVICE` | See reasoning below |
| last_verified | December 2025 (the date of the commercial proposal document itself) | Working Paper v0.3 §13; Current Public State v1 §8 |
| freshness condition (qualitative) | ~8 months with **zero 2026 confirmation of any actual delivered booking** (Current Public State v1 §8) — plausibly `STALE` under most reasonable cadences | Not asserted with an invented specific threshold |

**Why `CURRENT-SERVICE`, not `PROPOSED`, and why this matters:** the evidence shows a real, externally-facing commercial offer with defined formats, pricing, and an optional training module existed and was presumably being pitched as of December 2025 — that is a stronger, more advanced fact than "an internal decision to pursue" (which is what `PROPOSED` means). Per the model's own state/evidence discipline (Design Principle 11, applied identically to PROJECT in the prior integrity pass): **the record keeps its last-confirmed real-world state; it is not retroactively downgraded just because time has passed without reconfirmation.** Downgrading it to `PROPOSED` here would have been dishonest in the other direction — pretending a real, evidenced offer was merely a plan.

**But this is exactly where the model, as originally written, had a real gap.** The brief's own instruction — "test whether SERVICE can represent an evidenced offer whose current availability is not yet confirmed... do not convert proposal evidence into current bookable" — is precisely the case where `status = CURRENT-SERVICE` (correct) plus a STALE freshness condition needs to jointly prevent the record from rendering as freely bookable *right now*. The original Invariant 4 only protected ACCESS PROFILE dimensions from this exact failure mode; nothing stopped a STALE-but-technically-CURRENT-SERVICE record from rendering an active booking call-to-action. **This gap is now closed** — Invariant 4 was generalized (§26, Model Change 4) to cover any entity, not only accessibility, and this SERVICE instance is the reason why.

**Result: genuine finding, now fixed.** Before the fix, Quality Gate 6 ("can the service manifestation exist without claiming current bookability?") would have passed only by accident, on the strength of good intentions rather than an enforced rule. After the fix, it passes structurally.

---

## 9. Cultura Verde — PROJECT (full lifecycle)

| Transition | Evidence | Status reached |
|---|---|---|
| SUBMITTED | Application to Comune di Bologna, Quartiere Porto-Saragozza | — |
| AWARDED | May 2024, €8,000, scored 81 points — a formal award decision | `AWARDED` |
| ACTIVE | "Il Porto Verde di Bologna" children's programme delivered in 2024; independently corroborated by a July 2024 Facebook credit line naming "Coop L'Altro Spazio" alongside Associazione Farm and three other, unnamed partners | `ACTIVE` |
| COMPLETED | Associated financial contribution liquidated in 2025 after eligible expenditure reported | `COMPLETED` |

| Field | Value | Provenance |
|---|---|---|
| relates_to (WORK) | Parco / Cineporto cultural programming | Working Paper v0.3 §13 |
| produces (EVENT) | "Il Porto Ritrovato" children's workshop programme, ~July 2024, occurs_at Parco — **the exact name-match between "Cultura Verde" (the funded project) and "Il Porto Ritrovato" (the credited workshop programme) rests on the working paper's own inference that the July 2024 post corroborates the funded project's delivery, not on an explicit one-to-one document match; represented here with that caveat rather than false precision** | Working Paper v0.3 §13 |
| involves (PARTNERSHIP) | Associazione Farm (scope = this PROJECT, status = `PAST` now that this specific funded activity has concluded) + three further, unnamed partners (not instantiated — the evidence does not name them, and this stress test does not invent names to complete the record) | Working Paper v0.3 §13 |
| editorial (public-safe) | "A 2024 Comune-funded programme of concerts, art and reading activities in Parco 11 Settembre's Porto Verde area, delivered in partnership with Associazione Farm and other local organisations." No participation figures, no impact claims. | Consistent with the exclusion of an impact-metrics entity (§23 of the content model) |

**A genuinely useful confirmation:** Associazione Farm needed **two separate PARTNERSHIP records** here — one scoped to this specific, now-`PAST` PROJECT, and a separate one (§4) scoped to the ongoing WORK/PLACE relationship at Parco generally, which remains `ACTIVE`. The same real partner, two independently-statused scoped relationships, exactly as the lightweight PARTNERSHIP design intended.

**Result: clean pass, and the strongest available confirmation of the PROJECT lifecycle model exactly as originally designed** (this is the case the content model's own §8 was already built around, and real instantiation changed nothing about it).

---

## 10. SEGNI DI PACE — PROJECT (partial lifecycle, deliberately incomplete)

| Field | Value | Provenance |
|---|---|---|
| status | `SUBMITTED` | Formal application to Regione Emilia-Romagna, March 2026, €18,000 budget |
| involves (PARTNERSHIP) | One organisation, `status = LETTER-OF-SUPPORT`, scope = this PROJECT | Signed letter of adhesion, Working Paper v0.3 §13 |
| last_verified | March 2026 | |
| freshness condition (qualitative) | ~5 months with no confirmed resolution as of the working date — a plausible `REVIEW_DUE` candidate under most reasonable grant-timeline cadences, not asserted with an invented number | Consistent with §19's finding |
| What current evidence does **not** establish | Award, implementation, achieved targets, or that any proposed partner beyond the one signed adhesion actually participated | Working Paper v0.3 §13 |

**This is not a lifecycle failure — it is the model working exactly as intended.** The record simply stays at `SUBMITTED`. Nothing in the model invents a "we don't know" status for it (that discipline was already established in the prior integrity pass); this instance is the first time it has been tested against a real, currently-unresolved case rather than a hypothetical one, and it holds.

**Result: clean pass**, and direct, real-world validation that removing `NOT-ESTABLISHED` from PROJECT's status ladder (the previous integrity-pass correction) was the right call — a genuinely unresolved real case does not need it.

---

## 11. Access, contact, and the synthetic fixture

### 11.1 CONTACT CHANNEL — see §3 above (Via Nazario) for the full instantiation, including the deliberately cautious treatment of the second phone number.

### 11.2 ACCESS PROFILE — Via Nazario

| Dimension | Condition | Verification status | Note |
|---|---|---|---|
| Deaf/communication access | WhatsApp/text-based contact available | `VERIFIED-CURRENT` | Live cross-check this session |
| Physical access — entrance/steps/door width | `UNKNOWN` | `NEEDS-VERIFICATION` | 2015-era design intent (a lowered counter) is historical, not a current verification (Current Public State v1 §3) |
| Visual access — Braille/tactile menu | `UNKNOWN` | `NEEDS-VERIFICATION` | Historically documented (2018 Lonely Planet); current availability unconfirmed |
| Physical access — toilet/circulation | `UNKNOWN` | `NEEDS-VERIFICATION` | No current record |
| Hearing/audio — induction loop | `UNKNOWN` (**not** `NOT-PRESENT`) | `NEEDS-VERIFICATION` | Never evidenced anywhere, historical or current — this is genuinely "never checked," not "checked and confirmed absent" |
| Hearing/audio — captioning | `UNKNOWN` (**not** `NOT-PRESENT`) | `NEEDS-VERIFICATION` | Current Public State v1 §3 itself labels this "not available (assumed)" — an unconfirmed assumption, which this model must not silently promote to a confirmed real-world fact |

**This is where the real-content test found a genuine, if narrow, misuse risk:** a naive read of the source material's own "(assumed)" language could tempt an editor to record captioning as `NOT-PRESENT` — a confirmed-absence claim the evidence does not actually support. The corrected model (§26, Model Change 5) now states explicitly that `NOT-PRESENT` requires positive confirming evidence of absence, never mere silence or an assumption.

### 11.3 Synthetic temporary-access-limitation fixture

**No genuinely current, evidence-backed temporary access limitation exists in the repository** distinct from the general venue closure notice already instantiated in §3 (Current Public State v1 §3, item 9: "no current mechanism records this distinct from the general closure-notice system"). Per instruction, a synthetic fixture is used instead, clearly isolated from real fact:

> **SYNTHETIC MODEL TEST ONLY — NOT A REAL L'ALTRO SPAZIO FACT**
> Hypothetical: "Temporary entrance obstruction for construction, 1–5 September [fictional year, chosen only to be clearly outside the real August 2026 closure window], Via Nazario."
> - ACCESS PROFILE dimension: physical access — entrance
> - `temporary_exception_ref` → a fictional NOTICE (scope = PLACE Via Nazario, severity = warning, effective_start/end = the fictional dates above, expiry = the day after effective_end)
> - Baseline ACCESS PROFILE entrance condition: **unchanged** by this fixture — it remains whatever the real, separately-verified baseline says
> - After the fictional expiry: the exception reference lapses and the baseline reasserts itself automatically, with nothing to manually revert

**Why synthetic was necessary:** without it, the model's temporary-exception mechanism (ACCESS PROFILE baseline + scoped NOTICE + auto-expiry, §11) would go entirely untested by real content — the one real current notice (the venue closure) is scoped at the whole-place level, not at a single access dimension, so it does not exercise the dimension-specific `temporary_exception_ref` path at all. This fixture is not, and must never be treated as, a real fact about Via Nazario; it is retained here only to confirm the mechanism is structurally sound, and it must not be carried into any canonical content.

**Result: the mechanism holds** — baseline, event-specific override, and temporary exception remain three genuinely separate paths that never rewrite one another's stored data, confirmed even without a real instance to draw on.

---

## 12. History Entry instantiation

| Field | Value |
|---|---|
| subject_ref | ORGANISATION — L'Altro Spazio S.r.l. |
| date | 24 April 2015 |
| narrative | "L'Altro Spazio S.r.l. incorporated before notary Rossella Ruffini in Bologna; bilingual deed (English operative text, Italian translation appended); 50/50 ownership, Vannuccini as President, Blume as second director." |
| discontinuity | `false` — this is a founding, not a closure |
| evidence | Working Paper v0.3 §5 (C-FB-26), cross-checked against the Bologna Chamber of Commerce's public registry extract |
| consent | Not required — a matter of public notarial/registry record, not personal oral history |

**Why HISTORY ENTRY and not ARTICLE:** atomic (one dated fact), consent-free (no personal narrative content, only a formal registry fact), requires no interpretive framing. The deed's bilingual structure is a genuinely interesting detail, but stating that it exists and what it says is still a fact, not an argument — the interpretive claim ("this reflects the organisation's founding logic," Working Paper v0.3 §5, §14 Proposition 2) belongs in an ARTICLE that *cites* this HISTORY ENTRY, not in the entry itself.

**Result: clean pass**, and a precise, real confirmation of the HISTORY ENTRY / ARTICLE boundary (§16 stress test, below).

---

## 13. ARTICLE / institutional editorial object

| Field | Value |
|---|---|
| title | "Understanding L'Altro Spazio as a practice of environments" (neutral internal placeholder, not final public copy) |
| relates_to | Cooperativa L'Altro Spazio (ORGANISATION, current operator — mentioned, not owned by); Cena al Buio, Cineporto/Parco programming (WORK, illustrative examples); Via Nazario, Parco, Via Polese (PLACE, current and historical); the 24 April 2015 incorporation and Via Polese's closure (HISTORY ENTRY, cited as factual spine) |
| body (conceptual, not final copy) | Draws on Working Paper v0.3 §15's institutional synthesis and Institutional Architecture v1 §2's compressed public-facing versions — a decade-long practice across multiple environments and legal entities, converging two founders' distinct routes into a shared method |
| consent_status | Depends on version: a version drawing only on the already institutionally-sanctioned synthesis (Working Paper v0.3 §15) needs no personal consent; a version incorporating first-person founder quotes (the origin-narrative material) would need `CONSENT-PENDING`/`CONSENT-OBTAINED` tracking per speaker |

**Is ARTICLE a natural fit, or a workaround?** Structurally, a clean fit — nothing about this content's shape (title, body, multiple `relates_to` links, publication status, optional consent) required distortion. **One soft observation, not a defect:** ARTICLE is being asked to hold two things of somewhat different editorial character — long-form interpretive essays (a ten-year case study) and this shorter, more load-bearing, cross-entity summary the homepage structurally depends on. This is worth flagging as a future editorial/UX concern (a possible `article_type` tag distinguishing "summary" from "case-study" from "essay," for authoring convenience) — but it does not distort the data shape, and does not meet the bar the brief sets for creating a new first-class entity ("only if actual instances cannot otherwise be modelled without distortion"). They can. **No PUBLIC IDENTITY entity is needed.**

**Result: ARTICLE holds.** See §24 for the full public-identity test.

---

## 14. Partnership stress test

Two genuinely different real relationship states, both already instantiated above:

**A. Formal/current — the Comune di Bologna Parco pact** (§4): `status = ACTIVE`, `relationship_type = FORMAL-PUBLIC-ADMINISTRATION-AGREEMENT`, multi-target scope (WORK + PLACE), 36-month term, signed 21 May 2025.

**B. Proposed/application-bound — the SEGNI DI PACE letter-of-adhesion partner** (§10): `status = LETTER-OF-SUPPORT`, scope = that one PROJECT only, never rendered on a general partners listing (Invariant 7).

**Critical invariant confirmed:** nothing in either instantiation allows B to be read as a current organisation-wide partner. The lightweight design is sufficient for both a heavyweight, multi-year, multi-target formal pact and a single-document signed letter — differentiated entirely by `relationship_type`, `status`, and `scope_ref`, with no separate entity needed for either case.

**One real, if narrow, gap found and fixed:** PARTNERSHIP's `scope_ref` needed to be explicitly confirmed as capable of holding more than one target — the Comune pact genuinely is scoped to both a WORK and a PLACE at once, and the original phrasing (mirroring NOTICE's single-target language without saying so) left this ambiguous. Corrected in §26, Model Change 7.

**Conclusion: lightweight PARTNERSHIP is sufficient. Confirmed, not just assumed.**

---

## 15. Season stress test

SEASON was flagged in advance as the entity most likely to collapse. Tested seriously, using the 2026 Parco summer season (§4) compared against the working paper's own documented ~2017 Parco/Cineporto season (still explicitly Farm-branded, pre-cooperative, per Working Paper v0.3 §8 — used here for comparison only, no new research conducted).

**What SEASON contains that PLACE, WORK, and EVENT cannot naturally hold on their own:**

- **Its own identity** — "this specific window of activity" is distinguishable from Parco-the-place (permanent) and from any one WORK (which persists across many seasons).
- **Its own date window** — even incomplete (2026's end date is unknown), the window itself is a real, useful fact PLACE has no natural field for.
- **Its own status ladder** — `PLANNED`/`CURRENT`/`PAST` does real work distinguishing "this year is happening now" from "next year is being planned" from "last year already happened," independent of PLACE's own much slower-moving lifecycle.
- **A grouping value independent of WORK** — Parco's 2026 summer includes concerts, a poetry series, and general programming that does not map cleanly onto one single WORK identity; SEASON groups the EVENTs regardless.
- **A place for year-specific facts to attach without disturbing durable records** — the 2017 comparison is the clearest evidence for this: that year's season would need its own partnership/branding facts (Farm's public credit was still primary; the cooperative did not yet exist) attached to *that specific season instance*, not to Parco-the-place or to the Cineporto WORK, both of which persist unchanged across the transition. Without SEASON, this year-specific nuance would have nowhere honest to live except by overwriting a durable record with a temporary snapshot.

**What SEASON does not need:** its own recurrence-pattern field ("happens every summer" is organisational knowledge, not a stored fact — each year simply gets its own SEASON record, linked by sharing a bound PLACE and, optionally, a WORK); its own succession chain; its own access profile.

**Decision: KEEP SEASON AS LIGHTWEIGHT ENTITY.** The two-instance comparison is decisive — this was a genuinely open question (§25 item 1 of the content model, prior to this test), and real content resolved it rather than merely reasserting the original design choice. Corrected in §26 / §25 update.

---

## 16. Place operational-state stress test

Fully worked in §4 and in the corrected §5/§18 of the content model (§26, Model Change 1). Summary of the five distinguished concepts, confirmed against both real places:

| Concept | Via Nazario | Parco |
|---|---|---|
| (a) Existence/lifecycle | `ACTIVE` | `ACTIVE` |
| (b) Seasonal availability | N/A (`YEAR-ROUND`) | `CURRENT`-status SEASON bound to it |
| (c) Exceptional status | `ACTIVE` NOTICE (closure) currently overrides the default reading | None currently active |
| (d) Schedule | `NEEDS-VERIFICATION` | `NEEDS-VERIFICATION` |
| (e) Real-time open state | **Not modelled — out of scope** | **Not modelled — out of scope** |

**The finding:** the original model's single term "current operational condition" bundled (a)–(c) together in a way that could plausibly be read as also answering (e) — a claim none of its actual inputs can support, since none of them include a schedule. "Parco is active this summer" (licensed by (a)+(b)) is not the same claim as "Parco is open right now" (which would require (d)+(e), neither of which this model computes). **This is a real semantic risk the brief specifically asked to be checked for, and it was found.** Corrected: the derived concept was renamed "availability status," explicitly scoped to (a)–(c) only, with (d) named as a separate optional fact and (e) explicitly declared out of scope for this content model — a later implementation/display layer's job, never this document's.

---

## 17. Freshness stress test

Tested against: the second phone number (§3), the induction-loop/captioning ACCESS PROFILE dimensions (§11), Cena al Buio the WORK (§6), the Cena al Buio SERVICE (§8), and the SEGNI DI PACE PARTNERSHIP (§10).

**Is the CURRENT/REVIEW_DUE/STALE mechanism sufficient?** Yes, as a *mechanism* — deterministic date arithmetic against stored thresholds, layered on top of (never substituting for) an entity's real-world status, worked cleanly in every case tested.

**Is a single universal grace period actually justified?** **No — and the original phrasing implied one without justification.** A decade-old WORK format (Cena al Buio) has no principled reason to share a recheck cadence with a CONTACT CHANNEL, and neither has a reason to share one with an ACCESS PROFILE dimension. Corrected (§26, Model Change 3): `review_after` and the further point at which `REVIEW_DUE` becomes `STALE` are now stated explicitly as per-content-family (and potentially per-field) values, not one duration for the whole model. This document deliberately does not propose specific numbers — that is an editorial-policy decision for a later phase, once real content volume and update cadence are better understood, not a semantic-modelling one.

**Standing rule confirmed, and one internal inconsistency found and fixed:** "time may flag review; time does not change the real-world meaning of the entity" held in every instance *except* that the model's own provenance section (§17) had accidentally defined `VERIFIED-CURRENT` using freshness-window language ("within its recheck window"), which risked collapsing the publication-status axis and the freshness axis into one — precisely the kind of conflation Design Principle 11 rules out. Corrected (§26, Model Change 6): the two axes are now explicitly independent and combine (a fact can be `VERIFIED-CURRENT` *and* `STALE` at once), with the generalized Invariant 4 (Model Change 4) as the floor that governs what a STALE-but-otherwise-good fact may render as.

---

## 18. Provenance stress test

For every instance in §3–§13, an answer to "what supports this / what authority / when last established / what it does and does not establish / is it public-safe" was recorded inline (see the tables above). Two observations from doing this at real scale:

1. **The five-value publication-status vocabulary held up cleanly**, including for a genuinely awkward case — Via Nazario's "Always open" Facebook claim, which is a *known, live, but explicitly non-credible* source claim, not simply an absence of any source. This does not need a sixth vocabulary value: it renders identically to a plain gap (`NEEDS-VERIFICATION`, "to be confirmed"), and the reason a specific claim was rejected belongs in internal editorial metadata (free-text notes), not in the enum that gates rendering.
2. **One real internal inconsistency was found and fixed** (§17 above / §26 Model Change 6): `VERIFIED-CURRENT`'s original definition improperly folded in freshness-window language. Now corrected — publication-status and freshness are independent axes that must be read together, exactly as Design Principle 11 already required for real-world status vs. evidence-uncertainty; this stress test found the same discipline had not yet been fully applied to the provenance/freshness boundary itself.

**Result: the compact provenance layer proved sufficient**, once the one internal overlap was closed.

---

## 19. Duplication analysis

Checked explicitly: venue address, current operator, Cena al Buio's description, Parco's description, the institutional explanation, contact information, access information, project partner names.

**No case required copying a fact into more than one entity.** Address lives once on PLACE; Cena al Buio's description lives once on WORK, referenced (not duplicated) by its EVENT and SERVICE manifestations; the institutional explanation lives once on the standalone ARTICLE; contact information lives on CONTACT CHANNEL records referenced by owner; access information lives on the ACCESS PROFILE baseline with only genuine deltas expressed as EVENT-level overrides; partner names live on scoped PARTNERSHIP records, with the same real partner (Associazione Farm) appearing in more than one record only because it genuinely holds more than one distinct, independently-statused relationship (§9), not because one fact was copied.

**Result: clean pass.** This is the strongest confirmation that the manifestation/reference pattern (WORK → EVENT/SERVICE, and the various polymorphic scope/subject relationships) is doing real work, not just looking elegant on paper.

---

## 20. Entity necessity review

| Entity | Verdict | Basis |
|---|---|---|
| PLACE | **Strongly justified** | Via Nazario, Parco, Via Polese all instantiated cleanly; the operational-state test even revealed a genuine refinement need, confirming it carries real load, not decoration |
| ORGANISATION | **Strongly justified** | Succession chain, current/historical operator distinction, and Farm's deliberate separateness all real and necessary |
| WORK | **Strongly justified** | Cena al Buio's durable identity held perfectly across every manifestation test |
| EVENT | **Strongly justified** | Clean, including a relationship field carrying its own confidence caveat |
| PROJECT | **Strongly justified** | Cultura Verde's full ladder and SEGNI DI PACE's partial ladder both worked exactly as designed |
| SERVICE | **Strongly justified — and more valuable than initially appreciated.** | The Cena al Buio corporate offer was the single most revealing case in the whole exercise, surfacing the generalized-invariant fix and the publication-status/freshness decoupling fix |
| SEASON | **Justified — confirmed, no longer an open question.** | The 2026-vs-2017 comparison (§15) resolved what was previously a genuinely open decision |
| ACCESS PROFILE | **Strongly justified** | Verified + several distinct kinds of unknown coexisted cleanly; also directly prevented a realistic misuse (NOT-PRESENT vs. UNKNOWN) |
| NOTICE | **Strongly justified** | The real closure notice and the necessary synthetic fixture both confirmed the scope/expiry mechanism cleanly |
| HISTORY ENTRY | **Strongly justified** | Clean, atomic, consent-free, cleanly distinct from ARTICLE |
| ARTICLE | **Justified**, with one soft observation (register range from short summaries to long essays) worth a future authoring-convenience tag, not a structural change | §13, §24 |
| PARTNERSHIP | **Justified but lightweight — confirmed, not merely assumed** | The Comune-pact-vs-letter-of-adhesion comparison (§14) is genuinely convincing; also produced the scope-cardinality clarification |
| CONTACT CHANNEL | **Justified but lightweight — confirmed** | The second-phone-number case specifically needed the purpose/audience/public-private fields to represent an awkward real situation honestly |

**No entity was found QUESTIONABLE or NOT JUSTIFIED.** This is reported straightforwardly rather than manufactured otherwise — the brief is explicit that lightweight entities should not be demoted merely for being lightweight, and in every case tested, real content demonstrated genuine, sometimes surprising (SEASON), value.

---

## 21. Work/Event/Service/Project boundary review

- **Why is Cena al Buio a WORK?** A durable, unchanged mechanism across a decade, with multiple independent manifestation types (public events, a corporate offer, historical case-study material) and no application/award lifecycle of its own.
- **Why is the Halloween dinner an EVENT?** A single dated occurrence with no independent identity beyond its date, place, and reference back to the WORK.
- **Why is the corporate offer a SERVICE?** Offered *to* an external party rather than run *for* the general public, with its own bookability status and — as this stress test found — its own independent freshness exposure that must be tracked and gated separately from the WORK's durable description.
- **Why is Cultura Verde a PROJECT?** A bounded, funded undertaking with an application/award/delivery/completion lifecycle Cena al Buio (a WORK) simply does not have.
- **Why is Sensory Dialogues not merely a WORK?** Same boundary the content model's own §8 already tested: a one-off, dated, externally-funded residency with a concluded outcome and no manifestation stream. Forcing it into WORK would require inventing a "durable identity" for something that was genuinely bounded and one-time.

**Does one thing plausibly overlap more than one category?** Yes — Cultura Verde is simultaneously a PROJECT (bounded, funded, has its own lifecycle) *and* relates to a WORK (Parco/Cineporto programming) *and* produces EVENTs (the workshop programme). **This is legitimate relationship overlap, not miscategorisation.** The test for a real boundary problem is whether one *single* thing needs to claim two *incompatible* statuses at once (e.g. a record that must simultaneously be `SUBMITTED` and `COMPLETED`) — that never happened anywhere in this corpus. What happened instead is exactly what relationships are for: several distinct entities, each answering its own distinct question, all legitimately touching the same slice of real activity at once.

---

## 22. Article vs. History Entry test

Directly compared in §5 (Via Polese's closure, a HISTORY ENTRY) and §12 (the 2015 incorporation, a HISTORY ENTRY) against §13 (the institutional-summary ARTICLE). The distinction survives cleanly on real content:

- **HISTORY ENTRY**: atomic, dateable, drawn from formal/documentary record, requires no consent (neither instance involved personal narrative content requiring anyone's sign-off).
- **ARTICLE**: long-form, interpretive, and — whenever it draws on named individuals' personal experience rather than institutional/documentary fact — explicitly consent-gated.

**No real instance blurred the two.** Even the most tempting case (the 2015 incorporation deed's bilingual structure, which Working Paper v0.3 explicitly reads as evidence for an institutional proposition) split cleanly: the *fact* of the deed's bilingual structure is the HISTORY ENTRY; the *interpretive claim* about what it means for the organisation's founding logic belongs in an ARTICLE that cites the entry, not inside the entry itself.

**Result: KEEP the distinction as designed.**

---

## 23. Public-identity review

Tested directly in §13 and cross-checked against §3's operator clarification. The combination of **a standalone ARTICLE + relationships to ORGANISATION, WORK, PLACE, and HISTORY ENTRY** proved sufficient to hold the trans-entity public-identity explanation without making the current cooperative its semantic owner:

- ORGANISATION (Cooperativa) is `relates_to`-referenced by the ARTICLE, not the other way around — the current legal operator does not own the article; it is simply one of several things the article discusses.
- The article can cite HISTORY ENTRY nodes spanning all four legal entities (Associazione L'Altro Spazio, the S.r.l., the Pratello SRLS, the cooperative) without needing any one of them to "hold" the whole narrative.
- No instance in this corpus required information that PLACE, WORK, ORGANISATION, HISTORY ENTRY, or ARTICLE could not represent between them.

**No PUBLIC IDENTITY first-class entity is demonstrated as necessary.** The one soft observation from §13 (ARTICLE's register range) is a future authoring-convenience concern, not evidence of a missing entity — nothing in the corpus showed real content being distorted by the absence of a dedicated identity entity.

---

## 24. Homepage assembly recheck

Using only the entities instantiated above, a hypothetical future homepage could obtain, without duplicating any source-of-truth fact:

- **Via Nazario current status** — PLACE (§3) + its active NOTICE, queried directly.
- **Parco active-season status** — PLACE + SEASON (§4), queried directly, correctly distinguishing "seasonally active" from any real-time claim (§16).
- **Upcoming events** — EVENT records filtered by date/status (§7), none currently existing for Cena al Buio specifically, which is the correct honest state.
- **Institutional explanation** — the one ARTICLE (§13), referenced, not duplicated.
- **Selected current work** — WORK records filtered by `status = CURRENT` (§6), with the corrected general STALE invariant (§26, Model Change 4) available to the display layer so a badly stale-but-technically-current record (like the Cena al Buio SERVICE, §8) does not surface with false confidence.
- **Visit/contact action** — CONTACT CHANNEL records filtered by owner (§3, §9).
- **Collaboration/service action** — SERVICE records filtered by `status = CURRENT-SERVICE`, again gated by the corrected freshness floor.

**Result: confirmed, no duplicate institutional truth required** — and this recheck is the clearest demonstration of why Model Change 4 (the generalized STALE invariant) matters in practice: without it, this exact homepage assembly could have surfaced stale evidence as if freshly current.

---

## 25. Model changes required

Applied surgically to `docs/institution/laltrospazio-content-model-v1.md` on this branch. Each entry: real instance → old failure → new rule → why it generalizes.

**1. PLACE availability status split from Schedule and from real-time open state.**
*Real instance:* Parco "currently active for summer 2026" vs. no established daily hours for either current place.
*Old failure:* §3.1/§5's single "current operational condition" concept could be read as answering "open right now," when its actual inputs (lifecycle, operating_pattern, SEASON, NOTICE) cannot support that question without a schedule.
*New rule:* Renamed to "availability status," explicitly scoped to existence + seasonal window + exceptional NOTICE only; Schedule introduced as a separate, optional, currently-unresolved fact; real-time open/closed state explicitly declared out of scope for this content model (new Invariant 17).
*Why general:* Applies identically to any future PLACE lacking a populated schedule, not just these two.

**2. PLACE.operator clarified as "responsible for L'Altro Spazio's activity here," not facility ownership.**
*Real instance:* Parco, a public park the cooperative does not own, distinct from Via Nazario, a leased venue it directly runs.
*Old failure:* "Operated by ORGANISATION" risked overstating the cooperative's control of a public space it merely holds a collaboration pact for.
*New rule:* §5 now states explicitly what `operator` does and does not assert, naming Parco/Comune as the driving example; site-level authority is carried by PARTNERSHIP, never by the operator field.
*Why general:* Applies to any future PLACE that is a public or shared space rather than a directly-controlled venue.

**3. Freshness thresholds declared per-content-family, not a single universal grace period.**
*Real instance:* Cena al Buio (WORK) and its SERVICE manifestation, each plausibly needing a different recheck cadence than a CONTACT CHANNEL.
*Old failure:* §18 implied one fixed "further grace period" for the whole model, unjustified by anything in the evidence base.
*New rule:* `review_after` and the STALE threshold are each set per family (and potentially per field); this document defines the mechanism, not the durations.
*Why general:* No content family tested had a principled reason to share a cadence with any other.

**4. Generalized the STALE-floor invariant beyond ACCESS PROFILE.**
*Real instance:* the Cena al Buio corporate SERVICE — honestly `CURRENT-SERVICE` (last-confirmed real-world state) but `STALE` (no reconfirmation in ~8 months).
*Old failure:* Invariant 4 only protected accessibility dimensions from rendering stale-as-fresh; nothing stopped a STALE SERVICE from rendering a live booking CTA.
*New rule:* Invariant 4 now covers any entity with independent freshness metadata (WORK, SERVICE, PARTNERSHIP, CONTACT CHANNEL, ACCESS PROFILE) — a STALE fact must never render as though freshly confirmed, regardless of its own `status` value.
*Why general:* This is the single most important fix in this pass — it is exactly the "proposal converted to current bookable" failure the whole model was built to prevent, reappearing through the freshness door rather than the status door.

**5. `NOT-PRESENT` requires positive confirming evidence, never assumption.**
*Real instance:* Via Nazario's induction-loop and captioning facts, the latter explicitly labelled "(assumed)" in the source material.
*Old failure:* §11 did not warn against promoting an unconfirmed assumption to a confirmed-absence claim.
*New rule:* `NOT-PRESENT` is reserved for actually-confirmed absence; an unconfirmed assumption is `UNKNOWN` + `NEEDS-VERIFICATION`.
*Why general:* Any accessibility dimension anywhere risks this exact misreading of "no evidence of X" as "confirmed absent."

**6. Decoupled publication-status (§17) from freshness (§18).**
*Real instance:* attaching provenance to the aging Cena al Buio SERVICE evidence.
*Old failure:* `VERIFIED-CURRENT`'s own definition ("within its recheck window") accidentally imported freshness's job, risking exactly the axis-conflation Design Principle 11 rules out — just at the provenance/freshness boundary rather than the state/evidence one.
*New rule:* The two axes are independent and combine; a fact can be `VERIFIED-CURRENT` and `STALE` simultaneously.
*Why general:* This is a structural clarification of the whole provenance model, not specific to any one entity.

**7. PARTNERSHIP's `scope_ref` may hold more than one target, unlike NOTICE's single-target rule.**
*Real instance:* the Comune di Bologna's Parco pact, genuinely scoped to both a WORK and a PLACE.
*Old failure:* §4/§20's phrasing mirrored NOTICE's single-target language without saying so, leaving this ambiguous against §6's own prose example ("scope=WORK+PLACE").
*New rule:* Explicitly stated as permitted, with the reasoning for why this differs safely from NOTICE (no equivalent inference-creep risk).
*Why general:* Any future partner relationship genuinely spanning more than one scoped subject needs this same allowance.

**8. SEASON's open decision (§25 item 1) resolved to KEEP, not merely re-asserted.**
*Real instance:* the 2026-vs-2017 Parco season comparison (§15 of this document).
*Old status:* Genuinely open, pending real content.
*New status:* Resolved — SEASON carries real, non-redundant information neither PLACE nor WORK can hold alone.
*Why general:* This is a documentation update recording a decision now actually tested, not a structural change.

**No other section of the content model required a change.** Everything not listed above (PLACE's existence/historical model, WORK/PROJECT/SERVICE's status ladders as corrected in the prior integrity pass, EVENT, HISTORY ENTRY, ARTICLE, CONTACT CHANNEL's basic shape, the relationship graph's overall structure) held against real content exactly as written.

---

## 26. Remaining ambiguities

Deliberately left unresolved, not fixed, because they are editorial-policy questions rather than semantic-modelling gaps:

- **Specific numeric review_after/staleness thresholds per content family.** This document establishes that they must be per-family, not what they should be. A later phase, once real content volume and update cadence are better understood, should set them.
- **ARTICLE's register range** (short, load-bearing summaries vs. long-form essays) may eventually want an authoring-convenience `article_type` tag. Not required by anything tested; noted for later.
- **Whether SEASON's `instantiates → WORK` link should ever be mandatory.** Left optional by design — Parco's 2026 season legitimately spans activity not cleanly reducible to one WORK identity, and forcing a link would misrepresent that.
- **The precise editorial rule for hedged public mention of a `SUBMITTED`-stage PROJECT** (as opposed to a `PROPOSED`-stage one, which Institutional Architecture v1 §12 already addresses explicitly). Invariant 1 already blocks both from "current work" surfaces regardless; only the *optional* hedged-mention style for `SUBMITTED` specifically is underspecified, and that is a copy/style question, not a semantic contradiction.

None of these block anything from proceeding.

---

## 27. Merge recommendation

**READY TO MERGE MODEL + STRESS TEST.**

Eight surgical corrections were required and have been applied to `laltrospazio-content-model-v1.md` on this branch, each traced to a specific real instance in this document. None required a rewrite, a new first-class entity, or an entity deletion. The two most substantive findings — the PLACE availability-status/real-time-state split (Model Change 1) and the generalized STALE-floor invariant (Model Change 4) — are exactly the kind of thing a real-content stress test exists to catch before a model is treated as canonical, and both are now closed. The model, as corrected, represents every item in the test corpus without forced duplication, impossible lifecycle, ambiguous ownership, or broken provenance.

---

## Quality gates

| # | Gate | Result |
|---|---|---|
| 1 | Can Via Nazario be active while temporarily closed? | **PASS** |
| 2 | Can Parco be seasonally active without claiming it is open at this exact moment? | **PASS — required Model Change 1 to be structurally guaranteed rather than merely likely** |
| 3 | Can a historical place remain richly represented but never appear current? | **PASS** |
| 4 | Can Cena al Buio exist with zero scheduled events? | **PASS** |
| 5 | Can Cena al Buio have both events and a service manifestation? | **PASS** |
| 6 | Can the service manifestation exist without claiming current bookability? | **PASS — required Model Change 4 to be structurally guaranteed rather than accidental** |
| 7 | Can a submitted grant remain submitted indefinitely until later evidence changes it? | **PASS** |
| 8 | Can a formal current partnership and a proposal-only relationship never be confused? | **PASS** |
| 9 | Can current accessibility contain verified + unknown dimensions together? | **PASS** |
| 10 | Can a temporary access limitation expire without rewriting baseline access truth? | **PASS (via the synthetic fixture)** |
| 11 | Can stale metadata trigger review without changing entity meaning? | **PASS — required Model Change 6 to remove a real axis-overlap risk** |
| 12 | Can the cooperative remain current operator without owning all historical L'Altro Spazio identity? | **PASS** |
| 13 | Can homepage-level assembly happen without duplicate institutional truth? | **PASS** |
| 14 | Can all public-sensitive claims retain understandable provenance? | **PASS** |
| 15 | Did any entity survive only because the ontology wanted it rather than real content needing it? | **PASS (no)** |

**15/15, with 3 gates (2, 6, 11) requiring an actual correction to pass structurally rather than passing by accident.** This is reported honestly rather than claiming a flawless first draft — the corrections are exactly what this phase was for.

---

## Owner decisions

**None.** Consistent with the brief's own instruction to aim for zero, no genuine owner decision blocks the semantic model at this stage. Opening hours and physical-access verification remain, as before, operational dependencies that do not block architecture, schema, or this stress test — their absence from the corpus was the intended test, not a gap requiring owner input.

---

## Recommended next phase

1. Concrete schema design may now begin, informed by both the original model and this stress test's eight corrections — still no code in that first pass, following whatever discipline the project's existing `event-schema.md`-style pattern models, without treating the old schemas as a constraint (per the greenfield rule).
2. The per-family freshness threshold values (review_after / staleness) should be set as part of that schema pass, once informed by realistic content-authoring cadence — not invented here.
3. Creative/design-system work may proceed in parallel, independent of schema timing, per the greenfield sequence already established.
4. Selective verified-data migration (§24 of the content model) remains the correct, later step — nothing in this stress test changes that boundary.

---

*End of Content Model Real-Content Stress Test v1. This document validates, and surgically corrects, `laltrospazio-content-model-v1.md`. It does not implement, schema, or visually design anything, and does not replace Working Paper v0.3, Institutional & Public Information Architecture v1, or Current Public State & Implementation Readiness v1.*
