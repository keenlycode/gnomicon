# adwaita-icon-web

**adwaita-icon-web** contains symbolic icons from <a href="https://gitlab.gnome.org/GNOME/adwaita-icon-theme">adwaita-icon-theme</a> to provide svg icons for web. It simplify Icons color so it can be modified by CSS, for example: `<svg style="color: red"></svg>`

## Usage :

Put `adwaita.svg` somewhere which is can be accessed by web browser then use it as symbol definitions in your html code. For example:

```xml
<svg viewBox="0 0 16 16">
   <use xlink:href="adwaita.svg#icon-1"></use>
</svg>
```

## Note

To make `adwaita.svg` accessible by web browser, in most case, the file should be served by web server since most web browser will block external file access.

For unsupport web browser, <a href="https://github.com/jonathantneal/svg4everybody">svg4everybody</a> is recommended.


