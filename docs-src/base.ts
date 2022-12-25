import hljs from 'highlight.js'
import { Icon } from '@nitipit/icon/dist/icon';
import { addStyle } from 'gadjet/src/style/add-style';
import { fontFluid } from 'gadjet/src/style/font-fluid';
import { theme, pallete } from './color';
import { define } from 'gadjet/src/ui/ui';
import { Tag } from 'gadjet/src/ui/tag/tag';
import { bgColor } from 'gadjet/src/style';

Icon.href = './lib/gnomicon/icon.svg';
customElements.define('el-icon', Icon);
Icon.tagName = 'el-icon';

hljs.highlightAll();

define('el-tag', Tag);
Tag.tagStyle({color: theme.dimGray});
Tag.classStyle('alert', {
    color: pallete.red
})

addStyle`
html {
    ${fontFluid({
        fontSizeMax: 20,
        fontSizeMin: 14,
        vwMax: 1000,
        vwMin: 300
    })}
}

code {
    color: ${theme.eggShell};
    background-color: ${pallete.dark};
    padding: 0.2rem;
    border-radius: 4px;
}

h2 ~ hr {
    margin-top: -1rem;
}

h1, h2 {
    color: ${theme.greenBlueCrayola};
}

blockquote {
    margin: 0;
    border-left: 5px solid ${theme.dimGray};
    padding: 0.25rem 0.25rem 0.25rem 1rem;
    ${bgColor(theme.eggShell)}
    blockquote {
        padding-right: 0;
    }
}

${Icon.tagName} {
    fill: currentColor;
}

.blue {
    color: ${pallete.blue}
}
.green {
    color: ${pallete.green}
}
.yellow {
    color: ${pallete.yellow}
}
.orange {
    color: ${pallete.orange}
}
.red {
    color: ${pallete.red}
}
.purple {
    color: ${pallete.purple}
}
.brown {
    color: ${pallete.brown}
}
.light {
    color: ${pallete.light}
}
.dark {
    color: ${pallete.dark}
}
.bg-red {
    ${bgColor(pallete.red)}
}
`;