import os
import re
from xml.etree import ElementTree

walk = os.walk('adwaita-scalable')
icons = []
for w in walk:
    for icon in w[2]:
        icon = os.path.join(w[0],icon)
        icons.append(icon)

f = open('adwaita.svg', 'w')
f.write('<svg></svg>')
f.close()
ElementTree.register_namespace('', 'http://www.w3.org/2000/svg')
svg_symbol = ElementTree.parse('adwaita.svg')
for icon in icons:
    f = open(icon)
    icon = f.read()
    f.close()
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

svg_symbol.write('adwaita.svg')

f = open('adwaita.svg', 'r')
svg = f.read()
f.close()
svg = svg.replace('fill="#474747"', 'fill="currentColor"')
svg = svg.replace('fill="#2e3436"', 'fill="currentColor"')
svg = svg.replace('stroke="#474747"', 'stroke="currentColor"')
f = open('adwaita.svg', 'w')
f.write(svg)
f.close()
