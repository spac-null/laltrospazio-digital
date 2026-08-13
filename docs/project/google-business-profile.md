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
Attributes are an optional feeder field and remain owner-confirmation-gated.

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
