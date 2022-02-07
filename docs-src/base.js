import hljs from 'highlight.js'
import { Icon } from '../dist/icon.js';
import { addStyle } from 'gadjet/src/style/add-style';
import { theme, pallete } from './color';

customElements.define('el-icon', Icon);
hljs.highlightAll();

addStyle`
code {
    color: #ffd0a3;
    background-color: #282c34;
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