# Meta Integration Feasibility

This is an implementation plan, not an authorization or an active integration.
No Meta account, app, token, webhook, or profile change has been performed.
Permissions and review rules are version-dependent and must be rechecked in
Meta's dashboard when authorization is actually provisioned.

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

## Asset discovery checklist

These facts are not verified yet and must come from owner-side Meta UI. IDs
must not be inferred from public URLs.

1. In Meta Business Suite, open Settings / Business settings and inspect
   Accounts > Pages. Locate the Page for `laltrospazio.bologna`, record its
   Page ID, the owning/managing Business Portfolio, and whether Jascha has
   full control or only task access.
2. Inspect Accounts > Instagram accounts. Locate `laltrospazio`, record its
   professional-account ID, account type (Business or Creator), linked Page,
   owning/managing Business Portfolio, and Jascha's access level.
3. In Instagram, open Edit profile > Page under Public business information
   and confirm the linked Page. The alternative Facebook path is Page profile
   > Settings & privacy > Settings > Permissions > Linked accounts > Instagram.
4. In Business settings > People, confirm that Jascha's account has full
   control of the relevant Page, Instagram asset, and app/portfolio. Record
   any different owner or administrator as an owner decision, not as an
   engineering assumption.

Meta's own help documentation confirms that the Instagram account must be
Professional to connect to a Page, and that Page access is required to make
the connection. Professional accounts can be Business or Creator.

## API model and permissions

There are two current Instagram API login models:

### Preferred first probe: Facebook Login for Business

This is the practical choice because the target includes both the Facebook
Page and its linked Instagram professional account. It requires a linked
Facebook Page and Professional Instagram account. The initial least-privilege
read request should be validated in the selected API version with:

- `public_profile` as the baseline Facebook Login permission.
- `pages_show_list` to discover the Pages the authorized person can access.
- `pages_read_engagement` for eligible Page content/engagement reads.
- `instagram_basic` for the linked Instagram professional account's basic
  information and media reads through the Facebook Login model.

Do not request `business_management`, `pages_manage_posts`,
`instagram_content_publish`, `instagram_manage_messages`, comment-management,
ads, or messaging permissions. `pages_read_user_content` is not needed for
the first goal of reading the Page's own posts; request it only if a later,
explicit requirement is to read user-generated Page content.

The flow uses a Facebook user access token, then a Page access token for Page
Graph API calls. The token response is handled in memory, with only the
minimum reviewed token material stored in ignored local secret storage. Token
expiry, revocation, and reauthorization are health states, not reasons to
overwrite canonical content.

### Instagram Login: not the first combined probe

Instagram Login uses the newer `instagram_business_basic` scope for
Professional Instagram accounts and does not require a linked Facebook Page.
It is appropriate for an Instagram-only connector, but it does not replace
the separate Facebook Login/Page token path needed to read Facebook Page
posts. The older Instagram Login scope names were deprecated; do not use the
old `business_basic` spelling. Do not combine both login models until a real
capability requires it.

Access level is distinct from OAuth scope. App/admin roles can test during
development when the account and assets are assigned to the app. For a
first-party app serving only assets the owner controls, Meta's current model
may allow Standard Access once the assets are added; Advanced Access/App Review
is relevant if the app serves assets outside the app owner's control or the
dashboard requires review for the selected permission. Confirm the actual
status per permission in App Dashboard before production use.

## App strategy

No suitable existing project-owned Meta app has been identified. If the owner
checklist finds none, create a dedicated first-party Business app named
`L'Altro Spazio Digital System` under the owning Business Portfolio. Do not
reuse a personal, agency, or unrelated app. Add only Facebook Login for
Business for the first read-only probe, configure the local callback when
engineering supplies it, and leave all publishing/products disabled.

Owner app steps:

1. Open Meta for Developers > My Apps and verify whether an existing app is
   clearly owned by L'Altro Spazio.
2. If none exists, choose Create App > Business, use the dedicated name, and
   select the owning Business Portfolio.
3. Add/configure Facebook Login for Business and add the owner/developer as an
   app role. Do not request publication, ads, messaging, or comment scopes.
4. Keep the app in Development mode until the read-only probe is proven.
   Enable Live mode or request review only after a concrete production need.

## Read-only first probe

After owner confirmation and app authorization, the first connector should:

1. Obtain a user token with the selected read scopes.
2. Discover Pages and match the owner-confirmed Page ID; do not match only by
   display name or public URL.
3. Retrieve the linked Instagram professional-account ID and verify account
   type/linkage.
4. Read the Page's own post records and the Instagram media edge with only
   IDs, timestamps, captions/messages, permalinks, media type, and permitted
   media URLs.
5. Normalize into the existing Meta source-record shape and write an ignored
   private/candidate snapshot. Never write Page/Instagram content or tokens
   back to Meta.

The first output is a source inventory. It must not classify every post as an
event, and no record can become a published notice/event without the existing
candidate validation and owner-approval workflow.

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
