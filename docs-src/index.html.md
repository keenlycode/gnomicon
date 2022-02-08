## Features
---

- 500+ well designed icons from
  [adwaita-icon-theme](https://gitlab.gnome.org/GNOME/adwaita-icon-theme) v41
- Use **SVG Icons** for sharpness, scalable, easily to customize
  and make animation with **CSS** & **Javascript**.
- Provide `icon.js` to use SVG Sprite as <strong>[Web Components]</strong>

## Update in v.41
---

<h3 style="text-align: center;">Version skip to 41 follow GNOME version.</h3>

<h3 style="text-align: center;">New Icons</h3>
<div class="flex" style="align-items: flex-start; font-size: 2rem;">
    <el-icon-grid>
        <el-icon set="adwaita" name="edit-clear-rtl"></el-icon>
        <div class="name">edit-clear-rtl</div>
    </el-icon-grid>
    <el-icon-grid>
        <el-icon set="adwaita" name="sidebar-show-right-rtl"></el-icon>
        <div class="name">sidebar-show-right-rtl</div>
    </el-icon-grid>
    <el-icon-grid>
        <el-icon set="adwaita" name="sidebar-show-right"></el-icon>
        <div class="name">sidebar-show-right</div>
    </el-icon-grid>
</div>

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
<el-icon set="adwaita" name="call-outgoing"></el-icon>
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
    set="adwaita"
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

1. Use `set` attribute to indentify icon set in `<link icon>` (adwaita).
2. Provide icon url by `href` attribute in `<link icon>`.
3. Define custom elements for icons using javascript.

## Usage
---

Icon can be rendered by using `<el-icon>` (or whatever it has been defined to)
provide with specific `set` and icon's `name` which are listed in
[**Icon List**](#icon-list) section.

```html
<el-icon set="adwaita" name="printer-error"></el-icon>
<el-icon set="adwaita" name="dialog-warning"></el-icon>
<el-icon set="adwaita" name="appointment-soon"></el-icon>
<el-icon set="adwaita" name="battery-level-20"></el-icon>
<el-icon set="adwaita" name="call-outgoing"></el-icon>
```

<div style="font-size: 3rem;">
<el-icon set="adwaita" name="printer-error"></el-icon>
<el-icon set="adwaita" name="dialog-warning"></el-icon>
<el-icon set="adwaita" name="appointment-soon"></el-icon>
<el-icon set="adwaita" name="battery-level-20"></el-icon>
<el-icon set="adwaita" name="call-outgoing"></el-icon>
</div>

### :: Color

**CSS** `color` property can be used to set icon's color.

```html
<el-icon set="adwaita" name="call-outgoing" style="color: #2196F3;"></el-icon>
```
<div style="color: #2196F3; font-size: 3rem;">
    <el-icon set="adwaita" name="printer-error"></el-icon>
    <el-icon set="adwaita" name="dialog-warning"></el-icon>
    <el-icon set="adwaita" name="appointment-soon"></el-icon>
    <el-icon set="adwaita" name="battery-level-20"></el-icon>
    <el-icon set="adwaita" name="call-outgoing"></el-icon>
</div>

### :: Scale

**CSS** `font-size` property can be used to scale icons.

```html
<el-icon set="adwaita" name="printer-error" style="font-size: 1rem;"></el-icon>
<el-icon set="adwaita" name="dialog-warning" style="font-size: 1.5rem;"></el-icon>
<el-icon set="adwaita" name="appointment-soon" style="font-size: 2.0rem;"></el-icon>
<el-icon set="adwaita" name="battery-level-20" style="font-size: 2.5rem;"></el-icon>
<el-icon set="adwaita" name="call-outgoing" style="font-size: 3rem;"></el-icon>
```

<el-icon set="adwaita" name="printer-error" style="font-size: 1rem;"></el-icon>
<el-icon set="adwaita" name="dialog-warning" style="font-size: 1.5rem;"></el-icon>
<el-icon set="adwaita" name="appointment-soon" style="font-size: 2.0rem;"></el-icon>
<el-icon set="adwaita" name="battery-level-20" style="font-size: 2.5rem;"></el-icon>
<el-icon set="adwaita" name="call-outgoing" style="font-size: 3rem;"></el-icon>

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
    icon set="adwaita"
    href="//unpkg.com/adwaita-icon-web@41/dist/adwaita.svg"
    as="image" type="image/svg+xml">

<!-- Import icon.js -->
<script type="module">
import {Icon} from '//unpkg.com/adwaita-icon-web@41/dist/icon.js';
customElements.define('el-icon', Icon);  // define custom element for icons
</script>
```

## Note
---

Since most web browser will block external file access,
`adwaita.svg` should be served on **http://** or **https://**

For unsupport web browser,
<a href="https://github.com/jonathantneal/svg4everybody">svg4everybody</a>
is recommended.