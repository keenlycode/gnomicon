# Gnomicon

GNOME symbolic icons for the web: **1,585 static SVGs**, available as ESM imports
or individual files. Version **51.0.0** follows GNOME 51, using Adwaita 51.0 and
an independently pinned Icon Development Kit snapshot. See `upstream.json` for
exact revisions and `dist/icons.json` for each icon's provenance and export name.

> **Licensing:** JSR's primary `CC-BY-SA-4.0` label covers Gnomicon
> contributions only, not all bundled artwork. Adwaita icons retain
> **CC BY-SA 3.0 US**; Icon Development Kit icons remain **CC0 1.0**.
> See `LICENSE.md` in the package (`license.md` in this repository), the upstream
> license texts, and the per-icon manifest for the applicable terms.

## Use with npm

Version **51.0.0** is published on npm.

```sh
npm install gnomicon@51.0.0
```

```js
import { folder, printer } from 'gnomicon';
// Or avoid importing the complete export graph:
import { svg } from 'gnomicon/icons/folder';

document.querySelector('.icon').innerHTML = folder;
```

```html
<span class="icon" aria-hidden="true"></span>
```

```css
.icon { color: royalblue; display: inline-flex; }
.icon svg { width: 1.5em; height: 1.5em; }
```

The values are trusted, static SVG strings, not web components. Only insert SVG
from trusted sources. Add an accessible label to the surrounding control, or use
`role="img"` and an accessible name for an informative standalone icon.

The root entry point re-exports every icon. A tree-shaking bundler can remove
unused exports; direct per-icon entry points avoid traversing the whole graph.
Use `icons.json` to look up export names: for example, `drive-wrench` is
`driveWrench`, while reserved words and punctuation receive safe identifiers.
The manifest's `importPath` is the exact per-icon subpath for both registries.
JSR restricts export paths to ASCII: unusual filename characters are encoded
there (for example `□-button` uses `icons/u25a1--button`), while the original icon
name and standalone SVG filename remain unchanged.

For plain HTML, individual SVG files remain available under `dist/svg/` (or the
package `gnomicon/svg/` asset export). An SVG loaded through `<img>` **does not**
inherit the surrounding page's `color`; use inline SVG for recoloring.

## JSR

The same build produces TypeScript modules under `dist/jsr/` for
`@devcapsule/gnomicon`. Version **51.0.0** is published on JSR. Use a
JSR-compatible runtime or bundler (not a raw browser script):

```ts
import { folder, printer } from 'jsr:@devcapsule/gnomicon@51.0.0';
import { svg } from 'jsr:@devcapsule/gnomicon@51.0.0/icons/folder';
```

npm and JSR share the same version, names, SVG data, source revisions and
upstream licenses.

## Color, size and animation

Foreground fills and strokes use `currentColor`; `fill="none"`, masks, clipping,
transforms and opacity are preserved. Symbolic semantic colors can be overridden
with `--gnomicon-success`, `--gnomicon-warning`, `--gnomicon-error` and
`--gnomicon-accent`; they default to `currentColor`.

Grappa artwork is converted to its **upstream initial state** at the original
stroke weight. GTK state transitions, animation timing, weight interpolation and
mask-based foreground-alpha compositing are not emulated. Consumers can animate
the inline SVG with CSS, the Web Animations API or SVG animation elements. No
animation runtime is bundled. Internal path IDs are not a stable public API.

## Breaking changes in 51.0.0

- **No combined sprite or `icon.svg`**; use imports or individual SVG files.
- Only icons present in the pinned current upstream sets are included. Old names
  are not retained as compatibility aliases.
- `-symbolic` and RTL filename spellings are normalized consistently.
- Icon Dev Kit takes precedence for shared names. Within Adwaita, prefer
  non-legacy paths, then canonical `-symbolic-rtl` spelling. Every omitted
  collision is recorded in `dist/collisions.json`.

## Develop

Python builds icons; Deno is used for the documentation site, not SVG conversion.

```sh
python -m venv venv
. venv/bin/activate
pip install -r require.pip

# Explicit network operation; replaces imported sources with pinned revisions.
python scripts/sync.py

# Offline: verify source hashes, convert and optimize, generate npm/JSR outputs.
python scripts/build.py
python -m unittest discover -s tests

# Docs: requires Deno 2.7+ with deno bundle support.
cd docs-src
deno task build
deno task check
deno task test
deno task dev
```

The docs preview binds to `http://127.0.0.1:8000`. Source changes require rebuilding
and reloading. Docs use Adaptive UI web components, Adapter CSS-in-JS and local
Arrow state. The vendored UI runtime and its release-license caveat are described
in `docs-src/vendor/README.md`.

A sync can reuse clean local clones without network access:

```sh
python scripts/sync.py \
  --checkout icon-dev-kit=/path/to/icon-development-kit \
  --checkout adwaita=/path/to/adwaita-icon-theme
```

Each clone must be at its exact configured commit. Imported artwork is preserved
unchanged under `src/icons/`; `src/inventory.json` verifies its bytes. Adjusting
`upstream.json` requires re-syncing. Updates replace the source inventory rather
than accumulating old icons.

Generated `dist/` and `docs/` are disposable and ignored by Git. Builders replace
only their marked output directories. npm `prepack` rebuilds the distribution and
requires the Python environment above. Check packaging without publishing:

```sh
npm pack --dry-run
(cd dist/jsr && deno publish --dry-run --allow-dirty)
```

The JSR scope must be owned by the publisher. A dry-run is not a registry
publication or proof that a scope/package is available.

## Sources and licensing

- [Icon Development Kit](https://gitlab.gnome.org/Teams/Design/icon-development-kit):
  CC0 1.0.
- [Adwaita Icon Theme](https://gitlab.gnome.org/GNOME/adwaita-icon-theme): upstream
  offers LGPL v3 or CC BY-SA 3.0 US; this distribution uses the latter option.

Artwork attribution: **GNOME Project**, <https://www.gnome.org/>. License texts
ship in `licenses/` and generated packages. See `license.md` for the distinction
between upstream artwork and Gnomicon contributions. No package has been published
as part of this source update.
