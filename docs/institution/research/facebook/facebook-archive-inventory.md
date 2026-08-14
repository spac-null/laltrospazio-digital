# Facebook Archive Inventory

**Working date:** 14 August 2026
**Archive file:** `facebook-laltrospaziobologna-15_Feb_2014-3_Jan_2026.zip` (484,021,119 bytes, 3,655 files)
**Purpose:** Methodology and structural inventory supporting the four other research outputs in this folder. This is not an analysis of content — see `facebook-archive-chronology.md`, `programme-history.md`, `concept-language-evolution.md` and `facebook-historical-evidence-register.md` for findings.

---

## 1. What this archive actually is

The zip is a **Meta "Download Your Information" export of the Facebook *profile*** registered under the name **"L'Altro Spazio"** (username `laltrospazio.bologna`, profile URI `facebook.com/laltrospazio.bologna`). Cross-checking `profile_information/profile_information/profile_information.json`:

- `full_name`: "L'Altro Spazio"
- `registration_timestamp`: 1392502305 → **15 February 2014** (matches the zip filename's start date exactly)
- `address`: Via Nazario Sauro 24F, Bologna, 40121
- `website`: `http://www.altrospazio.org/`
- `profile_category`: "Social club"
- `about_me`: an Italian paragraph naming Nunzia Vannuccini (president of Associazione Farm) and Jascha Blume ("artista e imprenditore sociale olandese") as co-originators, and using explicit accessibility/disability-dismantling language.

This confirms the archive is the organisation's own long-running public-facing account (an old-style Facebook "profile," not a modern "Page" — Meta's export format for the two differs, and this account carries `pages/admin_activity.json`, `pages/pages.json` etc., indicating the profile also administers at least one Facebook Page, though the profile itself is the primary object exported here). **It is a contemporary public organisational self-record**, consistent with the brief's framing, not a private individual's mixed personal/institutional account — the "about me," registration date, and address all point directly at the institution.

## 2. Structure of the export

Top-level folders actually present (after excluding Messenger data — see §4):

```
connections/
  followers/                         — who followed/was followed (not analysed, low value)
  friends/                           — your_post_audiences.json (not analysed)
profile_information/
  profile_information/               — profile_information.json, profile_update_history.json,
                                        websites.json, contact_info.json, contacts_sync_settings.json,
                                        predicted_languages.json, your_devices.json, your_services.json
this_profile's_activity_across_facebook/
  posts/                              — profile_posts_1.json (930 posts), album/ (7 albums),
                                        edits_you_made_to_posts.json, videos.json,
                                        uncategorized_photos.json, content_sharing_links_you_have_created.json,
                                        places_you_have_been_tagged_in.json, video_collaboration_events.json,
                                        facebook_editor.json, media/ (binary photo/video files)
  events/                             — events.json, events_you_hosted.json (200 records),
                                        event_invitations.json, event_responses.json,
                                        your_event_invitation_links.json
  comments_and_reactions/             — comments.json, likes_and_reactions_1/2.json (not deep-analysed)
  pages/                              — pages.json (page likes), admin_activity.json, sent_page_invites.json,
                                        pages_you_are_a_customer_of.json
  activity_you're_tagged_in/          — photos_and_videos_you're_tagged_in.json
  groups/, facebook_gaming/, fundraisers/, navigation_bar/, reels/,
  saved_items_and_collections/, your_places/                — low-value, not analysed (see §5)
```

## 3. Core inventory numbers

| Metric | Value | Source |
|---|---|---|
| Total profile posts | **930** | `posts/profile_posts_1.json` |
| Post date range | **15 Feb 2014, 23:53 → 18 Dec 2025, 21:52** (Europe/Rome) | min/max of post timestamps |
| Hosted "Event" records | **200** | `events/events_you_hosted.json` |
| Hosted-event date range | **9 Jun 2021 → 25 Oct 2025** | min/max of event-record timestamps — see §6, important caveat |
| Albums | **7** (Cover photos, Foto di Instagram, Inaugurazione stagione 2018/2019, L'Altro Spazio compie 2 anni, Mobile uploads, Photos, Profile pictures) | `posts/album/0-6.json` |
| Posts edited by the account (`edits_you_made_to_posts.json`) | 45 (final text only, no before/after diff — see §5) | |
| Account registration | 15 Feb 2014 | `profile_information.json` |

**Posts per year:**

| Year | Posts | Year | Posts |
|---|---|---|---|
| 2014 | 38 | 2020 | 18 |
| 2015 | 74 | 2021 | 6 |
| 2016 | 185 | 2022 | 48 |
| 2017 | 132 | 2023 | 150 |
| 2018 | 90 | 2024 | 122 |
| 2019 | 29 | 2025 | 38 |

**Hosted events per year:** 2021: 25 · 2022: 35 · 2023: 50 · 2024: 67 · 2025: 23 (none before 2021 — see §6).

This reconciles with, and confirms, the "safe inventory" figures already cited in Working Paper v0.2 §17.1 (930 profile-post records; 200 hosted-event records; Feb 2014–Dec 2025 range).

## 4. Privacy exclusion applied

The zip's `this_profile's_activity_across_facebook/messages/` folder (2,280 files, ~319 MB, private Messenger conversation data) was **excluded at unzip time** (`unzip -x "*messages*"`) and was never extracted to disk or read. This is a stronger control than "ignore if encountered" — the private-message content was never present in the working copy used for this analysis. No other private-content categories (financial, credential, personal-contact) are present in this export; it is a public-activity export only.

## 5. What was extracted vs. excluded, and why

**Extracted and analysed in depth:**
- All 930 posts (`profile_posts_1.json`) — normalised to `extracted/posts.jsonl` and one Markdown file per year (`extracted/posts_by_year/YYYY.md`), Europe/Rome timestamps, post type, full text, tagged places/events, external links.
- All 200 hosted-event records — title, creation timestamp, status (`extracted/events.md`). **Important limitation:** these records store only the *timestamp at which the Facebook Event object was created/last touched* and a workflow status ("Started"/labels like "Add location: Not completed"), not a verified event date or venue in most cases. They are weak, low-detail metadata — useful mainly as a rough activity-density signal (see §6), not as a programme calendar. The actual event content (what happened, when, where) is far better evidenced by the 930 posts themselves, which is why this analysis is post-centric.
- All 7 albums — name, photo count, date range, and any photo captions present (`extracted/albums.md`). Two are directly historically significant: "L'Altro Spazio compie 2 anni" (photos dated 6 Nov 2017, corroborating an Oct/Nov 2015 opening) and "Inaugurazione stagione 2018/2019" (14 Nov 2018).
- `profile_update_history.json` (profile picture/bio changes over time — used to corroborate the Oct 2015 opening) and `websites.json`/`contact_info.json` (confirms Via Nazario Sauro 24F as the registered address from at least 2022 onward).

**Extracted but found low-value, not deep-analysed:**
- `edits_you_made_to_posts.json` (45 records) — Meta only exports the **final** text of an edited post, not a before/after diff. This means it cannot be used to trace *how* wording changed over time, only *that* 45 specific posts were edited at some point. Not useful for the concept/language-evolution analysis beyond confirming the edited posts' final wording matches what's already in the main post corpus.
- `content_sharing_links_you_have_created.json`, `places_you_have_been_tagged_in.json` (near-entirely "Bologna, Italy," no finer detail), `uncategorized_photos.json` (timestamps only, no captions), `cities_you_have_checked_into.json` (single entry, "Bologna, Italy"), `video_collaboration_events.json` (one entry, a 2023 reopening video already captured via the main post corpus).
- `connections/`, `groups/`, `facebook_gaming/`, `fundraisers/`, `navigation_bar/`, `reels/`, `saved_items_and_collections/`, `comments_and_reactions/` — these describe the account's own consumption behaviour (who it followed, what it liked, saved items) rather than its public self-presentation, and were judged out of scope for an institutional-history reconstruction. `comments_and_reactions/comments.json` in particular could contain public comments made by the account on *other* pages, which was excluded as not being the account's own announced activity and a lower-priority use of research effort.

## 6. Methodology notes and known limitations

1. **Timezone:** all timestamps converted to Europe/Rome using Python's `zoneinfo`, per the brief.
2. **Text encoding:** the export's JSON stores non-ASCII text as UTF-8 bytes re-escaped through Latin-1 (a known Meta export quirk). All extraction re-decoded every string (`str.encode('latin1').decode('utf-8')`) before analysis; this was verified against known Italian accented characters and emoji in sample posts.
3. **First-mention ≠ start date.** Per the brief's explicit instruction and Working Paper v0.2 C049 (INVALID INFERENCE), no programme's first Facebook appearance is treated as its actual origin. Where the archive's first mention of a practice is likely a continuation of something already running as of the first FB post (e.g. Cineporto, Parco 11 Settembre, Associazione Farm's prior projects), this is flagged explicitly in `programme-history.md`.
4. **Posting-frequency is not an operational proxy on its own.** The sparse 2021 (6 posts) and 2020 (18 posts) years reflect at minimum reduced *social-media* activity; whether they also reflect reduced *operational* activity is separately assessed per year using corroborating signal (press mentions, event continuity, album dates) — see `facebook-archive-chronology.md`.
5. **Hosted-event records are structurally thin and post-2021 only** (§5); no inference is drawn from the *absence* of pre-2021 hosted-event records about the absence of pre-2021 events — Facebook's own "Events" feature and this account's habit of using it simply post-date 2021.
6. **This archive cannot establish legal-entity identity.** Per the brief and Working Paper v0.2's own methodology, Facebook branding is treated as evidence of public self-presentation only. Legal/corporate facts (SRL vs. cooperative vs. Associazione Farm) are never asserted from FB content alone; where FB evidence touches on this (it does so only once — see `facebook-historical-evidence-register.md`), it is explicitly flagged as independent corroboration of a claim already documented elsewhere, not as a freestanding legal fact.
7. **No web search or external verification was performed** during this pass, per the brief's instruction to defer external verification to a follow-up unless a specific item strictly required it. None was judged to strictly require it. Open external-verification leads are listed in each output file's follow-up sections.

## 7. Processing pipeline (for reproducibility)

1. `unzip -x "*messages*"` → extracted archive (159 MB) into an isolated scratch directory outside the git worktree and outside the source Documents folder.
2. A Python script (`extract.py`) parsed and Latin-1/UTF-8-corrected every relevant JSON file, producing:
   - `extracted/posts.jsonl` (one JSON object per post) and `extracted/posts_by_year/YYYY.md` (human-readable, chronological within year)
   - `extracted/events.md`, `extracted/events.jsonl`
   - `extracted/albums.md`
   - `extracted/summary.json` (the counts in §3)
3. Each year (or year-pair, matched to natural chronological breakpoints) was read in full and logged into `extracted/chunk_notes/*.md`, tagging evidence by class (FB-A/B/C/D/E, defined in the historical evidence register) against the six analytical phases requested (year summary, programme lifecycle, concept/language, organisational transitions, contradictions, propositions).
4. The five other output files in this folder synthesise across all `chunk_notes` files.

All raw extraction outputs and per-year notes remain available in the session's working directory for follow-up verification; they are not committed to the repository (large, and derived from a source archive that itself must not be committed — see the accompanying commit for what is and is not included).
