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
    dest = _dir.joinpath('docs/icons.json')
    try:
        dest.parent.mkdir()
    except Exception:
        pass
    with open(dest, 'w') as file:
        json.dump(icons, file)


async def build():
    proc = await asyncio.create_subprocess_shell(
        'engrave dev docs-src docs --server=127.0.0.1:8000'
    )
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


async def http_server():
    proc = None
    try:
        proc = await asyncio.create_subprocess_shell(
            f'python -m http.server 8000 --directory {_dir.resolve()}')
    except KeyboardInterrupt:
        proc.terminate()


async def main():
    icon_json()
    lib()
    await asyncio.gather(build())


if __name__ == '__main__':
    asyncio.run(main())
