import asyncio
import shutil
import os
from pathlib import Path
from xml.etree import ElementTree
from watchgod import awatch, Change
import mistune
from jinja2 import (
    Environment, FileSystemLoader, select_autoescape,
    contextfunction, Markup)

base_dir = Path(__file__).parent
docs_src_dir = base_dir.joinpath('docs-src')
docs_dir = base_dir.joinpath('docs')
shell = asyncio.create_subprocess_shell


@contextfunction
def markdown(context, path):
    path = docs_src_dir.joinpath('template', context.name).parent.joinpath(path)
    html = open(path).read()
    html = mistune.html(html)
    return Markup(html)


template = Environment(
    loader=FileSystemLoader(docs_src_dir.joinpath('template')),
    autoescape=select_autoescape(['html', 'xml'])
)
template.globals.update(markdown=markdown)
template = template.get_template


def copy_to_dir(src: Path, dest_dir: Path, src_base_dir: Path = None):
    if src_base_dir:
        dest = src.relative_to(src_base_dir)
    else:
        dest = src.name
    dest = dest_dir.joinpath(dest)
    os.makedirs(dest.parent, exist_ok=True)
    shutil.copy(src, dest)
    print(f'copy {src} -> {dest}')


async def asset():
    asset_dir = docs_src_dir.joinpath('asset')
    dest_dir = docs_dir.joinpath('static', 'asset')
    shutil.copytree(asset_dir, dest_dir, dirs_exist_ok=True)
    print('copy asset: {asset_dir} -> {dest_dir}')


async def node_modules():
    src_dir = base_dir.joinpath('node_modules', 'bits-ui', 'dist')
    dest_dir = docs_dir.joinpath('static', 'lib', 'bits-ui')
    shutil.copytree(src_dir, dest_dir, dirs_exist_ok=True)

    src = base_dir.joinpath(
        'node_modules', 'highlight.js', 'styles', 'atom-one-dark.css')
    dest_dir = docs_dir.joinpath('static', 'lib', 'highlight.js')
    os.makedirs(dest_dir, exist_ok=True)
    shutil.copy(src, dest_dir.joinpath('atom-one-dark.css'))


async def copy_adwaita_icon():
    adwaita_icon_path = base_dir.joinpath('dist', 'adwaita.svg')
    dest_dir = docs_dir.joinpath('static')
    copy_to_dir(adwaita_icon_path, dest_dir)
    async for changes in awatch(adwaita_icon_path):
        for change, path in changes:
            path = Path(path)
            if change == Change.modified:
                copy_to_dir(path, dest_dir)


async def web_components():
    src_dir = base_dir.joinpath('src', 'web-components')
    dest_dir = docs_dir.joinpath('static', 'ui')
    
    for path in src_dir.glob('**/*.js'):
        copy_to_dir(path, dest_dir, src_dir)

    async for changes in awatch(src_dir):
        for change, path in changes:
            path = Path(path)
            if path.suffix != '.js':
                continue
            if not change == Change.deleted:
                copy_to_dir(path, dest_dir, src_dir)


async def sass():
    src_dir = docs_src_dir.joinpath('template').resolve()
    dest_dir = docs_dir
    await shell(f'sass --watch {src_dir}:{dest_dir}')


async def parcel():
    await shell('yarn parcel build '
                '--dist-dir=docs "docs-src/template/**/*.js"')


async def docs_html():
    def index_render():
        html = template('index.html').render({'icons': icons})
        with open(docs_dir.joinpath('index.html'), 'w') as f:
            f.write(html)
            print('Render index.html')

    adwaita = base_dir.joinpath('dist', 'adwaita.svg')
    adwaita = ElementTree.parse(adwaita)
    adwaita = adwaita.getroot()
    icons = list()
    for icon in adwaita.iter('{http://www.w3.org/2000/svg}title'):
        icons.append(icon.text)

    index_render()
    async for changes in awatch(docs_src_dir.joinpath('template')):
        for change, path in changes:
            path = Path(path)
            if path.suffix == '.html' or '.md':
                index_render()


async def http_server():
    try:
        proc = await shell(
            f'python -m http.server 8000 --directory {docs_dir.resolve()}')
    except KeyboardInterrupt:
        proc.terminate()


async def main():
    await asyncio.gather(
        copy_adwaita_icon(),
        asset(),
        node_modules(),
        web_components(),
        parcel(),
        sass(),
        docs_html(),
        http_server(),
    )

if __name__ == '__main__':
    asyncio.run(main())
