<h1 style="text-align: center;">Adwaita Icon Web</h1>
<h2 style="text-align: center;">Adwaita Symbolic Icons for Website</h2>

<p style="text-align: center;">
    <img src="./static/adwaita.png"
        style="width: 100%; max-width: 800px;">
</p>

## Features <el-icon theme="adwaita" name="starred"></el-icon>
---

- Use <strong>[SVG Icons]</strong> for sharpness, scalable, easily to customize
  and make animation with css & javascript.
- Use <strong>[Web Components]</strong> since it becomes a standard technology
  for speed and less dependencies, also make it easy to integrate with other libraries.

## Install
---

```shell
$ npm install adwaita-icon-web
```

## Set Up
---

### :: Use from local resources

```html
<!-- In HTML <head> section -->

<!-- Load adwaita.svg -->
<link rel="preload"
    icon theme="adwaita"
    href="/path/to/node_modules/adwaita-icon-web/dist/adwaita.svg"
    as="image" type="image/svg+xml">

<!-- Import Icon from icon.js -->
<script type="module">
import {Icon} from '/path/to/node_modules/adwaita-icon-web/dist/icon.js';
customElements.define('el-icon', Icon);  // Can regist on whatever elements.
</script>
```

### :: Use Resources from NPM CDN

Use resources from NPM CDN doesn't require installation via **npm**. However, Since many
**CDN** use **https://**, please note that webpage have to serve on
**https://** otherwise browsers will rejected to load **CDN** resources.

```html
<!-- In HTML <head> section -->

<!-- Load adwaita.svg -->
<link rel="preload"
    icon theme="adwaita"
    href="//unpkg.com/adwaita-icon-web@1.0.0/dist/adwaita.svg"
    as="image" type="image/svg+xml">

<!-- Import Icon from icon.js -->
<script type="module">
import {Icon} from '//unpkg.com/adwaita-icon-web@1.0.0/dist/icon.js';
customElements.define('el-icon', Icon);  // Can be defined with whatever elements.
</script>
```

## Usage
---

```html
<el-icon theme="adwaita" name="printer-error"></el-icon>
<el-icon theme="adwaita" name="dialog-warning"></el-icon>
<el-icon theme="adwaita" name="appointment-soon"></el-icon>
<el-icon theme="adwaita" name="battery-level-20"></el-icon>
<el-icon theme="adwaita" name="call-outgoing"></el-icon>
```
<div style="font-size: 3rem;">
<el-icon theme="adwaita" name="printer-error"></el-icon>
<el-icon theme="adwaita" name="dialog-warning"></el-icon>
<el-icon theme="adwaita" name="appointment-soon"></el-icon>
<el-icon theme="adwaita" name="battery-level-20"></el-icon>
<el-icon theme="adwaita" name="call-outgoing"></el-icon>
</div>

### :: Color

```html
<el-icon theme="adwaita" name="call-outgoing" style="color: blue;"></el-icon>
```
<div style="color: #2196F3; font-size: 3rem;">
    <el-icon theme="adwaita" name="printer-error"></el-icon>
    <el-icon theme="adwaita" name="dialog-warning"></el-icon>
    <el-icon theme="adwaita" name="appointment-soon"></el-icon>
    <el-icon theme="adwaita" name="battery-level-20"></el-icon>
    <el-icon theme="adwaita" name="call-outgoing"></el-icon>
</div>

### :: Scale

```html
<el-icon theme="adwaita" name="printer-error" style="font-size: 1rem;"></el-icon>
<el-icon theme="adwaita" name="dialog-warning" style="font-size: 1.5rem;"></el-icon>
<el-icon theme="adwaita" name="appointment-soon" style="font-size: 2.0rem;"></el-icon>
<el-icon theme="adwaita" name="battery-level-20" style="font-size: 2.5rem;"></el-icon>
<el-icon theme="adwaita" name="call-outgoing" style="font-size: 3rem;"></el-icon>
```

<el-icon theme="adwaita" name="printer-error" style="font-size: 1rem;"></el-icon>
<el-icon theme="adwaita" name="dialog-warning" style="font-size: 1.5rem;"></el-icon>
<el-icon theme="adwaita" name="appointment-soon" style="font-size: 2.0rem;"></el-icon>
<el-icon theme="adwaita" name="battery-level-20" style="font-size: 2.5rem;"></el-icon>
<el-icon theme="adwaita" name="call-outgoing" style="font-size: 3rem;"></el-icon>

## Note
---

Since most web browser will block external file access,
`adwaita.svg` should be served by web server.

For unsupport web browser, <a href="https://github.com/jonathantneal/svg4everybody">svg4everybody</a> is recommended.

## Icons List
---