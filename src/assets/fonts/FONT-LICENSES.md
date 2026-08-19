# Self-hosted fonts — provenance and licences

These webfonts were self-hosted on **19 August 2026** to remove the site's only runtime
third-party request. Previously the stylesheet fetched them from Google's font CDN on every page
load, which disclosed each visitor's IP address, User-Agent, referring page and language setting to
a third party before the visitor interacted with anything.

**Typography is unchanged.** Same three families, same styles, same weights. Nothing about the
frozen Frontend System V1 type design was altered — only where the files come from.

## Families

| Family | Used for | Styles / weights shipped | Google Fonts version |
|---|---|---|---|
| **Fraunces** | display / headings (`font-display`) | normal 400, 500, 600 · italic 500 | v38 |
| **Inter** | body text (`font-sans`) | normal 400, 500, 600 | v20 |
| **IBM Plex Mono** | small caps labels, "stamp" (`font-mono`) | normal 400, 500 | v20 |

All three are licensed under the **SIL Open Font License 1.1**, which explicitly permits
redistribution and self-hosting. Full licence texts are in `licenses/`:

| Family | Copyright | Licence file |
|---|---|---|
| Fraunces | Copyright 2018 The Fraunces Project Authors — https://github.com/undercasetype/Fraunces | `licenses/Fraunces-OFL.txt` |
| Inter | Copyright (c) 2016 The Inter Project Authors — https://github.com/rsms/inter | `licenses/Inter-OFL.txt` |
| IBM Plex Mono | Copyright © 2017 IBM Corp. with Reserved Font Name "Plex" | `licenses/IBM-Plex-Mono-OFL.txt` |

## What is in this directory

10 `.woff2` files, 392 KB total. Fewer files than there are `@font-face` blocks, for two reasons:

- **Fraunces is a variable font.** One normal-style file covers weights 400, 500 and 600, so three
  `@font-face` blocks point at the same file. Optical sizing (`opsz`) is applied automatically by
  the browser from the font size, exactly as it was when served by Google.
- **IBM Plex Mono is a static font**, so weights 400 and 500 are genuinely separate files — hence
  the `-400` / `-500` suffixes.

Only the **latin** and **latin-ext** subsets are shipped. The site is Italian and English; the
Cyrillic, Greek and Vietnamese subsets Google also offers were deliberately not downloaded. Each
block keeps its original `unicode-range`, so browsers still download only the subset they need.

## How the CSS was produced

`src/styles/fonts.css` is the Google Fonts CSS API response for the **exact same** family / style /
weight request the site used before, with only the `src:` URLs rewritten to these local files.
`font-style`, `font-weight`, `font-display: swap` and `unicode-range` are preserved verbatim, so
metrics and loading behaviour are identical.

To regenerate (e.g. to add a weight or subset):

1. Request the CSS from the Google Fonts CSS API with a modern-browser User-Agent, so it returns
   `woff2`. The request the site used was:
   `css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap`
2. Keep the `latin` and `latin-ext` blocks.
3. Download each unique font URL into this directory.
4. Rewrite each `src:` URL to `../assets/fonts/<file>` and leave every other declaration untouched.

No npm dependency is involved, and `package.json` / `package-lock.json` were not modified.

## Verifying

After a build, the production CSS must contain **no** reference to Google's font hosts, and the
built stylesheet should carry the `@font-face` blocks inline with hashed local font URLs. Load a
page and confirm in the browser's network panel that the only font requests go to the site's own
origin, and that headings render in Fraunces rather than a fallback serif.
