import asyncio
import json
from pathlib import Path
from xml.etree import ElementTree
import shutil


_dir = Path(__file__).parent


def icon_json():
    adwaita = _dir.joinpath('dist', 'adwaita.svg')
    adwaita = ElementTree.parse(adwaita)
    adwaita = adwaita.getroot()
    icons = list()
    for icon in adwaita.iter('{http://www.w3.org/2000/svg}title'):
        icons.append(icon.text)
    icons = {'icons': icons}
    json.dump(icons, open(_dir.joinpath('docs/icons.json'), 'w'))


async def build():
    proc = await asyncio.create_subprocess_shell('pillari dev docs-src docs')
    await proc.communicate()
    proc.terminate()


def lib():
    lib_dir = _dir.joinpath('docs/lib')
    lib_dir.mkdir(parents=True, exist_ok=True)
    shutil.copytree(
        _dir.joinpath('dist'),
        lib_dir.joinpath('adwaita-icon-web'),
        dirs_exist_ok=True)

    shutil.copytree(
        _dir.joinpath('node_modules/packet-ui'),
        lib_dir.joinpath('packet-ui'),
        dirs_exist_ok=True)

    shutil.copytree(
        _dir.joinpath('node_modules/highlight.js'),
        lib_dir.joinpath('highlight.js'),
        dirs_exist_ok=True)


# async def docs_html():
#     def index_render(icons):
#         html = template('index.html').render({'icons': icons})
#         with open(docs_dir.joinpath('index.html'), 'w') as f:
#             f.write(html)
#             print('Render index.html')

#     adwaita = base_dir.joinpath('dist', 'adwaita.svg')
#     adwaita = ElementTree.parse(adwaita)
#     adwaita = adwaita.getroot()
#     icons = list()
#     for icon in adwaita.iter('{http://www.w3.org/2000/svg}title'):
#         icons.append(icon.text)

#     index_render(icons)
#     async for changes in awatch(docs_src_dir.joinpath('template')):
#         for change, path in changes:
#             path = Path(path)
#             if path.suffix == '.html' or '.md':
#                 index_render(icons)


async def http_server():
    try:
        proc = await asyncio.create_subprocess_shell(
            f'python -m http.server 8000 --directory {_dir.resolve()}')
    except KeyboardInterrupt:
        proc.terminate()


async def main():
    icon_json()
    lib()
    await asyncio.gather(build())

    # await asyncio.gather(
    #     copy_adwaita_icon(),
    #     asset(),
    #     node_modules(),
    #     web_components(),
    #     docs_html(),
    #     http_server(),
    # )

if __name__ == '__main__':
    asyncio.run(main())
