import hljs from 'highlight.js'
import { Icon } from '../dist/icon.js';
import { addStyle } from 'gadjet/src/style/add-style';
import { theme } from './color';

customElements.define('el-icon', Icon);
hljs.highlightAll();

addStyle`
html {
    font-family: 'Fira Sans';
    line-height: 1.7;
}
hr {
    height: 1px;
    border: 0;
    background-color: black;
}

pre > code.hljs {
    padding: 0.5rem 1rem 0.5rem 1rem;
    border-radius: 5px;
    max-width: 50rem;
}

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

p {
    max-width: 50rem
}
`;