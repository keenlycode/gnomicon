## Features
---

- 1,500+ well designed SVG icons from [Gnome project](https://gitlab.gnome.org/World/design/icon-library/-/tree/master/data/resources/icon-dev-kit)
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

## Usage with DefIcon
---
[**DefIcon**](https://keenlycode.github.io/deficon/) is the project which bring SVG definitions to icon component
for webapp. You can read more information at thier website.

<el-tag class="title-block">javascript</el-tag>
```js
import { DefIcon } from 'https://cdn.jsdelivr.net/npm/@devcapsule/deficon@2.0.2/+esm';
class Icon extends DefIcon({url: 'path/to/gnomicon/dist/icon.svg'}) {};
customElements.define('el-icon', Icon);
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

Use style `color` property can be used to set icon's color.

<el-tag class="title-block">html</el-tag>

```html
<!-- Use style "fill" to change icon color -->
<el-icon name="call-outgoing" style="fill: #2196F3;"></el-icon>

<!-- Or if you want to inherit color from parent node -->
<el-icon name="call-outgoing" style="fill: currentColor;"></el-icon>
```
<div style="color: #2196F3; font-size: 3rem;">
    <el-icon name="printer-error"></el-icon>
    <el-icon name="dialog-warning"></el-icon>
    <el-icon name="appointment-soon"></el-icon>
    <el-icon name="battery-level-20"></el-icon>
    <el-icon name="call-outgoing"></el-icon>
</div>

### Scale

Use style `font-size` property can be used to scale icons.

<el-tag class="title-block">html</el-tag>

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


## Optimization options
---

Icons in `gnomicon/dist/svg/` can be uploaded to
[icomoon.com](https://icomoon.com) to generated SVG Defs Icons
`symbol-defs.svg` which contains only icons you need.

<div style="display: block; margin-bottom: 3rem;"></div>