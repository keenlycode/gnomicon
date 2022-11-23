## Features
---

- 1,400+ well designed SVG icons from [Gnome project](https://gitlab.gnome.org/World/design/icon-library/-/tree/master/data/resources/icon-dev-kit)
  and [adwaita-icon-theme](https://gitlab.gnome.org/GNOME/adwaita-icon-theme)
- Icons are modified to work with WebApp Platform, easy to change color or size.

## SVG icon explain
---

**Gnomicon** can be used by codes below. Although 
**it's not recommended**, this is how **SVG Icons** work on browser
without other libraries or dependencies.

```html
<!-- Using from SVG Sprite -->
<svg style="width: 1em; height: 1em;">
    <use xlink:href="/path/to/gnomicon/dist/icon.svg#call-outgoing"></use>
</svg>
```
> You can also use each SVG Icons in `gnomicon/dist/svg/`,  
> Read furthur information about SVG in HTML at
> [Using SVG](https://css-tricks.com/using-svg/),
> [SVG Symbol](https://css-tricks.com/svg-symbol-good-choice-icons/)
> from [CSS Tricks](https://css-tricks.com)

However, this project provides javascript libraries to use icons
as web-components with some setup codes.

## Install
---

```shell
$ npm install gnomicon
```

## Usage
---

We need to import `Icon` and define it to html custom tag.

<el-tag class="title-block bg-red">Important !</el-tag>
> Javascript must be included in html with `<script defer>`

<el-tag class="title-block">javascript <code>\<script defer></code></el-tag>
```js
import { Icon } from 'gnomicon/dist/icon.js';

customElements.define('el-icon', Icon);
Icon.href = "path/to/gnomicon/dist/icon.svg"
```

Then, we can use icon in web-component `<el-icon name="icon-name">`, for example.

<el-tag class="title-block">html</el-tag>
```html
<el-icon name="printer-error"></el-icon>
<el-icon name="dialog-warning"></el-icon>
<el-icon name="appointment-soon"></el-icon>
<el-icon name="battery-level-20"></el-icon>
<el-icon name="call-outgoing"></el-icon>
```

<div style="font-size: 3rem;">
<el-icon name="printer-error"></el-icon>
<el-icon name="dialog-warning"></el-icon>
<el-icon name="appointment-soon"></el-icon>
<el-icon name="battery-level-20"></el-icon>
<el-icon name="call-outgoing"></el-icon>
</div>

### Color

**CSS** `color` property can be used to set icon's color.

```html
<el-icon name="call-outgoing" style="color: #2196F3;"></el-icon>
```
<div style="color: #2196F3; font-size: 3rem;">
    <el-icon name="printer-error"></el-icon>
    <el-icon name="dialog-warning"></el-icon>
    <el-icon name="appointment-soon"></el-icon>
    <el-icon name="battery-level-20"></el-icon>
    <el-icon name="call-outgoing"></el-icon>
</div>

### Scale

**CSS** `font-size` property can be used to scale icons.

```html
<el-icon name="printer-error" style="font-size: 1rem;"></el-icon>
<el-icon name="dialog-warning" style="font-size: 1.5rem;"></el-icon>
<el-icon name="appointment-soon" style="font-size: 2.0rem;"></el-icon>
<el-icon name="battery-level-20" style="font-size: 2.5rem;"></el-icon>
<el-icon name="call-outgoing" style="font-size: 3rem;"></el-icon>
```

<el-icon name="printer-error" style="font-size: 1rem;"></el-icon>
<el-icon name="dialog-warning" style="font-size: 1.5rem;"></el-icon>
<el-icon name="appointment-soon" style="font-size: 2.0rem;"></el-icon>
<el-icon name="battery-level-20" style="font-size: 2.5rem;"></el-icon>
<el-icon name="call-outgoing" style="font-size: 3rem;"></el-icon>

## Use resources from CDN
---

Using resources from NPM CDN doesn't require installation via **npm**.
However, since many **CDN** use **https://**, please note that
webpage have to serve on **https://** otherwise browsers will reject
to load **CDN** resources. (You can check error on browser debug console)

<el-tag class="title-block">js <code>\<script defer></code></el-tag>
```js
import {Icon} from '//unpkg.com/gnomicon@1/dist/icon.js';
customElements.define('el-icon', Icon);

Icon.href = '//unpkg.com/gnomicon@1/dist/icon.svg';
```

## Note
---

Since most web browsers will block external file access,
`icon.svg` should be served on **http://** or **https://**

For unsupport web browser,
<a href="https://github.com/jonathantneal/svg4everybody">svg4everybody</a>
is recommended.

## Optimization options
---

1. Icons in `gnomicon/dist/svg/*.svg` can be uploaded to
   [icomoon.com](https://icomoon.com) to generated `symbol-defs.svg`. This
   file can be use in `Icon.href`

<div style="display: block; margin-bottom: 3rem;"></div>