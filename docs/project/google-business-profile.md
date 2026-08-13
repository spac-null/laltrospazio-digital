# Google Business Profile Connector

The connector boundary is implemented at
`feeders/google-business-profile/normalize.mjs`. It accepts a Business
Information API-shaped location object and emits normalized facts with field-
level provenance. No live response, credential, token, or location identifier
is stored in this repository.

## API surface

The current Business Information API location resource exposes `name` as the
`locations/{locationId}` identifier, `title`, `storefrontAddress`,
`phoneNumbers`, `websiteUri`, `regularHours`, `specialHours`, `openInfo`,
`latlng`, `categories`, `profile`, and metadata. Google-updated data is handled
as a separate comparison field when returned by the corresponding API method.
Attributes are retrieved separately with `locations.getAttributes` and remain
owner-confirmation-gated. Google-updated location data is retrieved separately
with `locations.getGoogleUpdated`; both are GET-only calls.

Discovery is two-step:

1. `GET https://mybusinessaccountmanagement.googleapis.com/v1/accounts`
   discovers accounts accessible to the OAuth user.
2. `GET https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{accountId}/locations`
   lists accessible locations with a required `readMask`, pagination, and the
   `business.manage` scope.

The adapter must select the L'Altro Spazio location by verified identity, not
by assuming the first returned record. A future fetcher should then call the
location read endpoint, and the attributes / Google-updated methods only when
needed. It should record `fetched_at`, external update metadata when available,
and feeder health for every attempt.

## Owner setup checklist

These are the only actions Jascha needs to perform in Google UI for the first
read-only proof:

1. Sign in to the Google account that currently owns or manages the L'Altro
   Spazio Business Profile and confirm it can open the location in Business
   Profile Manager.
2. When the connector OAuth link is ready, authorize the requested
   `business.manage` read access with that account.
3. If Google shows more than one account or location, select the L'Altro Spazio
   profile at Via Nazario Sauro 24/F and confirm that selection.
4. Report only whether the authorization succeeded and which location was
   selected. Do not send passwords, client secrets, or refresh tokens in chat
   or commit them to the repository.

The developer/operator must separately create the Google Cloud project, request
GBP API access, enable the approved Business Profile APIs, configure OAuth
consent and an OAuth client, implement token storage, and run the read-only
discovery. Google documents that project approval precedes API visibility and
that protected requests require OAuth; there is no GBP sandbox.

## Exact engineering setup

1. Create a dedicated Google Cloud project named `L'Altro Spazio Digital`.
2. In the GBP API access request form, submit the application text below and
   wait for approval. If an enabled API reports quota 0, approval is still
   incomplete.
3. After approval, enable the Business Profile APIs needed for this probe:
   My Business Account Management API and My Business Business Information API.
   The current Google setup page may expose the broader associated API set; do
   not enable write-oriented integrations beyond the APIs required for this
   read-only probe.
4. Configure the OAuth consent screen as an external application with the
   project identity, support contact, developer contact, and the exact
   `business.manage` scope. Add the localhost loopback redirect URI used by the
   command: `http://127.0.0.1:8787/oauth2callback`.
5. Create an OAuth client for a web application with the exact loopback
   redirect URI above, and place its client ID/secret only in
   `.env.gbp.local`. The local command uses authorization-code exchange with
   PKCE; `GOOGLE_CLIENT_SECRET` remains local configuration and is never
   committed.
6. Run `npm run gbp:authorize`; the browser authorization code flow uses
   `business.manage`, offline access, state, and PKCE. The refresh token is
   written only to ignored `.local/gbp-refresh-token.json`.
7. Run `npm run gbp:probe`. It performs account discovery, location listing,
   location selection, read-only location/attribute/Google-updated GETs,
   normalization, and discrepancy reporting. It never writes Google data.

The local OAuth command stores the refresh token in an ignored file only for
the proof. A later Worker deployment should use `GOOGLE_CLIENT_ID` as ordinary
configuration and `GOOGLE_CLIENT_SECRET` plus `GOOGLE_REFRESH_TOKEN` as Worker
secrets. Adding those secrets is a deployment change and requires explicit
approval; this phase adds none.

## Suggested GBP API access application text

> L'Altro Spazio operates its own Google Business Profile for its Bologna
> venue. We are building a first-party website and need programmatic read
> access to our own location data so the website team can synchronize and
> verify regular hours, special hours, address, phone, coordinates, open status,
> and selected profile attributes. The integration will use OAuth on behalf of
> the account owner, will access only the owned/managed venue, and will use the
> `business.manage` scope. This is not a third-party profile management
> platform, agency, multi-customer service, or bulk listing tool. The first
> implementation is strictly read-only: it contains no location updates,
> attribute updates, posts, review replies, or other mutation calls. Retrieved
> data will be normalized, compared with our canonical website record, and sent
> for owner review when discrepancies occur; it will not automatically overwrite
> either Google or the website.

## Security and lifecycle

Store the OAuth client secret and refresh token only in a server-side secret
store. Never expose them to the browser or static build. Token expiry,
revocation, 401/403 responses, pagination, and zero-location responses become
feeder health states. Until authenticated access exists, the connector is
testable only with synthetic API-shaped fixtures.

## Future synchronization

`GBP response -> normalized fields -> authority resolution -> discrepancy or
candidate -> reviewed canonical snapshot` is compatible with a later scheduled
Worker. No Cron, KV, D1, or dashboard is added now. Persistence will be chosen
after the first authenticated fetch establishes the actual refresh cadence and
conflict volume.

References: [Basic setup](https://developers.google.com/my-business/content/basic-setup),
[GBP API FAQ](https://developers.google.com/my-business/content/faq),
[accounts.list](https://developers.google.com/my-business/reference/accountmanagement/rest/v1/accounts/list),
[accounts.locations.list](https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations/list),
and [Location resource](https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations).
