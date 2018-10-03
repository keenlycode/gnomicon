import os
from xml.etree import ElementTree

walk = os.walk('adwaita-scalable')
icons = []
for w in walk:
    for icon in w[2]:
        icon = os.path.join(w[0],icon)
        icons.append(icon)

svg_def = ElementTree.fromstring('<svg></svg>')
for icon in icons:
    f = open(icon)
    icon = f.read()
    f.close()
    svg = ElementTree.fromstring(icon)
    svg = svg.getchildren()[0]
    symbol = ElementTree.fromstring('<symbol></symbol>')
    symbol.set('viewbox', '0 0 16 16')
    symbol.set('id', f.name)
    symbol.append(svg)
    svg_def.append(symbol)

print(ElementTree.tostring(symbol))
# print(svg_def.getchildren())
