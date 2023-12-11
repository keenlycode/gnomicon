import asyncio
import json
from pathlib import Path
from xml.etree import ElementTree
import shutil


_dir = Path(__file__).parent


def icon_json():
    icon_svg = _dir.joinpath('dist', 'icon.svg')
    icon_svg = ElementTree.parse(icon_svg)
    icon_svg = icon_svg.getroot()
    icons = list()
    for icon in icon_svg.iter('{http://www.w3.org/2000/svg}title'):
        icons.append(icon.text)
    icons = {'icons': icons}
    dest = _dir.joinpath('docs/icons.json')
    try:
        dest.parent.mkdir()
    except Exception:
        pass
    with open(dest, 'w') as file:
        json.dump(icons, file)


async def engrave():
    proc = await asyncio.create_subprocess_shell(
        'engrave dev docs-src docs --asset'
    )
    await proc.communicate()
    proc.terminate()

async def esbuild():
    proc = await asyncio.create_subprocess_shell(
        f"node {_dir.joinpath('esbuild/docs.mjs')}"
    )
    await proc.communicate()

def lib():
    lib_dir = _dir.joinpath('docs/lib')
    lib_dir.mkdir(parents=True, exist_ok=True)
    shutil.copytree(
        _dir.joinpath('dist'),
        lib_dir.joinpath('gnomicon'),
        dirs_exist_ok=True)


async def main():
    icon_json()
    lib()
    await asyncio.gather(
        engrave(),
        esbuild()
    )


if __name__ == '__main__':
    asyncio.run(main())
