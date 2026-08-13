# Google Places Watchdog

Google Places is a comparison and public-verification source, not the
canonical venue store. Keep the stable Place ID, but do not create a permanent
mirror of Place Details fields without checking the current Google Maps
Platform terms and attribution requirements.

Future comparison flow:

`canonical GBP/venue value vs public Places value -> discrepancy -> owner review`

Address, phone, coordinates, title, open state, and public hours can produce
discrepancies. A Places discrepancy must never overwrite the canonical venue
record or create an owner-confirmed claim. Places API responses also require
the applicable Google attribution, Terms of Use, Privacy Policy, and caching
compliance. Place IDs themselves are the deliberate durable identifier.

References: [Place IDs](https://developers.google.com/maps/documentation/places/web-service/place-id)
and [Places policies](https://developers.google.com/maps/documentation/places/web-service/policies).
