import { Tag } from 'gadjet/src/gadjet';
import { DefIcon } from '@devcapsule/deficon';
import { addStyle } from '@devcapsule/adapter';

import hljs from 'highlight.js';
import html from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/srcery.css';

hljs.registerLanguage('html', html);
hljs.highlightAll();

import { theme, palette } from './color';
import './_base.style.ts';

const __file_url = new URL(import.meta.url);
const css = String.raw;

if (["localhost", "127.0.0.1", "0.0.0.0"].includes(__file_url.hostname)) {
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
};

class Icon extends DefIcon({url: './lib/gnomicon/icon.svg'}) {};
customElements.define('el-icon', Icon);

addStyle(css`
el-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    fill: currentColor;
}
`);

Tag.define('el-tag');
Tag.tagStyle({color: theme.dimGray});
Tag.classStyle('alert', {
    color: palette.red
});
Tag.tagStyle(css`
&.title-block {
    box-shadow: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    position: relative;
    top: 1rem;
    > code {
        margin-left: 0.5rem;
        padding: 0.2rem 0.5rem;
    }
}
`);