import re
from os import makedirs
from pathlib import Path
from xml.etree import ElementTree

icon_dir = Path(__file__).parent.joinpath('src', 'adwaita-scalable')
dist_path = Path(__file__).parent.joinpath('dist', 'adwaita.svg')

makedirs(dist_path.parent, exist_ok=True)

with open(dist_path, 'w') as f:
    f.write('<svg></svg>')

ElementTree.register_namespace('', 'http://www.w3.org/2000/svg')
svg_symbol = ElementTree.parse(dist_path)
for icon in icon_dir.glob('**/*.svg'):
    with open(icon) as f:
        icon = f.read()
    svg = ElementTree.fromstring(icon)
    # Fix node attrib
    for node in svg.iter('*'):
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

    symbol = ElementTree.fromstring('<symbol></symbol>')
    symbol.set('viewBox', '0 0 16 16')
    symbol.set('fill', 'currentColor')
    id_ = f.name.split('/')[-1].replace('.svg', '')
    id_ = id_.replace('-symbolic', '')
    symbol.set('id', id_)
    title = ElementTree.fromstring('<title></title>')
    title.text = id_
    for t in svg.iter('{http://www.w3.org/2000/svg}title'):
        svg.remove(t)
    symbol.append(title)
    for node in svg:
        symbol.append(node)
    for metadata in symbol.iter('{http://www.w3.org/2000/svg}metadata'):
        symbol.remove(metadata)
    svg_symbol.getroot().append(symbol)
    for metadata in svg_symbol.getroot().iter('metadata'):
        symbol.remove(metadata)

svg_symbol.write(dist_path)

f = open(dist_path, 'r')
svg = f.read()
f.close()
svg = svg.replace('fill="#474747"', 'fill="currentColor"')
svg = svg.replace('fill="#2e3436"', 'fill="currentColor"')
svg = svg.replace('fill="#bebebe"', 'fill="currentColor"')
svg = svg.replace('stroke="#474747"', 'stroke="currentColor"')
f = open(dist_path, 'w')
f.write(svg)
f.close()
