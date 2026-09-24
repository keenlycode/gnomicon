# Documentation UI runtime notices

`adaptive-ui.js` is a browser bundle used only by the Gnomicon documentation
site. It is not included in the npm or JSR icon packages. The vendored file
(SHA-256 `71546e5dae6eba3caf8d889d72912a4b4ddcdbc0c0c97807815f69ee0aa9ac3c`)
was supplied as a local Adaptive UI build on 2026-09-24. Its original source
is maintained by the owner's Adaptive UI skill; that source was not changed
for this release. The source manifest and lockfile identify the
following dependencies. These bundled components retain their own licenses:

| Component | Version | License and notice |
| --- | --- | --- |
| Adaptive UI original code | local source | MIT, Copyright (c) 2026 Nitipit Nontasuwan; [full notice](./licenses/adaptive-ui.MIT.txt) |
| Arrow (`@arrow-js/core`) | 1.0.6 | MIT, [full notice](./licenses/arrow-js-core-1.0.6.LICENSE.txt) |
| Adapter (`@devcapsule/adapter`) | 4.0.0 | ISC, [full notice](./licenses/devcapsule-adapter-4.0.0.LICENSE.md) |
| Edictor (`edictor`) | 0.4.0 | ISC, [full notice](./licenses/edictor-0.4.0.LICENSE.md) |

The dependency notices above are copied from the locally cached packages at
the versions in the Adaptive UI source manifest and lockfile. The original-code
MIT notice uses the copyright holder and year confirmed by the owner for this
release. MIT for original Adaptive UI code does **not** relicense Arrow,
Adapter, Edictor, the icon artwork, or Gnomicon contributions. Icon artwork
has separate upstream licenses in `lib/gnomicon/licenses/`.
