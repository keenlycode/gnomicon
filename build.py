import re
import io
from pathlib import Path
from xml.etree import ElementTree
import asyncio
import shutil

_dir = Path(__file__).parent

async def icon_svg():
    src_dir = Path(__file__).parent.joinpath('src', 'icon')
    dist_dir = Path(__file__).parent.joinpath('dist')
    adwaita_path = dist_dir.joinpath('icon.svg')
    svg_dir = dist_dir.joinpath('svg')
    svg_dir.mkdir(parents=True, exist_ok=True)

    with open(adwaita_path, 'w') as f:
        f.write('<svg></svg>')

    ElementTree.register_namespace('', 'http://www.w3.org/2000/svg')
    svg_symbol = ElementTree.parse(adwaita_path)
    for svg_path in src_dir.glob('**/*.svg'):
        with open(svg_path) as f:
            svg_path = Path(svg_path)
            svg = f.read()

        svg = svg.replace('fill="#474747"', 'fill="currentColor"')
        svg = svg.replace('fill="#2e3436"', 'fill="currentColor"')
        svg = svg.replace('fill="#2e3434"', 'fill="currentColor"')
        
        svg = ElementTree.parse(io.StringIO(svg))
        svg_root = svg.getroot()

        # Fix node attrib
        for node in svg_root.iter('*'):
            keys = []
            for key in node.attrib:
                if re.match('^font-.*', key):
                    keys.append(key)
                if re.match('style', key):
                    keys.append(key)
                if re.match('color', key):
                    keys.append(key)
            for key in keys:
                del node.attrib[key]

        filename = svg_path.name.replace('-symbolic.svg', '.svg')
        id_ = filename.replace('.svg', '')
        svg.write(svg_dir.joinpath(filename))

        symbol = ElementTree.fromstring('<symbol></symbol>')
        symbol.set('viewBox', '0 0 16 16')
        symbol.set('fill', 'currentColor')
        symbol.set('id', id_)
        title = ElementTree.fromstring('<title></title>')
        title.text = id_
        for t in svg_root.iter('{http://www.w3.org/2000/svg}title'):
            svg_root.remove(t)
        symbol.append(title)
        for node in svg_root:
            symbol.append(node)
        for metadata in symbol.iter('{http://www.w3.org/2000/svg}metadata'):
            symbol.remove(metadata)
        svg_symbol.getroot().append(symbol)
        for metadata in svg_symbol.getroot().iter('metadata'):
            symbol.remove(metadata)

    svg_symbol.write(adwaita_path)


async def icon_js():
    src = _dir.joinpath('node_modules/@nitipit/icon/dist/icon.js')
    dest = _dir.joinpath('dist')
    print(f"copy: {src} -> {dest}")
    shutil.copy(src, dest)


async def main():
    await asyncio.gather(
        icon_svg(),
        icon_js(),
    )

asyncio.run(main())
