import hljs from 'highlight.js'
import { Icon } from '../dist/icon.js';
import { addStyle } from 'gadjet/src/style/add-style';
import { fontFluid } from 'gadjet/src/style/font-fluid';
import { theme, pallete } from './color';

customElements.define('el-icon', Icon);
hljs.highlightAll();

addStyle`
html {
    ${fontFluid()}
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
.
`;