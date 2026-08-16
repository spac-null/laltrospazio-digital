# L'Altro Spazio — Greenfield Content Model v1

**Working date:** 16 August 2026
**Status:** Semantic content-model decision document for the new public website. Defines what kinds of things exist, how they relate, and what makes each of them safe to publish. Does not implement, schema, or design anything.
**Builds on:** Working Paper v0.3 (institutional synthesis), Institutional & Public Information Architecture v1 (what the public system must communicate), and Current Public State & Implementation Readiness v1 (what is true now). Reads their conclusions into a content model; does not re-argue them.
**Greenfield discipline:** This document was written without inspecting the existing frontend, routes, components, or `content/*.json` schemas. Where those old schemas may later supply verified data, that is a migration question (§24), not a modelling constraint. Nothing below was designed to fit the old site.

---

## 1. Executive decision

The new website needs a small set of first-class entities built around one recurring shape: **a durable identity, one or more time-bound or audience-bound manifestations of it, and a status that can never be silently assumed.** That shape is not an accident of any one entity — it is the same structure that resolves the Cena al Buio problem (a durable work with several manifestations), the project-vs-programme problem (a bounded undertaking is not a manifestation, it is its own lifecycle), and the place-vs-organisation problem (a place's operational state must never stand in for the organisation's, and vice versa).

The model below defines thirteen entities: ten that carry independent identity and lifecycle (PLACE, ORGANISATION, WORK, EVENT, PROJECT, SERVICE, ACCESS PROFILE, NOTICE, HISTORY ENTRY, ARTICLE), and three deliberately lightweight, reusable support entities (SEASON, PARTNERSHIP, CONTACT CHANNEL) that exist to be referenced from several of the ten rather than duplicated inside each. No entity in this set is a generic CMS content type — each earns its place by answering a question none of the others can answer, and each carries a lifecycle that is not just "published/unpublished."

The single design principle threaded through every section below: **status is never inferred, always stated, and always capable of expiring.** A proposal cannot become a result by drift. A place's closure cannot become the organisation's closure by association. An accessibility fact cannot outlive its own verification date by default. Where the old site's known failures are the clearest test of a rule (a blanket "completely accessible" claim, a proposal read as delivered work, a closed venue's name appearing with no closure stated), this document names the specific mechanism that makes the new model structurally incapable of repeating them, not just a policy asking editors to be careful.

---

## 2. Design principles

1. **A place is not the organisation, and the organisation is not the practice.** Each gets its own entity, its own lifecycle, and its own status vocabulary; none may borrow another's status by implication (Institutional Architecture v1 §5–§6).
2. **A durable identity and its manifestations are different things.** A programme/format is not the same object as a dated night of it, a bookable version of it, or a historical account of it — they reference the same identity, they do not duplicate it (§6).
3. **A bounded, funded undertaking is not a programme.** A project has an application/award lifecycle a durable work format does not have, and the two must never be modelled as one type wearing different status labels (§8).
4. **No fact renders publicly without a status, and no status is permanent by default.** Every entity below carries an explicit lifecycle field; every public-sensitive fact carries provenance and, where relevant, an expiry (§17–§18).
5. **Accessibility is dimensional, never boolean.** No entity, anywhere in this model, may collapse to a single `accessible` flag (§11).
6. **A closure is local until stated otherwise.** One place's operational state must never be readable, by inference, as the organisation's state (§5, §12).
7. **Historical fact and current fact use the same lifecycle shape, but never the same rendering surface.** A record can transition from current to historical without losing its identity; a page can never present a historical fact as if it were a current one (§7, §16).
8. **Fewer entities, used consistently, beat more entities used once each.** Where a candidate entity's job can be done by a field, a relationship, or a status value on an existing entity, it is not made a new entity (see the entity-by-entity justification in §3, and the deliberate exclusions in §23).
9. **Durable structure and current values are separable.** The shape of a record (what fields it has) can be finished and correct long before every field has a verified value — this is what lets schema and architecture work proceed in parallel with the owner's still-open verification items, exactly as Current Public State v1 §14 already established.
10. **The model is built for what this organisation is, not for what a generic cultural non-profit's CMS usually has.** Every entity below is justified against a real example from Working Paper v0.3 or Current Public State v1, not against a template.
11. **Real-world state and evidence state are two different axes, and are never collapsed into one vocabulary.** An entity's status describes what is actually happening to the thing itself; a separate provenance/freshness layer describes how well, and how recently, that is known. "We don't know" is never a lifecycle value — it is a fact about evidence, and it is recorded as one (§8, §17, §18).

---

## 3. Core entity set

Thirteen entities, tested against the candidate list and against real examples rather than assumed wholesale. Ten carry independent lifecycle; three are deliberately lightweight and exist to be referenced, not duplicated.

### 3.1 PLACE
**Purpose:** Answers "where can someone go, and in what state is that specific location right now?"
**What makes it distinct:** Carries its own operational lifecycle, independent of the organisation that runs it and independent of any other place.
**Examples:** Via Nazario Sauro 24/F; Parco 11 Settembre; Via Polese 7 (historical); Pratello 29/A (historical); da Osvaldo (historical).
**Non-examples:** A dated concert (that's an EVENT hosted at a place); "Bologna" as a city (too coarse — not a location someone visits for a specific reason); a proposed but never-opened concept like JASPACE, which is closer to a PROJECT/WORK that never launched than a PLACE (see §8).
**Lifecycle (existence axis):** PROPOSED → ACTIVE → HISTORICAL. This is the only axis that changes rarely, and the only one this document calls "lifecycle." Deliberately does **not** include a "TEMPORARILY CLOSED" or a "SEASONAL" value — see §5's worked justification for why both of those belong to different axes entirely.
**Operating pattern (a separate, independent axis):** YEAR-ROUND / SEASONAL / EVENT-BASED — a durable structural fact about *how* an ACTIVE place operates, not *whether* it currently does. Via Nazario is YEAR-ROUND; Parco is SEASONAL. A place's operating pattern does not change when a season opens or closes any more than a place's lifecycle changes when it closes for ten days — see §5.
**Current operational condition:** not a stored field at all — a derived read, computed at render time from lifecycle (is this place ACTIVE?), operating pattern plus any bound SEASON's current window (if SEASONAL), and any ACTIVE-status NOTICE scoped to this place. Nothing about "is it open right now" is ever hand-set independently of these three sources.
**Public/internal:** Public.
**Relationships:** operated by ORGANISATION; described by one ACCESS PROFILE; hosts EVENTs; may be bound to a SEASON (if operating_pattern = SEASONAL); may be the subject of a HISTORY ENTRY once HISTORICAL.
**Why first-class:** Nothing else in the model can carry "is this specific location open right now" without conflating it with the organisation's or another place's state — exactly the failure Institutional Architecture v1 §6 names as invalid ("L'Altro Spazio is closed" inferred from one venue's closure).

### 3.2 ORGANISATION
**Purpose:** Answers "who is legally and operationally responsible for this?"
**What makes it distinct:** Carries legal/operational identity and a succession chain, not day-to-day operating detail.
**Examples:** Cooperativa L'Altro Spazio (current operator); L'Altro Spazio S.r.l., L'Altro Spazio Pratello SRLS, Associazione L'Altro Spazio (historical, superseded); Associazione Farm (a separate, still-current organisation with its own overlapping history at Parco — not an L'Altro Spazio entity at all).
**Non-examples:** A team/staff roster (deliberately excluded, §23); a funding relationship (that's a PARTNERSHIP or a PROJECT's funder field); "L'Altro Spazio" as a public identity a visitor uses casually (that's not an entity at all — it is exactly the layering problem Institutional Architecture v1 §5 already resolved: the public name is not modelled as a record, only the responsible entities are).
**Lifecycle:** CURRENT (may operate places/works now) / HISTORICAL (superseded; retained for the succession chain and for HISTORY).
**Public/internal:** Mostly public at the identity level (legal name, current-operator status, what it operates); several fields (board composition, legal representative, workforce composition) are internal-only or withheld per Institutional Architecture v1 §20 and Current Public State v1 §9 — the entity's *shape* supports these fields; the model does not make their publication automatic.
**Relationships:** operates PLACE(s); may relate to another ORGANISATION via `succeeds`/`superseded_by`; is the subject of HISTORY ENTRY records for each transition; holds CONTACT CHANNELs.
**Why first-class:** The historical succession (Associazione L'Altro Spazio → L'Altro Spazio S.r.l. → L'Altro Spazio Pratello SRLS in parallel → Cooperativa L'Altro Spazio) is real, load-bearing structure Working Paper v0.3 §10, §15 insists must never be collapsed into one continuous entity — a succession chain needs its own linkable records, not a text paragraph.

### 3.3 WORK
**Purpose:** Answers "what is this durable, named practice, independent of any one date or booking?"
**What makes it distinct:** A single stable identity (name, description, mechanism, status) that zero or more EVENTs and zero or one SERVICE offerings can reference without duplicating.
**Examples:** Cena al Buio; Cineporto/Parco cultural programming; Aperitivo dal Mondo; Spazi Migranti; the LIS-awareness training format; the recurring exhibition programme.
**Non-examples:** A specific Cena al Buio night (that's an EVENT); a funded, time-boxed residency like Sensory Dialogues (that's a PROJECT — see the boundary test in §8); a one-off event with no recurring identity behind it (may simply be an EVENT with no `work_ref`).
**Lifecycle:** PROPOSED → CURRENT → PAST → ARCHIVED. Deliberately has **no** "DORMANT" value — a work whose evidence has gone quiet keeps its real-world `status` unchanged; a separate, deterministic freshness condition (§18) flags it for review instead of inventing a new lifecycle state (see the worked Cena al Buio case in §6).
**Public/internal:** Public.
**Relationships:** manifests_as EVENT (0..N); manifests_as SERVICE (0..1 typically, occasionally more); documented_by HISTORY ENTRY / ARTICLE; may relate_to PARTNERSHIP (e.g. a migrant/refugee association co-running Spazi Migranti); may be grouped by SEASON.
**Why first-class:** This is the entity the Cena al Buio stress test (Current Public State v1 §7) already proved necessary — without it, a dated event, a bookable corporate offer, and a decade-old format description have nowhere to share an identity, and duplicate it instead.

### 3.4 EVENT
**Purpose:** Answers "what is happening, on what date, at what place?"
**What makes it distinct:** The canonical source of date, time, booking specifics, and (optionally) its own accessibility overrides — never a place for programme-level description.
**Examples:** A specific Cena al Buio night; a Parco summer concert; a one-off exhibition opening with no recurring WORK behind it.
**Non-examples:** The recurring format itself (WORK); a whole season's grouped programme (SEASON); a funded project's overall existence (PROJECT, though a PROJECT may *produce* EVENTs).
**Lifecycle (date-status, not the ladder in §2):** SCHEDULED → OCCURRED, or CANCELLED / POSTPONED at any point before OCCURRED. An EVENT with no fixed date yet still requires an explicit date-status value ("date to be announced") rather than being permitted to exist with neither a date nor a stated reason for the absence of one.
**Public/internal:** Public.
**Relationships:** optionally references a WORK; optionally references a PROJECT (if produced by one); occurs at a PLACE; may belong to a SEASON; may carry its own access_override fields superseding its PLACE's ACCESS PROFILE baseline.
**Why first-class:** A dated occurrence is required by the model regardless of how it is eventually implemented — Institutional Architecture v1 §3.7 already established that dated events/notices are their own information layer; this document's contribution is only to clarify EVENT's relationship to WORK/PROJECT/PLACE, so a canonical event page can say "this is a Cena al Buio night" without re-describing what Cena al Buio is.

### 3.5 PROJECT
**Purpose:** Answers "what bounded, usually funded, usually time-boxed undertaking is this — and has it actually happened yet?"
**What makes it distinct:** Carries an application/award lifecycle no durable WORK format has, and an end state a WORK does not need.
**Examples:** Cultura Verde (2024, awarded and delivered); SEGNI DI PACE (2026, submitted, outcome unknown); Sencity (concept only); Sensory Dialogues (funded, delivered, concluded residency).
**Non-examples:** A recurring house format with no funding/application lifecycle (that's a WORK); a single dated occurrence (that's an EVENT, though a PROJECT may produce several).
**Lifecycle (real-world state only):** PROPOSED → SUBMITTED → AWARDED → ACTIVE → COMPLETED, with DECLINED (the funder/authority said no), WITHDRAWN (the applicant pulled it), and CANCELLED (agreed or awarded, then stopped before completion) as distinct terminal branches — each a genuine real-world outcome, not a stand-in for uncertainty. Each transition requires its own evidence class (§8 works this through with the Cultura Verde example specifically, since it is the one case in the evidence base where the full ladder is documented end to end). **A stalled application whose actual outcome is simply unknown is not a lifecycle value at all** — the record stays at its last-confirmed real-world state (typically SUBMITTED) and its evidence/freshness metadata (§17, §18) is what flags "we don't know what happened to this," never a status enum member invented to mean the same thing.
**Public/internal:** Mixed — the project's existence and (once AWARDED or further) its public framing may be public; budget/financial detail is internal only, consistent with Working Paper v0.3's confidentiality boundary.
**Relationships:** may relate_to a WORK (a project can extend or fund a durable format); produces EVENT(s); involves PARTNERSHIP(s); may be the subject of a HISTORY ENTRY or ARTICLE once concluded.
**Why first-class:** This is exactly the boundary Institutional Architecture v1 Task 3 and Working Paper v0.3 §13 insist on: an application must never silently become a public claim of delivered work, and a PROJECT's own status ladder is the mechanism that makes that structurally true rather than editorially hoped-for.

### 3.6 SERVICE
**Purpose:** Answers "what can an external party — a company, a school, a public body — book or contract, right now?"
**What makes it distinct:** Offered *to* someone rather than run *for* the general public; carries a bookability status a WORK's public-facing description does not need.
**Examples:** Cena al Buio as a corporate B2B offer; LIS/communication training, if and when it is confirmed as currently bookable; accessible event-design consultancy, if formalised.
**Non-examples:** A programme the public can simply attend (that's an EVENT manifestation of a WORK, not a SERVICE); MePA procurement-category registration by itself (evidence of eligibility positioning, never of an active bookable offer — Working Paper v0.3 §13, Current Public State v1 §8).
**Lifecycle:** PROPOSED → CURRENT-SERVICE → INACTIVE → ARCHIVED.
**Public/internal:** Public when CURRENT-SERVICE; otherwise not rendered as bookable.
**Relationships:** typically manifests_from a WORK; may carry its own CONTACT CHANNEL (a booking/collaboration line distinct from the general venue number); may be referenced by a HISTORY ENTRY or ARTICLE once ARCHIVED, without needing to still render as bookable.
**Why first-class:** Distinguishing "we do this" (organisational capability) from "you can book this" (a live, contactable offer) is exactly the gap Current Public State v1 §8 found empty for almost every candidate service reviewed — the SERVICE entity is what prevents a capability from silently reading as an offer.

### 3.7 SEASON *(lightweight)*
**Purpose:** Answers "what bounded operating period groups this place's or work's activity right now?"
**What makes it distinct:** A thin temporal-grouping record, not a heavy entity — it exists purely so a place's or work's "current" status can be qualified to a specific window rather than asserted permanently.
**Examples:** Parco 11 Settembre's summer 2026 programme; a future winter programme, if one exists.
**Non-examples:** A single dated night (EVENT); a funded undertaking (PROJECT) — a season is recurring and cyclical, a project is bounded and (usually) one-off.
**Lifecycle:** PLANNED → CURRENT → PAST.
**Public/internal:** Public (as a grouping label on What's-on/Visit surfaces).
**Relationships:** occurs_at a PLACE; may instantiate a WORK's yearly recurrence (e.g. this year's Cineporto season); groups EVENTs.
**Why first-class, but kept light:** Without it, "Parco is currently open" would have to be asserted as a bare PLACE fact with no natural place to attach "until when, as part of what" — but it needs none of PLACE's or WORK's heavier machinery (no access profile of its own, no succession chain), so it is deliberately minimal.

### 3.8 ACCESS PROFILE
**Purpose:** Answers, per dimension, "what is the actual, current, verified practical access condition here?"
**What makes it distinct:** Structurally incapable of collapsing to a boolean; carries its own per-dimension verification and expiry independent of the place's own operational lifecycle.
**Examples:** Via Nazario's nine-dimension access record, once populated; Parco's own, separately, since an outdoor public park's profile is not inherited from an indoor venue's.
**Non-examples:** A one-line "we are accessible" claim (explicitly excluded — see §11); an EVENT's one-off deviation from the baseline (handled by lightweight override fields directly on EVENT, not a second ACCESS PROFILE record — see §11's hybrid recommendation).
**State (two separate axes, per dimension, never merged):** a **condition** value — the actual real-world fact, which may itself be NOT-PRESENT (the feature/accommodation genuinely does not exist here) or NOT-APPLICABLE (this dimension has no meaningful bearing on this place), alongside whatever the practical condition otherwise is; and, independently, a **verification status** — reusing §17's five-value publication-status vocabulary (VERIFIED-CURRENT / VERIFIED-HISTORICAL / NEEDS-VERIFICATION / CONFLICTING / DO-NOT-PUBLISH) — describing how well that condition is currently known, not what it is.
**Public/internal:** Public, with internal verification metadata (§17) attached per dimension.
**Relationships:** describes exactly one PLACE; may be temporarily superseded by a NOTICE (a dimension's `temporary_exception_ref`); may be referenced (not duplicated) by an EVENT's access_override.
**Why first-class:** Task 6's own instruction rules out a boolean; making this its own entity (rather than nine flat fields buried in PLACE) is what lets each dimension expire and get reverified independently, which a flat field set on PLACE could not do cleanly.

### 3.9 NOTICE
**Purpose:** Answers "is there something time-bound, right now, that changes what's normally true?"
**What makes it distinct:** Always scoped to exactly one target, always time-bound, always capable of auto-expiring without a human remembering to remove it.
**Examples:** The Via Nazario 12–26 August 2026 closure; a Parco weather cancellation; a specific event's cancellation; a temporary wheelchair-route change for construction.
**Non-examples:** A place's durable lifecycle change, e.g. a permanent closure (that's a PLACE lifecycle transition, recorded in HISTORY, not a NOTICE); a standing accessibility condition (that's the ACCESS PROFILE baseline, not an exception to it).
**Lifecycle:** DRAFT → ACTIVE → EXPIRED / WITHDRAWN.
**Public/internal:** Public while ACTIVE; not rendered once EXPIRED or WITHDRAWN.
**Relationships:** scope_target is polymorphic — PLACE, EVENT, WORK, SEASON, SERVICE, ORGANISATION, or GLOBAL — with exactly one target per notice, never an implicit wider scope.
**Why first-class:** This is the single mechanism that keeps "Via Nazario is closed for ten days" from ever being misread as "L'Altro Spazio is closed" — the explicit, single-target scope field is the whole point (Institutional Architecture v1 §6, Current Public State v1 §2).

### 3.10 HISTORY ENTRY
**Purpose:** Answers "what happened, when, to what — told as a dated fact, not folded into a current record's description."
**What makes it distinct:** A polymorphic, dated milestone node that assembles the HISTORY timeline without requiring every closed place, superseded organisation, or concluded work to carry its own embedded narrative.
**Examples:** Via Polese's 2014 closure after water damage; the 2015 SRL incorporation; da Osvaldo's 2024 closure; Cooperativa L'Altro Spazio's 27 June 2022 registration; JASPACE's 2024 preparatory stage and uncertain fate.
**Non-examples:** A durable work's ongoing description (that's WORK itself, whose status may simply become PAST); a full narrative essay (that's an ARTICLE, which may cite several HISTORY ENTRY nodes as its factual spine).
**Lifecycle:** none beyond DRAFT → PUBLISHED — history entries do not expire, though their public-safety flag can change if new evidence resolves an uncertainty.
**Public/internal:** Public once reviewed; carries a `discontinuity` flag so a closure/failure is never silently omitted from the same view as the entity's name (Institutional Architecture v1 §6's hard rule).
**Relationships:** subject_ref is polymorphic — PLACE, ORGANISATION, WORK, or PROJECT; may be cited by an ARTICLE.
**Why first-class:** Without a dedicated timeline node, the History page would have to be hand-assembled prose disconnected from the structured records it describes — this entity is what lets "is that still open?" (Institutional Architecture v1 §18, scenario 7) resolve to a structured, dated answer rather than an essay a reader has to search.

### 3.11 ARTICLE
**Purpose:** Answers "what is the organisation's own interpretive or narrative account of itself, its method, or a specific case?"
**What makes it distinct:** Carries editorial register (interpretation, method, oral history) that operational entities like PLACE or WORK must not absorb, per Institutional Architecture v1 §3.3's own warning about generic "our values" copy.
**Examples:** An "our approach" essay; the Cena al Buio ten-year case study; an oral-history excerpt from the interview corpus (only with speaker consent).
**Non-examples:** A HISTORY ENTRY's single dated fact (an ARTICLE may cite several, but is not one itself); a PLACE's short functional description.
**Lifecycle:** DRAFT → PUBLISHED, plus a separate `consent_status` for any material sourced from named individuals (CONSENT-OBTAINED / CONSENT-PENDING / NOT-FOR-PUBLICATION), since publication-readiness and consent are two different gates.
**Public/internal:** Public once PUBLISHED and, where relevant, consent-cleared.
**Relationships:** relates_to WORK, PLACE, PROJECT, HISTORY ENTRY, or a named person (only with consent).
**Why first-class:** Task 14 and Institutional Architecture v1 §11 both require somewhere for interpretive/narrative material to live without distorting operational records — this is that place, and its consent field is what keeps oral-history use "careful and with consent" rather than assumed.
**Why HISTORY ENTRY and ARTICLE stay two separate entities, checked directly:** merging them would force every dated fact — "cooperative registered 27 June 2022," which needs no consent gate and no interpretive framing at all — through the same consent/interpretation machinery a genuinely narrative piece like an oral-history excerpt requires, or else force every essay to be atomised into dated nodes it doesn't naturally have. The two entities differ on both axes that matter here: HISTORY ENTRY is atomic, dated, and consent-free by default; ARTICLE is long-form, interpretive, and consent-gated whenever it draws on a named individual. A single "History and evidence" page can render both together without them needing to be one record type.

### 3.12 PARTNERSHIP *(lightweight)*
**Purpose:** Answers "what is this organisation's or person's actual current relationship to us, and on what evidence?"
**What makes it distinct:** A thin relationship record, not a logo-wall entry — its status is independent of whatever PROJECT or WORK it is scoped to, and it can change without either of those records changing.
**Examples:** Associazione Farm's ongoing collaboration at Parco (ACTIVE, scope=WORK+PLACE); a signed letter-of-adhesion partner on SEGNI DI PACE (scope=PROJECT, status=LETTER-OF-SUPPORT); a named-but-unconfirmed collaborator in a 2026 draft planning document (scope=PROJECT, status=PROPOSED).
**Non-examples:** The Comune di Bologna's formal 36-month Parco pact, which is significant enough and specific enough that it is better modelled as its own PARTNERSHIP record of type FORMAL-PUBLIC-ADMINISTRATION-AGREEMENT rather than a generic collaborator entry — the type field, not a separate entity, carries that distinction.
**Lifecycle (real-world relationship state):** PROPOSED → LETTER-OF-SUPPORT → ACTIVE → PAST. A partner named only inside a still-unresolved application is simply PROPOSED, scoped to that PROJECT — a separate "APPLICATION-ONLY" value was considered and dropped as redundant with PROPOSED-plus-scope; keeping the ladder to four real-world values is the smaller, cleaner model.
**Public/internal:** Public only once ACTIVE or, in hedged form, LETTER-OF-SUPPORT on the specific project it supports — never on a general partners listing while PROPOSED.
**Relationships:** scope_ref is polymorphic — PROJECT, WORK, PLACE, or ORGANISATION-wide.
**Freshness:** carries `last_verified`/`review_after` like any other entity making a current-tense claim (§18) — an ACTIVE partnership nobody has reconfirmed in a long while is flagged for review, not silently kept ACTIVE forever.
**Why first-class, but kept light:** Task 10 explicitly asks whether a full entity is needed or a lighter object suffices — a lighter object suffices, provided it still carries its own status independent of the project/work it's scoped to, because that independence is exactly what prevents a proposal-only name from leaking onto a general partners page.

### 3.13 CONTACT CHANNEL *(lightweight)*
**Purpose:** Answers "how does a specific kind of person reach us, for a specific purpose?"
**What makes it distinct:** Reusable across owners (place, organisation, service) rather than a scattered string on each; distinguishes purpose and audience, not just a raw value.
**Examples:** The WhatsApp booking number; the info/collaborations number (live-public-source verified, not yet owner-confirmed for a new site per Current Public State v1 §2); an accessibility-question channel, once the owner designates one.
**Non-examples:** A person's private contact detail (excluded entirely, per the confidentiality boundary).
**Lifecycle:** CURRENT / INACTIVE.
**Public/internal:** Public when CURRENT and designated public-facing.
**Relationships:** owner_ref is polymorphic — ORGANISATION, PLACE, or SERVICE.
**Freshness:** carries `last_verified`/`review_after` (§18) — a channel not reconfirmed in a long while is flagged for review rather than assumed to still be answered.
**Why first-class, but kept light:** Task 9 explicitly asks for reusable channels rather than scattered strings — this is the minimal record that lets "which number is for booking vs. collaborations vs. accessibility questions" be answered structurally rather than by convention.

**On the count itself:** ten entities carry real, independent lifecycle; three are one notch above a plain field precisely because more than one heavier entity needs to reference them without duplication. None of the thirteen exists merely because a generic CMS would have a content type by that name — each is justified above against a specific example this organisation's own evidence base already contains. Section 23 lists what was deliberately kept *out* of this set for the same reason.

---

## 4. Relationship graph

```
ORGANISATION
    operates            -> PLACE
    succeeds / superseded_by -> ORGANISATION   (historical succession chain)
    holds               -> CONTACT CHANNEL

PLACE
    hosts               -> EVENT
    described_by        -> ACCESS PROFILE        (exactly one)
    bound_by            -> SEASON                (optional)
    subject_of          -> HISTORY ENTRY          (once historical)
    targeted_by         -> NOTICE                 (scope = PLACE)

WORK
    manifests_as        -> EVENT                  (0..N)
    manifests_as        -> SERVICE                (0..1, occasionally more)
    documented_by       -> HISTORY ENTRY / ARTICLE
    relates_to          -> PARTNERSHIP             (optional)
    grouped_by          -> SEASON                 (optional, e.g. a yearly instance)
    targeted_by         -> NOTICE                 (scope = WORK)

PROJECT
    relates_to          -> WORK                   (optional)
    produces            -> EVENT                  (0..N)
    involves            -> PARTNERSHIP
    subject_of          -> HISTORY ENTRY / ARTICLE (once concluded)

EVENT
    occurs_at           -> PLACE
    references          -> WORK                   (optional)
    references          -> PROJECT                (optional)
    belongs_to          -> SEASON                  (optional)
    overrides           -> (its host PLACE's ACCESS PROFILE, via its own access_override fields)
    targeted_by          -> NOTICE                 (scope = EVENT)

SEASON
    occurs_at           -> PLACE
    instantiates         -> WORK                   (optional)
    groups               -> EVENT
    targeted_by           -> NOTICE                (scope = SEASON)

ACCESS PROFILE
    describes            -> PLACE                  (exactly one)
    dimension.temporary_exception -> NOTICE

NOTICE
    scope_target (polymorphic, exactly one) -> PLACE | EVENT | WORK | SEASON | SERVICE | ORGANISATION | GLOBAL

HISTORY ENTRY
    subject_ref (polymorphic) -> PLACE | ORGANISATION | WORK | PROJECT
    cited_by              -> ARTICLE

ARTICLE
    relates_to             -> WORK | PLACE | PROJECT | HISTORY ENTRY | (a named person, with consent)

PARTNERSHIP
    scope_ref (polymorphic) -> PROJECT | WORK | PLACE | ORGANISATION

CONTACT CHANNEL
    owner_ref (polymorphic) -> ORGANISATION | PLACE | SERVICE
```

No relationship above was forced to fit a pre-decided diagram; each line traces back to a specific example in §3. The two recurring shapes worth naming explicitly: (a) **manifestation** — WORK to EVENT/SERVICE — is one-directional and reference-only, never a duplication of the WORK's own description; (b) **polymorphic scope/subject** — used by NOTICE, HISTORY ENTRY, ARTICLE, PARTNERSHIP, and CONTACT CHANNEL — is what keeps those four lightweight/cross-cutting entities from needing a separate type per owner.

**This is a conceptual pattern, not a code mandate.** "A notice/article/contact/etc. can relate to one of several valid subject types" is the entire semantic requirement — it does not prescribe a generic polymorphic-reference implementation. A later technical-architecture phase may satisfy it with explicit typed relationships, owner-specific reference fields, small per-owner join structures, or any other concrete approach; nothing here should be read as instructing a future implementer to build a generic polymorphism abstraction merely because this document names the pattern once.

---

## 5. Place model, worked

The candidate lifecycle list in the brief for PLACE — CURRENT, SEASONAL CURRENT, HISTORICAL, TEMPORARILY CLOSED, PERMANENTLY CLOSED, PROPOSED — reads as one list, but it actually names three different axes bundled together: whether the place exists at all, how it structurally operates, and what condition it happens to be in right now. This model keeps them separate rather than adopting the candidate list unmodified.

**Axis 1 — lifecycle (existence):** `PROPOSED` → `ACTIVE` → `HISTORICAL`. This is the only slow-changing axis, and the only one that ever gets called "lifecycle." A place that closes permanently transitions directly to `HISTORICAL` — there is no separate `PERMANENTLY-CLOSED` value, because once a place is definitively no longer operating, "historical" is the only fact left to state; the smallest clean model does not need two words for that.

**Axis 2 — operating pattern (a structural fact about how, not whether):** `YEAR-ROUND` / `SEASONAL` / `EVENT-BASED`. Via Nazario is `ACTIVE` + `YEAR-ROUND`. Parco is `ACTIVE` + `SEASONAL`. This value describes the *kind* of place it structurally is, and it does not flip on and off — Parco does not become a different kind of place between seasons, any more than Via Nazario becomes a different kind of place between closures.

**Axis 3 — current operational condition, which is never stored.** "Is this place open right now" is not a field anyone edits — it is derived, at render time, from the other two axes plus whatever is currently true: lifecycle must be `ACTIVE`; if operating_pattern is `SEASONAL`, is there a `CURRENT`-status `SEASON` window bound to this place right now; and is there any `ACTIVE`-status `NOTICE` scoped to this place overriding the default reading. Nothing about "open now" can drift out of sync with these sources, because nothing about it is independently editable.

**Worked against the two current examples:** Via Nazario — lifecycle `ACTIVE`, operating_pattern `YEAR-ROUND`, currently reading as closed purely because an `ACTIVE` `NOTICE` (12–26 August 2026, with its own `effective_start`/`effective_end` and automatic expiry) says so; the moment that notice expires, the derived read reverts with nothing to manually flip back. Parco — lifecycle `ACTIVE`, operating_pattern `SEASONAL`, currently reading as open because "now" falls inside a `CURRENT`-status `SEASON` window bound to it. Neither place's lifecycle value has changed at all in either case — a lifecycle field that had to flip every time a venue closed for a week or a season ended would invite exactly the staleness risk Task 12 warns about (a status a human has to remember to revert); deriving the current read instead means there is nothing to forget.

**A place-level closure is never organisation-wide by inference (Invariant, §21).** Nothing in the model allows a build step to derive "the organisation is closed" from any one PLACE's NOTICE, lifecycle, or operating pattern; an organisation-wide closure, if one is ever needed, requires its own NOTICE with `scope_target = ORGANISATION`, stated explicitly, not inferred from a place going quiet.

**A historical place is retained, never deleted.** Via Polese, Pratello 29/A, and da Osvaldo remain PLACE records with `lifecycle = HISTORICAL`, regardless of what their operating pattern once was (all three were `YEAR-ROUND` in their time — that fact is preserved as history, not as a currently-meaningful field), so that HISTORY ENTRY nodes have something concrete to point to, and so the Invariant "no historical venue may appear as a current destination" (§21) has something to check against rather than an absence.

---

## 6. Work / manifestation model, worked

The core relationship: **one durable WORK identity, referenced by zero or more manifestations, each carrying its own independent status.** A manifestation is not a fourth peer type glued onto WORK — it is EVENT or SERVICE, already first-class in its own right, simply carrying an optional reference back to the WORK it instantiates.

```
CENA AL BUIO  (WORK: id, name, description, mechanism, status=CURRENT)
    │
    ├── manifests_as → EVENT (Halloween 2025 night, status=OCCURRED)
    ├── manifests_as → EVENT (a future scheduled night, status=SCHEDULED)      [0..N]
    ├── manifests_as → SERVICE (corporate B2B offer, audience=private, status=CURRENT-SERVICE)  [0..1 typically]
    └── documented_by → ARTICLE (the ten-year case study) / HISTORY ENTRY (the 2024 promotional gap, as a dated note)
```

Each manifestation's status is independent: the SERVICE can be `CURRENT-SERVICE` while zero EVENTs exist (this is exactly Current Public State v1 §7's finding — the format is bookable privately with no public dates), and the WORK itself never needs a fourth "type" field trying to be all of these at once.

**Tested against five further cases, not just Cena al Buio:**

- **Cineporto / Parco programming.** WORK = the durable seasonal cultural format. Manifestations: dated EVENTs (concerts, screenings), each `belongs_to` a SEASON bound to the Parco PLACE; a HISTORY ENTRY/ARTICLE documenting Associazione Farm's public-branding persistence years past its operational transfer (Working Paper v0.3 §8) — a good test of `documented_by` carrying a genuinely complicating historical fact without disturbing the current WORK record. No SERVICE manifestation applies. The Comune di Bologna's 36-month collaboration pact is deliberately **not** folded into the WORK record — it is modelled as its own PARTNERSHIP (type=FORMAL-PUBLIC-ADMINISTRATION-AGREEMENT, scope=WORK+PLACE), because "who authorises/funds this" and "what this programme is" are different facts with different evidence standards.

- **LIS training.** WORK = the durable training capability. Historical manifestations: the 2016–17 recurring course and the 2023 Ente Nazionale Sordi convening, both as HISTORY ENTRY / PAST EVENT records. If revived: a SERVICE manifestation, status `PROPOSED` until confirmed bookable, at which point it moves to `CURRENT-SERVICE` (SERVICE's own real-world ladder, §3.6 — no other value is needed). This case tests the WORK identity surviving a long gap between a past manifestation and a possible future SERVICE without needing the WORK's own status to flip back and forth.

- **Aperitivo dal Mondo.** WORK = the durable world-food format (continuous 2022–2025 per Working Paper v0.3). Manifestation: a high-volume stream of near-weekly EVENTs — the useful test here is confirming that *volume* belongs entirely in EVENT, never pushed up into the WORK record itself. Its current status ("recent but unverified" per Current Public State v1 §6) is not a new status value and is not a change to `status` at all — `status` stays `CURRENT`. What has actually happened is that `last_evidenced` is old and `review_after` has lapsed, so the WORK's freshness condition (§18) reads `REVIEW_DUE`/`STALE` rather than `CURRENT` — a fact about how well the claim is currently evidenced, computed deterministically, with the eventual display consequence left to a later, explicit display-policy decision, not asserted here.

- **A recurring music/performance format (e.g. Spazi Migranti).** WORK = the durable format identity. Manifestations: a similarly high-volume EVENT stream, plus a `relates_to → PARTNERSHIP` link to the migrant/refugee associations co-running it (scope=WORK, not scope=PROJECT) — this tests PARTNERSHIP attaching to a WORK directly, independent of any funded PROJECT.

- **A recurring exhibition programme.** WORK = the durable exhibitions format. Manifestations: dated EVENTs, one of which (the 2017 Braille-captioned photography exhibition) carries a historically significant access fact. Once an EVENT is `OCCURRED` and old enough to be purely historical, its access detail is better carried forward as HISTORY ENTRY / ARTICLE narrative than kept as a live `access_override` on an EVENT record no live page still queries — a retention/archival detail for the later implementation phase, not a schema requirement now.

**The boundary this section keeps, restated:** a durable, repeatable format is a WORK with manifestations; a bounded, funded, dated undertaking is a PROJECT (§8). Sensory Dialogues is the clearest test that fails the WORK/manifestation shape on purpose — see §8.

---

## 7. Event model

Covered in field terms in §3.4 and in relational terms in §4 and §6. Two points worth stating explicitly here because they cross several sections:

- **An EVENT is the only entity in this model that carries a genuine date-status lifecycle rather than the PROPOSED→CURRENT→PAST ladder used elsewhere** — SCHEDULED / CANCELLED / POSTPONED / OCCURRED — because "did this specific occurrence happen, on what date" is a fundamentally different question from "is this durable thing still offered."
- **No EVENT may exist with neither a date nor an explicit date-status** (Invariant, §21) — this is what lets Cena al Buio's private-bookable, publicly-dateless state (§6) be represented by the simple absence of any EVENT record, rather than by an EVENT record with a null date sitting ambiguously in a listing.

---

## 8. Project model, worked

A project is distinguished from a programme by having an **application/award lifecycle** a durable WORK format does not have. The model requires each of the following transitions to be backed by a distinct evidence class, not by an editor's discretion:

| Transition | Requires |
|---|---|
| → PROPOSED | An internal decision to pursue; no external evidence required yet |
| → SUBMITTED | A filed application/proposal document (dated, with named partners if any) |
| → AWARDED | A formal award decision or signed agreement — never a submission alone |
| → ACTIVE | Evidence of actual delivery having begun (an event produced, a partner activity recorded) |
| → COMPLETED | A defined end state reached — a report submitted, a grant liquidated, a residency concluded |
| → DECLINED | The funder/authority formally said no |
| → WITHDRAWN | The applicant pulled the application before a decision |
| → CANCELLED | Agreed or awarded, then stopped before COMPLETED |

**A stalled application with an unknown outcome does not get a status value of its own.** DECLINED, WITHDRAWN, and CANCELLED are all real-world facts requiring their own evidence; "we submitted this and don't currently know what happened" is not a fourth kind of ending — it is the record staying at its last-confirmed state (typically SUBMITTED) while its evidence/freshness metadata (§17–§18) carries the uncertainty. Collapsing "unknown outcome" into a lifecycle value would be exactly the state/evidence conflation §2's eleventh design principle rules out.

**Worked example — Cultura Verde**, the one case in the evidence base where the full ladder is documented end to end: SUBMITTED (an application to the Comune's Quartiere Porto-Saragozza) → AWARDED (May 2024, €8,000, scored 81 points — a formal award decision, not a submission) → ACTIVE (the "Il Porto Verde di Bologna" children's programme actually delivered in 2024, independently corroborated by a July 2024 Facebook credit line) → COMPLETED (the associated financial contribution liquidated in 2025 after eligible expenditure was reported). This project's own accounting status and its delivery status are, per Working Paper v0.3 §13, two separable facts — the model keeps them separable by never inferring ACTIVE from AWARDED alone; ACTIVE requires its own delivery evidence.

**Worked example — SEGNI DI PACE:** SUBMITTED only (March 2026, €18,000, one signed letter of adhesion). The model blocks this from rendering as AWARDED or as delivered work under any circumstance (Invariant, §21) until a formal award decision exists.

**Worked example — Sencity:** PROPOSED only — a concept document demonstrating ambition, not an established festival. Never renders beyond "in development," if the organisation chooses to mention it at all.

**Worked example — the 2026 Cineporto/Parco draft:** PROPOSED, with every named organisation in the draft represented as a PARTNERSHIP record scoped to this specific PROJECT with `status = PROPOSED` — none of them is promotable to a WORK-level "current partner" until the project itself advances and each relationship is independently reconfirmed.

**Relationship to WORK:** a PROJECT may `relate_to` a WORK (Cultura Verde extended the existing Parco/Cineporto WORK; Sensory Dialogues did not extend any existing WORK — see below). This relation is optional and does not imply the WORK's own status changes because of the project's.

**The clearest negative test — Sensory Dialogues.** A funded, EU/Goethe-Institut-backed, time-boxed Deaf/hearing performance residency (Working Paper v0.3 §8) does **not** fit the WORK/manifestation shape, and that is informative rather than a gap: it has its own funder, its own dates, and its own concluded outcome, with no ongoing manifestation stream. It is modelled purely as a PROJECT (COMPLETED), optionally `documented_by` a HISTORY ENTRY or ARTICLE once concluded, and it is **not** forced into a WORK record merely because it involves a recognisable practice (Deaf/hearing sensory collaboration) the organisation has done before in other forms. Keeping this boundary intact is precisely what stops every interesting funded activity from inflating the WORK entity into something it isn't.

---

## 9. Service model

Covered in field terms in §3.6. The one point worth adding here: a SERVICE's bookability is gated entirely by its own `status`, never by the existence of a matching MePA procurement-category filing. Per Working Paper v0.3 §13 and Current Public State v1 §8, a MePA listing evidences eligibility positioning, not delivery — the model treats this as a hard rule (Invariant, §21), not a judgment call left to whoever drafts the Work-with-us page.

---

## 10. Season / programme grouping

Covered in field terms in §3.7. SEASON exists purely to let a SEASONAL place's or a WORK's "current" claim be qualified to a bounded, recurring window (this year's Parco summer programme) without inventing a heavier entity, and without overloading PLACE's own lifecycle or operating-pattern fields with per-year values — a place's operating pattern says it *is* seasonal in kind; the SEASON record says which specific window is current right now. A SEASON groups EVENTs and, optionally, instantiates a yearly recurrence of a WORK (e.g. "Cineporto, summer 2026" as this year's specific instance of the durable Cineporto WORK) — but the WORK's own identity persists across seasons that come and go, exactly as scenario 9 in §22 requires.

---

## 11. Accessibility model

**No entity in this model may collapse to a single `accessible` boolean.** This is stated as a hard rule, not a preference, and is checked explicitly in §21's invariants.

**Structural recommendation — hybrid, per Task 6's own framing:** the nine dimensions (physical, visual, Deaf/communication, hearing/audio, cognitive/information, digital, event-specific, assistance/contact, temporary limitations) live as an **ACCESS PROFILE entity** describing exactly one PLACE — not flat fields bolted onto PLACE itself, and not scattered free text. An EVENT does **not** get its own full ACCESS PROFILE record; instead it carries lightweight, optional `access_override` fields, one slot per dimension, that supersede the host PLACE's baseline only for that event's own display, defaulting to "inherits venue baseline" when unset. This is the hybrid: a heavier, independently-verified profile per place; a lightweight override, not a second heavy entity, per event.

Each dimension within an ACCESS PROFILE carries two independent axes, never merged into one vocabulary:
- **condition** (the real-world fact): the practical condition itself as a structured value, or one of two real-world qualifiers when there simply is no ordinary condition to describe — `NOT-PRESENT` (the feature/accommodation genuinely does not exist here) or `NOT-APPLICABLE` (this dimension has no meaningful bearing on this place)
- **verification status** (the evidence fact, reusing §17's five-value publication-status vocabulary rather than a bespoke one): VERIFIED-CURRENT / VERIFIED-HISTORICAL / NEEDS-VERIFICATION / CONFLICTING / DO-NOT-PUBLISH
- `verified_date` and `authority` (who confirmed the condition, and when)
- a `recheck_rule` (how often this dimension should be reconfirmed) — feeding the same deterministic freshness computation defined in §18
- an optional `temporary_exception_ref` pointing to a NOTICE (e.g. a wheelchair route temporarily rerouted for construction)

**Baseline, event-specific, and temporary are three distinct mechanisms, not one field wearing three hats.** The ACCESS PROFILE itself is the durable baseline for a PLACE. An EVENT's own `access_override` fields (§3.4, §11 above) supersede that baseline only for that specific event's display, and only for the dimensions actually set — never by rewriting the baseline record. A temporary limitation (a route blocked for construction, a lift out of service) never touches the baseline profile either: it is expressed purely through a scoped, time-bound NOTICE referenced by the dimension's `temporary_exception_ref`, and it reverts to the baseline automatically once that notice expires. None of the three mechanisms edits another's data.

**Digital access is handled differently from the other eight.** It is an ongoing engineering responsibility enforced by the build itself (per AGENTS.md: "preserve accessibility as a design-system requirement, not a marketing layer"), not a claim requiring verification metadata — the model does not create a content record for it, only notes that it must be structurally enforced elsewhere.

**A dimension whose verification has lapsed does not keep asserting its last known value as if it were still fresh.** Once `now` passes `verified_date + recheck_rule`, the dimension's derived freshness condition (§18) leaves `CURRENT`; this document does not prescribe the exact fallback presentation (that is a display-policy decision for a later phase), but it does require, as a floor invariant (§21), that a lapsed dimension never renders as though freshly verified. This is the mechanism that resolves scenario 11 in §22 (an accessibility fact last verified 18 months ago) without a human needing to remember to change anything — time flags the fact for review; it does not silently keep asserting it.

---

## 12. Operational status / notice model

Covered in field terms in §3.9. The model requires every NOTICE to carry:

- `scope_target` — exactly one of PLACE, EVENT, WORK, SEASON, SERVICE, ORGANISATION, GLOBAL, plus the specific target's id
- `effective_start` / `effective_end` — when the condition actually applies
- `display_start` / `display_end` — optional, if the notice should be shown earlier (advance warning) or later (a grace period) than the effective window itself
- `expiry` — an explicit point past which the notice can never render, even if `effective_end` was set wrong
- `severity` — informational / warning / closure-level
- `public_message` and `source/authority`
- `status` — DRAFT / ACTIVE / EXPIRED / WITHDRAWN

**Auto-expiration is a build-time behaviour, not an editorial habit.** A NOTICE past its `effective_end` (or `expiry`, whichever governs) is simply excluded from rendering by the build — this is the single mechanism, named directly in the brief, that prevents a closure banner from surviving three weeks past its relevance because nobody remembered to take it down.

---

## 13. Organisation model

Covered in field terms in §3.2. Kept deliberately minimal, per Task 8's explicit instruction not to build a corporate registry: no board-composition tracking, no legal-representative field required for launch (Institutional Architecture v1 §21, decision 1 already defaults to omitting one), no workforce-percentage field rendered publicly under any circumstance (Current Public State v1 §10, item 6).

What the entity does carry: `legal_name`, `public_name` (used only for the disambiguation sentence, never as a substitute for how a visitor-facing page actually refers to the place — Institutional Architecture v1 §5), `legal_form` in general terms only ("a cooperative," not the specific Italian sub-type, which is not established in the evidence base and is not guessed at), `lifecycle_status` (CURRENT/HISTORICAL), `registration_date`, and the `succeeds`/`superseded_by` relation that gives the four-entity chain (Associazione L'Altro Spazio → L'Altro Spazio S.r.l. → L'Altro Spazio Pratello SRLS running in parallel with the S.r.l. → Cooperativa L'Altro Spazio) somewhere structural to live, exactly as Working Paper v0.3 §10, §15 insists it must never be collapsed into one continuous identity.

**Associazione Farm is modelled as its own ORGANISATION record, current, not historical, and not part of the L'Altro Spazio succession chain** — it is a separate organisation with its own overlapping presence at Parco, linked to the Cineporto WORK and the Parco PLACE via a PARTNERSHIP record, never folded into L'Altro Spazio's own entity history. This resolves cleanly from the evidence already in Working Paper v0.3 §8 and requires no owner input.

**What ORGANISATION deliberately does not carry:** the broader, trans-entity public identity — "L'Altro Spazio" as a decade-long practice spanning four legal entities and five environments — is not the same thing as Cooperativa L'Altro Spazio, the current legal operator, and this entity must not be made to speak for both. ORGANISATION's own editorial field is a narrow, current-operator-scoped description only. The concise public-facing explanation of what L'Altro Spazio broadly *is* (Institutional Architecture v1 §2B) is sourced elsewhere — see §22's corrected homepage-assembly resolution — precisely so the current cooperative never silently becomes the semantic owner of the whole public identity's history.

---

## 14. Contact model

Covered in field terms in §3.13. Each CONTACT CHANNEL carries `purpose` (booking / general-info / collaborations / accessibility-question), `audience`, `channel_type`, `value`, `status`, `public/private`, `preferred` (bool), `response_mode`, `last_verified`/`review_after` (§18), and a polymorphic `owner_ref`. The second phone number surfaced in Current Public State v1 §2 (info/collaborations) is exactly the case this entity exists for: the model can represent "a second, purpose-distinct channel exists" cleanly the moment it is owner-confirmed for the new site — nothing about the model itself needs to wait on that confirmation, only the specific record's population does.

---

## 15. Partnership / relationship model

Covered in field terms in §3.12. Kept lightweight rather than a full registry, per Task 10's own instruction — a name in a proposal document is a PARTNERSHIP record with `status = PROPOSED`, `scope_ref` pointing at the specific PROJECT it appears in, and nothing more; it never inherits visibility on a general partners page. The Comune di Bologna's 36-month pact and Associazione Farm's ongoing Parco collaboration are both `status = ACTIVE` PARTNERSHIP records, distinguished from each other by `relationship_type` (FORMAL-PUBLIC-ADMINISTRATION-AGREEMENT vs. ONGOING-COLLABORATOR), not by separate entities.

---

## 16. Editorial / history model

HISTORY ENTRY (§3.10) supplies the dated, structured spine; ARTICLE (§3.11) supplies interpretive and narrative depth built on top of that spine. The rule that keeps operational entities from absorbing narrative weight they shouldn't carry: **PLACE.description stays short and functional** (what a visitor needs to recognise it); the decade-long story of how Via Nazario came to be, or why Cena al Buio has run unchanged for ten years, lives only in ARTICLE and HISTORY ENTRY records that reference the PLACE or WORK, never inside the operational record's own description field. Oral-history material (the interview corpus, the origin narratives) is explicitly gated by ARTICLE's separate `consent_status` field — publication-readiness and speaker consent are two different gates, and neither substitutes for the other, matching Institutional Architecture v1 §11's "carefully and with consent" standard.

**ARTICLE is also where the site's broader public-identity summary lives**, precisely because it is not owned by any single operational entity — see §13's correction and §22's homepage-assembly resolution: the concise "not just a bar" explanation is a standalone (or multiply-related) ARTICLE, not a field on the current legal ORGANISATION.

---

## 17. Evidence / provenance metadata

Every public-sensitive fact — a specific field value, not necessarily a whole record — carries provenance metadata. Deliberately simplified from the working paper's own fourteen-value research vocabulary (DOCUMENTED, CORROBORATED, OWNER-CONFIRMED, ATTRIBUTED, PROPOSED, INTERPRETATION, HYPOTHESIS, UNRESOLVED, NOT ESTABLISHED, CONFLICTING, CONTRADICTED, INVALID INFERENCE, DO-NOT-PUBLISH, IMPLEMENTATION UNCERTAIN, CONFIDENTIAL SUPPORT), which remains exactly right for historical research citation inside HISTORY ENTRY and ARTICLE evidence references, but is too granular for day-to-day operational content fields on PLACE, WORK, SERVICE, and the rest. For those, a five-value publication-status field is enough:

- **VERIFIED-CURRENT** — an owner or otherwise authoritative current source, within its recheck window
- **VERIFIED-HISTORICAL** — fine for HISTORY/ARTICLE content, never valid as the basis for a current-facing claim
- **NEEDS-VERIFICATION** — a known gap; renders only as an explicit "to be confirmed" state
- **CONFLICTING** — multiple sources disagree; renders as "to be confirmed," never a guessed single value
- **DO-NOT-PUBLISH** — explicitly excluded (confidential, unresolved-sensitive, or a legacy claim marked don't-migrate)

Each field additionally carries `source`, `authority`, `verified_date`, and `recheck_after`.

**Which fields belong where:**
- **PUBLIC CONTENT** — the value itself, as rendered.
- **INTERNAL EDITORIAL METADATA** — `source`, `authority`, `verified_date`, `recheck_after`, owner-confirmation notes, conflict notes.
- **BUILD-TIME VALIDATION METADATA** — the `publication_status` value itself (it gates rendering), and any computed expiry/staleness flag derived from `recheck_after`.

This provenance model is defined on its own semantic terms, independent of any particular storage or tooling. Institutional Architecture v1 §17 notes that a similarly-shaped discipline already exists in current infrastructure; a later technical-architecture phase may draw on that discipline where it genuinely fits the semantics defined here, but this document does not treat existing infrastructure as the default host for it, consistent with the greenfield instruction.

---

## 18. Temporal / freshness model

Six tiers, carried forward from Current Public State v1 §12 because they already proved themselves against this organisation's real facts rather than an abstract taxonomy:

| Tier | Typical fields | Recheck behaviour |
|---|---|---|
| STABLE | Legal name, coordinates, founding dates | Verify only on operational/legal change |
| SEMI-STABLE | Contact channels, organisational relationship framing, service descriptions | Review periodically, owner-confirmation-gated |
| SEASONAL | SEASON windows, place seasonal status | Reverify every cycle; never carry last year's dates forward |
| VOLATILE | WORK current-status claims, SERVICE bookability, PARTNERSHIP, CONTACT CHANNEL | Recheck frequently; freshness condition (below) flags review automatically |
| EVENT-SPECIFIC | EVENT access overrides, EVENT booking details | Set and verified per event, at authoring time |
| TEMPORARY | NOTICE content | Carries its own explicit expiry, defined once in §12/§3.9 — no separate mechanism needed |

**Deterministic freshness, not interpretive build logic.** Every entity that can make a current-tense claim (WORK, SERVICE, ACCESS PROFILE dimension, PARTNERSHIP, CONTACT CHANNEL, and seasonal/current place information) carries `last_verified` and `review_after`. From these two fields alone, a **freshness condition** is derived purely mechanically:

- **CURRENT** — now ≤ review_after
- **REVIEW_DUE** — now > review_after, within a further, similarly fixed grace period
- **STALE** — now is past that further grace period as well

Both thresholds are plain date arithmetic on stored fields — there is no interpretation, judgment, or content-aware reasoning involved in computing which of the three conditions applies at any moment.

**Key rule: time may flag content for review; time alone must never silently rewrite its meaning.** A lapsed freshness condition never changes what an entity's own `status` says happened — the WORK described in §6's Aperitivo dal Mondo case still has `status = CURRENT`; only its `freshness_condition` moves to REVIEW_DUE or STALE. What that condition should *do* to the rendered page — render normally, render with a "last confirmed on [date]" note, suppress a current-facing call-to-action, drop out of a "current" listing while remaining reachable elsewhere, or simply queue the record for editorial review — is a **public display policy**, and this document deliberately does not prescribe it: that choice belongs to a later implementation/UX phase, once the semantic model is stable. The one thing this document does require, as a floor rather than a full policy (§21), is that a STALE fact must never render as though it were still CURRENT.

**This is the mechanism that resolves the "programme disappears for two years and returns" scenario without inventing a new status value** (§6, §22 scenario 9): the WORK's own `status` stays CURRENT throughout the entire gap; only its computed freshness condition moves through REVIEW_DUE to STALE and back to CURRENT the moment a new EVENT or SERVICE re-references it and resets `last_verified`. Archival behaviour (moving a record fully into HISTORY once it is truly concluded, not merely quiet) remains a distinct, real-world status change an editor makes deliberately — freshness never performs that transition on its own.

---

## 19. Localisation readiness

No translation strategy is decided here, and none needs to be for the model to be ready for one later. The distinction that matters: **language-neutral facts** (dates, coordinates, status enum values, ids, phone numbers) versus **localised editorial text** (titles, descriptions, narrative, access instructions in prose). Every entity's text-bearing fields are structured as a language-keyed map (e.g. `{it: "...", en: "..."}`) rather than a bare string, defaulting to Italian with English or any other language addable later without touching the entity's shape. Facts (a date, a coordinate, a status value) are never duplicated per language, because they are not language-dependent in the first place. This is a structural readiness note, not an implementation of translation.

---

## 20. Entity field definitions

Field-level conceptual shape for each of the thirteen entities, grouped as identity / state / relationships / editorial / internal metadata, per the format demonstrated in the brief. Not schemas — no types, no code.

### PLACE
- **identity:** id, canonical name, public short name
- **state:** lifecycle (PROPOSED/ACTIVE/HISTORICAL) — the existence axis; operating_pattern (YEAR-ROUND/SEASONAL/EVENT-BASED) — a separate, independent axis; current operational condition is not stored, only derived (§5)
- **location:** address, coordinates
- **relationships:** operator (ORGANISATION), access profile (ACCESS PROFILE), bound season (SEASON, if operating_pattern = SEASONAL)
- **editorial:** localised short description
- **internal metadata:** provenance per field (§17)

### ORGANISATION
- **identity:** id, legal_name, public_name
- **state:** lifecycle_status (CURRENT/HISTORICAL), legal_form (general terms only)
- **relationships:** operates (PLACE[]), succeeds / superseded_by (ORGANISATION), contact channels
- **editorial:** localised current-operator description only — deliberately narrow; the broader trans-entity public-identity explanation is not this entity's field, see §13 and §22
- **internal metadata:** registration_date, provenance; board/legal-representative fields exist in shape only, withheld from public rendering by default

### WORK
- **identity:** id, name
- **state:** status (PROPOSED/CURRENT/PAST/ARCHIVED), last_evidenced, review_after
- **relationships:** manifests_as (EVENT[], SERVICE[0..1+]), documented_by (HISTORY ENTRY[], ARTICLE[]), relates_to (PARTNERSHIP[], optional), grouped_by (SEASON, optional)
- **editorial:** localised description, mechanism/lifecycle note
- **internal metadata:** provenance per field

### EVENT
- **identity:** id, title
- **state:** date-status (SCHEDULED/CANCELLED/POSTPONED/OCCURRED), date/time or explicit "to be announced"
- **relationships:** occurs_at (PLACE), references (WORK optional, PROJECT optional), belongs_to (SEASON optional)
- **editorial:** localised description, booking info
- **internal metadata:** access_override (per-dimension, optional), provenance

### PROJECT
- **identity:** id, name
- **state:** status (PROPOSED/SUBMITTED/AWARDED/ACTIVE/COMPLETED/DECLINED/WITHDRAWN/CANCELLED) — real-world outcomes only; an unknown/unresolved outcome is never a status value, it is expressed by the record remaining at its last-confirmed state plus its own freshness/evidence metadata (§17–§18); key dates per transition
- **relationships:** relates_to (WORK, optional), produces (EVENT[]), involves (PARTNERSHIP[]), subject_of (HISTORY ENTRY/ARTICLE, once concluded)
- **editorial:** localised public-safe description (only once status permits mention)
- **internal metadata:** funder, budget (internal only), evidence for each transition

### SERVICE
- **identity:** id, name
- **state:** status (PROPOSED/CURRENT-SERVICE/INACTIVE/ARCHIVED)
- **relationships:** manifests_from (WORK), contact channel
- **editorial:** localised description, audience (B2B/public/school/etc.)
- **internal metadata:** provenance, last_evidenced/review_after

### SEASON
- **identity:** id, label
- **state:** status (PLANNED/CURRENT/PAST), start_date, end_date
- **relationships:** occurs_at (PLACE), instantiates (WORK, optional), groups (EVENT[])
- **editorial:** localised label/description
- **internal metadata:** provenance

### ACCESS PROFILE
- **identity:** id, describes (PLACE)
- **state:** per dimension, two separate axes — condition (the real-world value, or NOT-PRESENT/NOT-APPLICABLE) and verification_status (VERIFIED-CURRENT/VERIFIED-HISTORICAL/NEEDS-VERIFICATION/CONFLICTING/DO-NOT-PUBLISH, reusing §17's vocabulary)
- **relationships:** temporary_exception per dimension (NOTICE, optional)
- **editorial:** per-dimension localised practical-condition text
- **internal metadata:** per-dimension verified_date, authority, recheck_rule (feeds the §18 freshness computation)

### NOTICE
- **identity:** id
- **state:** status (DRAFT/ACTIVE/EXPIRED/WITHDRAWN), severity
- **relationships:** scope_target (polymorphic, exactly one)
- **editorial:** localised public_message
- **internal metadata:** effective_start/end, display_start/end, expiry, source/authority

### HISTORY ENTRY
- **identity:** id, date (or range)
- **state:** publication status (DRAFT/PUBLISHED), discontinuity flag
- **relationships:** subject_ref (polymorphic: PLACE/ORGANISATION/WORK/PROJECT)
- **editorial:** localised title, short narrative
- **internal metadata:** evidence reference, public-safety flag

### ARTICLE
- **identity:** id, title
- **state:** publication status (DRAFT/PUBLISHED), consent_status (where applicable)
- **relationships:** relates_to (WORK/PLACE/PROJECT/HISTORY ENTRY/person, optional)
- **editorial:** localised body
- **internal metadata:** evidence references, consent record

### PARTNERSHIP
- **identity:** id, partner_name
- **state:** status (PROPOSED/LETTER-OF-SUPPORT/ACTIVE/PAST), relationship_type
- **relationships:** scope_ref (polymorphic: PROJECT/WORK/PLACE/ORGANISATION)
- **editorial:** localised short description of the relationship
- **internal metadata:** evidence reference, dates, last_verified/review_after (§18)

### CONTACT CHANNEL
- **identity:** id, purpose
- **state:** status (CURRENT/INACTIVE), public/private
- **relationships:** owner_ref (polymorphic: ORGANISATION/PLACE/SERVICE)
- **editorial:** localised label (e.g. "Bookings," "Accessibility questions")
- **internal metadata:** value, audience, response_mode, provenance, last_verified/review_after (§18)

---

## 21. Validation invariants

Rules the eventual build system should enforce mechanically, not editorially.

1. A PROJECT with status ∈ {PROPOSED, SUBMITTED} must never render on any "current work" or "completed work" surface.
2. A PLACE with lifecycle = HISTORICAL must never appear in a current Visit-destination listing, regardless of what its operating_pattern once was.
3. A NOTICE past its `expiry` (or `effective_end`, whichever governs) must not render, with no manual removal step required.
4. A dimension whose freshness condition (§18) is REVIEW_DUE or STALE must never render as though it were still VERIFIED-CURRENT; the exact fallback presentation is a display-policy decision for a later phase, but silent continuation of a stale claim is never permitted.
5. A SERVICE with status ∈ {INACTIVE, ARCHIVED, PROPOSED} must never render a booking/contact call-to-action as if bookable now.
6. An EVENT must carry either a concrete date or an explicit date-status; no EVENT may render with neither.
7. A PARTNERSHIP with status = PROPOSED must never appear on a general/organisation-wide partners listing; it may appear only inside the specific PROJECT/WORK it is scoped to, and only if that record itself is public.
8. A historical organisational statistic (a workforce percentage, an attendance figure) sourced from a HISTORY ENTRY or ARTICLE must never render on a CURRENT-scoped surface (PLACE, ORGANISATION-current-facts, SERVICE) — only inside HISTORY/ARTICLE content, explicitly dated.
9. No build step may derive an organisation-wide status from any single PLACE's NOTICE or lifecycle_status; ORGANISATION-scope claims require their own ORGANISATION-scoped NOTICE or record.
10. Every WORK, PROJECT, and SERVICE record must carry a `status` field; a record without one fails validation outright.
11. Any field whose `publication_status` is DO-NOT-PUBLISH or NEEDS-VERIFICATION must not render on any public surface, regardless of what other fields on the same record say.
12. A CONFLICTING-status fact must render only as "to be confirmed" (or not at all) — never a single asserted value chosen by the build or the editor.
13. A page naming a historical PLACE or ORGANISATION must state, in the same view, that it is closed/superseded and since when — silence on closure status is an explicit validation failure, not a stylistic choice.
14. No entity, anywhere, may carry a field literally reducible to a single "accessible"/"fullyAccessible" boolean; a schema check should reject any such field outright.
15. No entity may substitute an evidence-uncertainty condition ("not established," "unknown outcome," "unconfirmed") for a real-world lifecycle/status value; uncertainty is expressed only through provenance/freshness metadata (§17–§18), never as a status enum member in its own right.
16. A PLACE's current operational condition must never be a separately stored, independently editable field — it must always be computed at render time from lifecycle + operating_pattern + any bound SEASON + any ACTIVE-scope NOTICE, so it can never drift out of sync with those sources.

---

## 22. Scenario stress test

| # | Scenario | Model behaviour | Hack required? |
|---|---|---|---|
| 1 | Via Nazario closes 10 days, Parco stays open | A NOTICE scoped to Via Nazario's PLACE; Via Nazario's `lifecycle` (ACTIVE) and `operating_pattern` (YEAR-ROUND) are both untouched throughout — only the derived current-operational-condition read changes, and only for Via Nazario. Parco's PLACE record, operating_pattern (SEASONAL), and SEASON are entirely independent — no shared field exists to leak between them. | No |
| 2 | Cena al Buio has no public dates but is privately bookable | WORK.status = CURRENT; zero EVENT records reference it; one SERVICE (audience=private/B2B) does, status=CURRENT-SERVICE. What's-on correctly shows nothing; Work-with-us shows the bookable offer. | No |
| 3 | Cena al Buio later gains two scheduled public events | Two new EVENT records created, `references` the same WORK, status=SCHEDULED. WORK identity unchanged; `last_evidenced` refreshes. | No |
| 4 | A grant application is submitted but never funded | PROJECT created at SUBMITTED; if formally declined, transitions to DECLINED (a real-world outcome); if it simply stalls with no known resolution, it stays at SUBMITTED, with its freshness condition (§18) moving to REVIEW_DUE/STALE to flag the gap — "we don't know" is never its own status value. Never renders as AWARDED/delivered at any point. | No |
| 5 | A project is awarded and creates five events | PROJECT transitions SUBMITTED→AWARDED→ACTIVE on formal-decision evidence; five EVENT records created with `references → PROJECT`. | No |
| 6 | A partner appears only in a proposal | A PARTNERSHIP record, status=PROPOSED, scope_ref = that PROJECT. Blocked by Invariant 7 from any general partners listing. | No |
| 7 | A wheelchair route changes temporarily for construction | The physical-access dimension's `temporary_exception_ref` points to a NOTICE (scope=PLACE, severity=warning, dated); the baseline resumes automatically once the notice expires. | No |
| 8 | An old venue remains historically important but is closed permanently | PLACE.lifecycle = HISTORICAL, retained (not deleted), regardless of its former operating_pattern; a HISTORY ENTRY documents it; Invariant 2 blocks it from any current listing. | No |
| 9 | A programme disappears for two years and returns | WORK.status stays CURRENT throughout — no lifecycle change at all; its computed freshness condition (§18) moves CURRENT → REVIEW_DUE → STALE as `review_after` lapses, then back to CURRENT the instant a new EVENT/SERVICE re-references it and resets `last_verified`. The exact display consequence of REVIEW_DUE/STALE is a separate, later policy decision, not asserted here. | No |
| 10 | A service is no longer offered but remains part of historical work | SERVICE.status → ARCHIVED, removed from booking surfaces; the WORK it manifested from is unaffected; a HISTORY ENTRY/ARTICLE may still reference the archived SERVICE narratively. | No |
| 11 | An accessibility fact was last verified 18 months ago | The dimension's `verified_date` + `recheck_rule` has lapsed; Invariant 4 forces the downgraded "needs reverification" state automatically at build time. | No |
| 12 | One event has different accessibility conditions than its host venue baseline | The EVENT's own `access_override` fields supersede the PLACE's ACCESS PROFILE for that event's display only; unset dimensions inherit the baseline. | No |

All twelve scenarios resolve using mechanisms already defined above — none required a new entity, a new status value, or a special-case exception introduced solely to make the scenario work.

**Homepage assembly test (Task 15), included here as a thirteenth check because it stresses the model differently — for duplication, not for correctness:** a future homepage needs (a) current PLACE status for Via Nazario and Parco plus any ACTIVE-scope NOTICE, (b) upcoming EVENTs, (c) one concise institutional explanation, (d) selected CURRENT WORK entries, (e) a visit path, (f) a collaboration path. The one risk this test surfaces: the "2–3 sentence outsider explanation" (Institutional Architecture v1 §2B) is genuinely global — not about one place, one work, or one legal entity — and a careless model would be tempted either to hardcode it into a homepage template as a duplicate fact, or to attach it to the current ORGANISATION record, which would silently make the current cooperative the semantic owner of a decade-long, four-entity public identity it does not legally represent (§13). **Corrected resolution:** this text is a single, standalone ARTICLE (§3.11) — an editorial unit that may `relate_to` the current ORGANISATION, relevant WORK entries, and HISTORY without being owned by any one of them — and the homepage *references* that one ARTICLE rather than duplicating it or parking it on ORGANISATION. No other duplicate-fact risk was found; every other homepage element is a straightforward filtered query over already-defined entities.

---

## 23. Things deliberately not modelled

- **Team/staff directory.** No current workforce composition is verified (Current Public State v1 §9–§10), and Institutional Architecture v1 §21 decision 2 already recommends against a team page at v1. The model supports a person being *named* contextually inside a HISTORY ENTRY or ARTICLE (with consent), but there is no ROSTER/PERSON entity with its own public page.
- **Impact metrics / statistics dashboard.** No verified current impact figures exist; a dashboard entity would only pressure someone to populate it with unverifiable numbers. Excluded, matching Institutional Architecture v1 §3's own exclusion of a generic "Impact" layer.
- **Testimonials.** The current production site's three named testimonials carry no provenance found anywhere in this research (Current Public State v1 §1) — this is exactly the kind of content a TESTIMONIAL entity would legitimise going forward. Not modelled.
- **Donation campaigns.** No evidence this is part of the organisation's model; nothing requires it.
- **A generic "Values" entity.** Folded, by design, into ARTICLE as specific practice rather than abstraction — a separate MISSION/VALUES type would only invite the "generic NGO" register Institutional Architecture v1 §19 already flags as a risk.
- **A legal/board governance registry.** Explicitly out of scope per Task 8 — the model is not a corporate registry, and the current legal-representative conflict (Working Paper v0.3 §16) stays unresolved and unpublished by default, not modelled as a field waiting to be filled.
- **Every Facebook post as structured data.** The Facebook archive is historical evidence feeding HISTORY ENTRY and ARTICLE content by editorial judgement — it is not a first-class content family the new site ingests wholesale.
- **A full accessibility-certification record.** The model supports practical, dated, owner/staff-verified conditions (§11); it does not model formal regulatory compliance measurement or certification, which Current Public State v1 §4 explicitly separates out as a distinct, larger undertaking this content model is not designed to carry.
- **CripMinds as an entity or content family.** Per Institutional Architecture v1 §13, at most a single contextual footer link is in scope, and that is a navigation decision, not a content-modelling one — no entity is needed to represent it.

Each exclusion above mirrors one already made in the institutional architecture or current-state documents; none is a new judgment call invented for this document.

---

## 24. Legacy migration boundary

This document was written without inspecting `content/venue.json`, `content/events/`, `content/notices/`, `content/candidates/`, or any other existing schema, per the greenfield instruction. The migration path, when it eventually happens, is conceptual only at this stage:

```
OLD DATA (a phone number, an active notice, a social handle, a verified address)
    -> VERIFY (against current, owner-confirmed, or live-independent sources — never the legacy site itself as authority, per Current Public State v1 §11)
    -> MAP TO NEW ENTITY (does this fact fit PLACE, CONTACT CHANNEL, WORK, etc. cleanly?)
    -> REVIEW (does the mapped value carry real provenance under §17's model, or only inherited assumption?)
    -> IMPORT (only after both verification and mapping succeed)
```

**Anything that cannot map cleanly does not distort the new model.** A legacy `accessible: true` boolean, for example, has no destination field in this model at all (§11) — it does not get force-fit into one of the nine ACCESS PROFILE dimensions; it is simply data that fails to migrate, exactly as Current Public State v1 §1 already flagged the equivalent legacy claims ("completely accessible," the unverified 50%/80% workforce figures, the unattributed testimonials) as DO-NOT-MIGRATE. The new model's shape is not adjusted to accommodate data that does not fit it.

---

## 25. Open decisions

Per the brief's own instruction, owner questions are not invented where the semantic model does not require one. Reviewing all twenty-one preceding tasks, the semantic model itself does not have a genuine blocking open decision — every place a judgment call was needed (Associazione Farm's organisational independence from the L'Altro Spazio succession chain, §13; the Comune pact modelled as a PARTNERSHIP rather than folded into the Cineporto WORK, §6; SEASON and PARTNERSHIP kept lightweight rather than heavy, §3) was resolvable directly from Working Paper v0.3 and Current Public State v1's own evidence, and is stated as a decision above rather than deferred as a question.

Two non-blocking notes worth surfacing for whoever designs the concrete schema next phase, since they are genuine judgment calls this document made on the organisation's behalf rather than facts the evidence dictated outright:

1. **SEASON as its own lightweight entity, rather than a set of dated fields on PLACE.** This document recommends the entity because it cleanly serves both PLACE (Parco's seasonal rhythm) and WORK (a yearly programme instance) without duplication — but a simpler implementation folding season windows directly into PLACE would also work for Parco alone, if the organisation's future needs never extend seasonality to more than one place. Revisit only if that assumption changes.
2. **PARTNERSHIP kept as a genuinely separate entity from PROJECT's own field set**, rather than an embedded partner list on each PROJECT/WORK record. This was chosen so a partner's status (proposed/active/past) can change independently of the project it's scoped to — worth reconfirming once real partner data volume is known, since a very small partner list might not need the independent-status benefit this design buys.

Neither of these blocks schema design, content drafting, or any other next-phase work from proceeding (consistent with Current Public State v1's own "nothing here blocks architecture" framing, §13 of that document).

---

## 26. Implementation implications

Scoped to implications only — no schema, code, or route accompanies this document, and none of the points below commits to a storage model, file format, runtime, validation technology, or content-tooling choice.

- **The model is independent of storage and implementation.** A later technical-architecture phase must choose whatever representation best supports the semantics defined here — thirteen entities, their relationships, their status ladders, their freshness computation, and the invariants in §21. Existing infrastructure may be reused only where it is evaluated on its own merits and found to fit the new system without distorting the model; it is not the default, and this document does not assume it as one, per the owner's greenfield direction.
- **Every invariant in §21 must be enforced mechanically, whatever that later architecture turns out to be** — a PROPOSED PROJECT must be as mechanically blocked from rendering as "current work" as any other invariant requires, regardless of which validation technology ends up doing the blocking.
- **Polymorphic scope/subject references remain conceptual, not a code mandate** (§4) — the requirement is only that a NOTICE/HISTORY ENTRY/ARTICLE/PARTNERSHIP/CONTACT CHANNEL can relate to one of several valid subject types; a later phase may satisfy this with a tagged union, explicit typed relationships, small per-owner join structures, or any other concrete mechanism, chosen on implementation grounds, not because this document named a pattern.
- **The freshness computation (§18) is a genuinely new deterministic behaviour** the eventual implementation must support — evaluating `review_after`/`recheck_rule` against the current date to derive CURRENT/REVIEW_DUE/STALE across several entity types — whatever storage or runtime is ultimately chosen for it.
- No hosting, routing, storage, or infrastructure decision is implied or recommended by this document.

---

## 27. Recommended next phase

**Not concrete schema design yet.** This model has not been stress-tested against real content, and freezing an implementation representation before that happens risks encoding a mistake the model itself hasn't yet been forced to surface.

1. **Real-content instantiation / stress test.** Work through the semantic model conceptually against a small, representative corpus, still without JSON schema, TypeScript, or any code — for example: Via Nazario; Parco 11 Settembre; Via Polese; Cena al Buio (WORK); one Cena al Buio dated EVENT; one possible Cena al Buio SERVICE manifestation; Cultura Verde (PROJECT); SEGNI DI PACE (PROJECT); one current CONTACT CHANNEL; one current ACCESS PROFILE dimension; one temporary access limitation (NOTICE); one historical narrative/editorial item (HISTORY ENTRY or ARTICLE). The purpose is to surface awkward relationships, missing fields, redundant entities, lifecycle mistakes, provenance problems, or duplication pressure this document's own review could not find without real instances to push against. No such records are created in this document.
2. Resolve the two non-blocking notes in §25, and any new ones the stress test in step 1 surfaces, once real content has actually tested them.
3. Only after the model survives that stress test: begin concrete schema design.
4. **The creative/design-system phase may begin once the semantic model is stable — independently of schema/technical-representation work, and not gated behind it.** Per the greenfield sequence, content model and creative direction both precede technical architecture; this document does not choose typography, layout, or visual language, and schema decisions must not be allowed to dictate the creative system any more than the creative system should dictate the schema.
5. Only after schema and creative direction are both drafted: begin evaluating which verified old data (per §24) is worth migrating into the new schema, field by field.

---

*End of Greenfield Content Model v1. This document is a semantic-architecture decision record. It does not implement, schema, or visually design anything, and it does not replace or supersede Working Paper v0.3, Institutional & Public Information Architecture v1, or Current Public State & Implementation Readiness v1.*
