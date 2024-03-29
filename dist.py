import re
import io
from pathlib import Path
from xml.etree import ElementTree
import asyncio

_dir = Path(__file__).parent

def icon_svg():
    src_dir = _dir.joinpath('src', 'icon')
    dist_dir = _dir.joinpath('dist')
    dist_icon_path = dist_dir.joinpath('icon.tmp.svg')
    svg_dir = dist_dir.joinpath('svg')
    svg_dir.mkdir(parents=True, exist_ok=True)

    with open(dist_icon_path, 'w') as f:
        f.write('<svg></svg>')

    ElementTree.register_namespace('', 'http://www.w3.org/2000/svg')
    svg_symbol = ElementTree.parse(dist_icon_path)

    def sort_by_name_caseless(path):
        return str.casefold(str(path))

    for svg_path in sorted(
            src_dir.glob('**/*.svg'), key=sort_by_name_caseless):
        with open(svg_path) as f:
            svg_path = Path(svg_path)
            svg = f.read()

        svg = svg.replace('fill="#474747"', '')
        svg = svg.replace('fill="#2e3436"', '')
        svg = svg.replace('fill="#2e3434"', '')
        svg = svg.replace('fill="#222222"', '')
        svg = svg.replace('fill="#212121"', '')
        
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

    svg_symbol.write(dist_icon_path)


async def svg_optimize():
    src = _dir.joinpath('dist/icon.tmp.svg')
    dest = _dir.joinpath('dist/icon.svg')
    cmd = f"scour {src} {dest}"
    print(cmd)
    proc = await asyncio.subprocess.create_subprocess_shell(cmd)
    await proc.communicate()
    Path.unlink(src)


async def main():
    icon_svg()
    await svg_optimize()

if __name__ == '__main__':
    asyncio.run(main())
