# Meta Integration Feasibility

This is an implementation plan, not an authorization or an active integration.
The official Meta Graph API documentation should be rechecked when credentials
are provisioned because permissions and review rules change.

## Adapter status

The credential-free adapter at `feeders/meta/normalize.mjs` accepts synthetic
Instagram media and Facebook Page post records and emits `public_candidate`
source records. It preserves network, source ID, permalink, timestamp,
caption/text, media metadata, deterministic event/notice signals, provenance,
and fetch time. Candidate records cannot cross the public-data boundary or
become canonical events without deterministic validation and owner approval.

No Meta request, token, webhook, publication call, or profile write has been
implemented.

## Required account and app prerequisites

- Instagram must be a Professional account (Business or Creator) and be linked
  to the Facebook Page used for the integration.
- The integration needs the Instagram professional account ID and Facebook Page
  ID. These are not safely inferred from public profile URLs.
- A Meta app, OAuth authorization by an authorized owner, and server-side token
  storage are required. No token belongs in the repository, browser bundle, or
  chat.
- Reading Instagram media, reading Page content, and publishing to either
  surface are separate capabilities. Request the minimum permissions shown by
  Meta for the selected API version and endpoints. The commonly encountered
  read permissions include `instagram_basic`, `pages_show_list`, and
  `pages_read_engagement`; confirm in the current app dashboard whether Page
  post reads require an additional Page-content permission. Do not request
  `instagram_content_publish` or `pages_manage_posts` for this read-only
  phase.

## Capability boundary

Reading the venue's own Instagram media is feasible through the Instagram
Graph API after the professional-account and Page-link prerequisites are met.
Reading the Page's own posts is feasible through the Pages Graph API with a
Page access token and the current Page read permissions. The exact permission
set and review requirement are version- and endpoint-dependent and must be
confirmed in Meta's current dashboard before authorization. Publishing is out
of scope and must not be enabled merely to read candidate events.

Long-lived user/Page tokens require secure storage, expiry monitoring, and
rotation or reauthorization. The future scheduled job should fail closed when
the token is expired and retain the last valid candidate snapshot. Webhooks can
reduce polling for supported Page/Instagram events, but they are not needed for
the first ingestion and should be added only after a concrete synchronization
requirement exists.

## Owner checklist

1. Confirm the Instagram account type and its linked Facebook Page.
2. Confirm the authorized owner of both assets and provide the account/Page IDs
   through a secret-management channel, not this repository.
3. Create or identify the Meta app and confirm the selected API product/version.
4. Authorize a least-privilege test user and record which read permissions Meta
   grants without review.
5. Decide whether the first integration is read-only; defer publishing scopes.
6. Approve token storage, rotation owner, expiry alert, and failure contact.
7. Approve the rule that imported posts become candidates/drafts and never
   public events without deterministic validation and human approval.

References: [Instagram Graph API](https://developers.facebook.com/docs/instagram-api),
[Instagram content publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing),
[Facebook Graph API](https://developers.facebook.com/docs/graph-api), and
[Graph API access tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/).
