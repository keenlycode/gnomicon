import os
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
svg_def = ElementTree.parse('adwaita.svg')
for icon in icons:
    print(icon)
    f = open(icon)
    icon = f.read()
    f.close()
    svg = ElementTree.fromstring(icon)
    svg = svg.getchildren()[0]
    try:
        del(svg.attrib['color'])
    except:
        pass
    symbol = ElementTree.fromstring('<symbol></symbol>')
    symbol.set('viewbox', '0 0 16 16')
    symbol.set('id', f.name.split('/')[-1].replace('.svg', ''))
    symbol.append(svg)
    svg_def.getroot().append(symbol)

svg_def.write('adwaita.svg')

f = open('adwaita.svg', 'r')
svg = f.read()
f.close()
svg = svg.replace('fill="#474747"', 'fill="currentColor"')
svg = svg.replace('stroke="#474747"', 'stroke="currentColor"')
f = open('adwaita.svg', 'w')
f.write(svg)
f.close()
