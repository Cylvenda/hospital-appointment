# Tanzania administrative locations

The frontend owns the region, district, and ward lists in this directory. The
application does not request this reference data from the backend.

Coverage:

- 31 regions (Tanzania Mainland and Zanzibar)
- 168 postal districts
- 4,054 wards

The counts above were verified directly from the bundled JSON files. The files
were extracted from `tz-locations` version 1.0.2 by Mwema Noor, an MIT-licensed
offline Tanzania location dataset:

- https://www.npmjs.com/package/tz-locations
- https://github.com/mwemanoor/tz-locations

Only regions, districts, and wards are included. Street data was intentionally
excluded to keep the frontend payload smaller.
