# Analytics Recommendation

## Production audit

The production homepage currently returns through Cloudflare and contains no
GA4, Google Tag Manager, Vercel Speed Insights, or other first-party analytics
bootstrap in the HTML. No analytics change is deployed by this workstream.

## Options

| Capability | Cloudflare Web Analytics | GA4 | Both |
|---|---|---|---|
| Baseline visits/pageviews | Yes, low-maintenance | Yes | Yes |
| Referral/source detail | Limited; no UTM reporting | Strong | Strong |
| Event-page usage | URL/pageview level | URL plus event instrumentation | Both |
| Menu, Maps, WhatsApp, social, booking clicks | No custom events | Yes, with explicit instrumentation | Yes |
| Device/geography | Basic aggregate reporting | Detailed reporting | Detailed reporting |
| Cookies/consent burden | Privacy-oriented and cookie-free; configure EU exclusion if required | Higher legal/configuration burden in Italy/EU | Highest |
| Maintenance | Enable in Cloudflare dashboard; no code required for proxied host | Consent model, tags, event schema, retention and access management | Both burdens |

Cloudflare Web Analytics is the appropriate first baseline because the site is
already proxied, the immediate need is to establish whether people use the
site, and it does not require a browser-side tracking stack or cookie banner.
It does not provide custom click events, so it cannot answer outbound-action
questions by itself.

Recommendation: enable Cloudflare Web Analytics only after explicit owner
approval, with the EU visitor-data setting selected according to the venue's
privacy decision. Defer GA4 and GTM until there is a concrete question such as
which booking or contact action drives visits. If that question becomes
important, add a small documented first-party event vocabulary and a consent
review rather than installing GTM by default. Analytics remains private and is
never serialized into the public content layer.

## Production verification after enablement

After enabling Web Analytics for the proxied `www.altrospazio.org` hostname in
Cloudflare Dashboard > Web Analytics, verify the hostname is listed and that
new pageview data appears after a controlled visit. Also inspect the production
HTML and browser network log: automatic setup may use Cloudflare's managed
injection/beacon path, so do not add a duplicate script to the app. Verify the
Cloudflare-managed beacon or `/cdn-cgi/rum` request, confirm it is not a
first-party GSC request, and keep GSC data in the private report path only.

References: [Cloudflare Web Analytics FAQ](https://developers.cloudflare.com/web-analytics/), [data collection](https://developers.cloudflare.com/web-analytics/data-collection/), and [setup](https://developers.cloudflare.com/web-analytics/get-started/).
