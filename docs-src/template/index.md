<h1 style="text-align: center;">Adwaita Icon Web 1.0.2</h1>
<h2 style="text-align: center;">Adwaita Symbolic Icons for Website</h2>

<p style="text-align: center;">
    <a class="github-button"
            href="https://github.com/nitipit/adwaita-icon-web"
            data-size="large" aria-label="Star nitipit/adwaita-icon-web on GitHub">
        Github
    </a>
</p>

<p style="text-align: center;">
    <img src="https://nitipit.github.io/adwaita-icon-web/static/asset/adwaita.png"
        style="width: 100%; max-width: 800px;">
</p>

## Features <el-icon theme="adwaita" name="starred"></el-icon>
---

- 500+ well designed icons from
  [adwaita-icon-theme](https://gitlab.gnome.org/GNOME/adwaita-icon-theme) v3.36
- Use <strong>[SVG Icons]</strong> for sharpness, scalable, easily to customize
  and make animation with css & javascript.
- Provide icon.js to use SVG Sprite as <strong>[Web Components]</strong>

## SVG icon explain
---

**Adwaita Icon Web** can be used by codes below. Even though
**it's not recommended**, this is how **SVG Icons** work on browser
without other libraries or dependencies.

```html
<!-- Using from SVG Sprite -->
<svg style="width: 1em; height: 1em;">
    <use xlink:href="/path/to/adwaita-icon-web/dist/adwaita.svg#call-outgoing"></use>
</svg>
```
> You can also use each SVG Icons in `adwaita-icon-web/dist/svg/`,  
> Read furthur information about SVG in HTML at
> [Using SVG](https://css-tricks.com/using-svg/),
> [SVG Symbol](https://css-tricks.com/svg-symbol-good-choice-icons/)
> from [CSS Tricks](https://css-tricks.com)

However, this project provides javascript libraries to make it easier to use.
With some setup codes, we can use icons by codes below.

```html
<el-icon theme="adwaita" name="call-outgoing"></el-icon>
```

## Install
---

```shell
$ npm install adwaita-icon-web
```

## Set Up
---

```html
<!-- In HTML <head> section -->
<!-- Load adwaita.svg -->
<link icon
    rel="preload"
    theme="adwaita"
    href="/path/to/adwaita-icon-web/dist/adwaita.svg"
    as="image" type="image/svg+xml">

<!-- Import icon.js -->
<script type="module">
import {Icon} from '/path/to/adwaita-icon-web/dist/icon.js';
customElements.define('el-icon', Icon);  // define custom element for icons
</script>
```

### :: Explanation
In the codes above, there're 3 steps to set up icons.

1. Set icon theme by `theme` attribute in `<link icon>`
   which is set to **adwaita**.
2. Provide icon url by `href` attribute in `<link icon>`.
3. Define custom elements for icons using javascript.

## Usage
---

Icon can be rendered by using `<el-icon>` (or whatever it has been defined to)
provide with specific `theme` and icon's `name` which are listed in
[**Icon List**](#icon-list) section.

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

**CSS** `color` property can be used to set icon's color.

```html
<el-icon theme="adwaita" name="call-outgoing" style="color: #2196F3;"></el-icon>
```
<div style="color: #2196F3; font-size: 3rem;">
    <el-icon theme="adwaita" name="printer-error"></el-icon>
    <el-icon theme="adwaita" name="dialog-warning"></el-icon>
    <el-icon theme="adwaita" name="appointment-soon"></el-icon>
    <el-icon theme="adwaita" name="battery-level-20"></el-icon>
    <el-icon theme="adwaita" name="call-outgoing"></el-icon>
</div>

### :: Scale

**CSS** `font-size` property can be used to scale icons.

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

## Use resources from CDN
---

Using resources from NPM CDN doesn't require installation via **npm**.
However, since many **CDN** use **https://**, please note that
webpage have to serve on **https://** otherwise browsers will reject
to load **CDN** resources. (You can check error on browser debug console)

```html
<!-- In HTML <head> section -->

<!-- Load adwaita.svg -->
<link rel="preload"
    icon theme="adwaita"
    href="//unpkg.com/adwaita-icon-web@1.0.0/dist/adwaita.svg"
    as="image" type="image/svg+xml">

<!-- Import icon.js -->
<script type="module">
import {Icon} from '//unpkg.com/adwaita-icon-web@1.0.0/dist/icon.js';
customElements.define('el-icon', Icon);  // define custom element for icons
</script>
```

## Note
---

Since most web browser will block external file access,
`adwaita.svg` should be served on **http://** or **https://**

For unsupport web browser, <a href="https://github.com/jonathantneal/svg4everybody">svg4everybody</a> is recommended.

<h2 id="icon-list">Icon List</h2>

---