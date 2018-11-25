# adwaita-icon-web

<img src="adwaita.png">

**adwaita-icon-web** contains symbolic icons from <a href="https://gitlab.gnome.org/GNOME/adwaita-icon-theme">adwaita-icon-theme</a> to provide svg icons for web.

## Usage

Put `adwaita.svg` somewhere which is can be accessed by web browser then use it as symbol definitions in your html code. For example:

```xml
<svg viewBox="0 0 16 16">
   <use xlink:href="adwaita.svg#airplane-mode"></use>
</svg>
```

### Icon color

```html
<svg viewBox="0 0 16 16" style="color: red;">
   <use xlink:href="adwaita.svg#airplane-mode"></use>
</svg>
```

### Icon Size

```html
<svg viewBox="0 0 16 16" style="width: 2em; height: 2em;">
    <use xlink:href="adwaita.svg#airplane-mode"></use>
</svg>
```

## Note

To make `adwaita.svg` accessible by web browser, in most case, the file should be served by web server since most web browser will block external file access.

For unsupport web browser, <a href="https://github.com/jonathantneal/svg4everybody">svg4everybody</a> is recommended.

## Demo

Live demo can be seen at <https://bits-ui.com/guide/icon/>
