import hljs from 'highlight.js'
import { Icon } from '@nitipit/icon/dist/icon';
import {
    addStyle,
    Tag
} from 'gadjet/src/gadjet';

import { theme, palette } from './color';

import './base.style.ts';

Icon.href = './lib/gnomicon/icon.svg';
customElements.define('el-icon', Icon);
Icon.tagName = 'el-icon';

addStyle`
${Icon.tagName} {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    fill: currentColor;
}
`;

hljs.highlightAll();

Tag.define('el-tag');
Tag.tagStyle({color: theme.dimGray});
Tag.classStyle('alert', {
    color: palette.red
});
Tag.tagStyle(`
    .title-block {
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