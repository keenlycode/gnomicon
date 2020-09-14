from pathlib import Path
from xml.etree import ElementTree
from sanic import Sanic
from sanic import response
from jinja2 import (
    Environment, FileSystemLoader, select_autoescape,
    contextfunction, Markup)
import mistune


app_dir = Path(__file__).parent


@contextfunction
def markdown(context, path):
    path = app_dir.joinpath('template', context.name).parent.joinpath(path)
    html = open(path).read()
    html = mistune.html(html)
    return Markup(html)


template = Environment(
    loader=FileSystemLoader(app_dir.joinpath('template')),
    autoescape=select_autoescape(['html', 'xml'])
)
template.globals.update(markdown=markdown)
template = template.get_template

sanic = Sanic("Adwaita")
sanic.static('/static', str(app_dir.joinpath('static')))


@sanic.route("/")
async def icon(request):
    adwaita = app_dir.joinpath('static', 'adwaita.svg')
    adwaita = ElementTree.parse(adwaita)
    adwaita = adwaita.getroot()
    icons = list()
    for icon in adwaita.iter('{http://www.w3.org/2000/svg}title'):
        icons.append(icon.text)

    return response.html(template('home.html').render({'icons': icons}))

if __name__ == "__main__":
    sanic.run(host="0.0.0.0", port=8000, debug=True)
