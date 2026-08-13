# Vercel / Worker Preview Parity Audit: 2026-08-13

## Scope

- Vercel production: `https://www.altrospazio.org/`
- Cloudflare preview: `https://preview-gptengineer-removal-laltrospazio-digital.dev-c05.workers.dev/`
- Worker version under test: `00e07aba-5bab-4992-a9f4-f334d78d3f97`
- Production DNS, `www`, Vercel hosting, and Worker promotion were not changed.

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Desktop visual rendering | pass | Accessibility snapshots matched at 1200px viewport and 4213px document height. Full-page screenshots captured for both. |
| Mobile/responsive rendering | pass with existing baseline overflow | At 390x844 both pages matched at 6714px document height and the same section geometry. Both report 391px document width against a 390px viewport; this is not preview-only. |
| Page images | pass | All four rendered images loaded with `complete=true`, natural dimensions matched, and all public image files returned HTTP 200 from both hosts. |
| Static assets / PDF | pass | `menu-gruppo-nazario.pdf`, favicon, OG image, and public image assets returned HTTP 200 with expected media types. Vercel and preview PDF/OG bytes differ because production is from the old repository. |
| `robots.txt` | preview pass, production missing | Preview returned HTTP 200 and the committed contents. Vercel returned HTTP 404. |
| `sitemap.xml` | preview pass, production missing | Preview returned HTTP 200 XML and the committed contents. Vercel returned HTTP 404. |
| SPA direct route | preview pass, production fail | Preview `/direct-test` returned the app with HTTP 200. Vercel `/direct-test` returned `404: NOT_FOUND`. |
| External links | pass | DOM hrefs match intended Facebook, Instagram, and TripAdvisor targets. Buttons remain WhatsApp and Maps actions from the same application code. |
| WhatsApp | pass | `wa.me` returned 302 to `api.whatsapp.com`, then HTTP 200. |
| Maps | pass | `maps.app.goo.gl` returned 302 to the L'Altro Spazio Google Maps place, then HTTP 200. |
| Instagram | pass | HTTP 200. |
| Facebook | pass | HTTP 200. |
| TripAdvisor | limited pass | The URL is present and reachable, but TripAdvisor returned HTTP 403 to the automated probe, consistent with bot protection; page validity cannot be content-verified here. |
| Keyboard navigation | pass | Both versions followed the same focus sequence: Instagram buttons, WhatsApp, Maps, Facebook, Instagram, TripAdvisor. |
| Accessibility structure | pass for parity | Both versions expose the same headings, button/link controls, and zero images missing `alt`. This is a parity result, not a full accessibility certification. |
| Production console | pass | Zero console errors after a fresh production navigation. |
| Preview console | fail | Two errors from the same external font request: Playfair Display font URL returned HTTP 404, followed by `Unexpected token '<'`. |
| Network failures | preview fail, otherwise pass | Page assets, scripts, fonts CSS, images, and Speed Insights loaded. The preview's Playfair font request is the material failure. Vercel loaded its alternate Playfair font URL successfully. |
| Metadata | expected source difference | Preview has `lang="it"`, description, robots, Open Graph metadata, and canonical URL. Vercel has `lang="en"`, older description, no canonical, and no robots metadata. |
| Response headers | expected hosting difference | Vercel identifies as `server: Vercel` with `x-vercel-cache`; preview identifies as `server: cloudflare`, `cf-cache-status: HIT`, and `x-robots-tag: noindex`. Both return cacheable 200 responses for the homepage. |

## GPT Engineer removal

- Vercel production includes `https://cdn.gpteng.co/gptengineer.js` in the DOM
  and loaded it with HTTP 200.
- Cloudflare preview has no `gptengineer.js` script in the DOM and made no
  request to that origin.
- The page structure, rendered geometry, image loading, links, keyboard focus
  order, and responsive dimensions matched between versions.
- No functional or visual regression was observed that is attributable to
  removing the script.
- The preview font 404 is a separate external font/hosting issue and must be
  resolved before promotion; it is not evidence that script removal caused a
  site regression.

## Decision

The Worker preview is functionally comparable for the tested site behavior, but
is not promotion-ready because of the preview-only Playfair font failure. The
missing production `robots.txt`, `sitemap.xml`, and direct-route fallback are
existing Vercel-origin differences that the Worker improves; they should not be
fixed by changing production DNS during this audit.

Dependency findings and staged remediation recommendations remain in
`docs/project/dependency-audit-2026-08-13.md`. No dependency fix was applied.
