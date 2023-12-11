import {
    addStyle as css,
    fontFluid,
    bgColor
} from 'gadjet/src/gadjet';

import { theme, palette } from './color';


console.log(import.meta.url);

const __file_url = new URL(import.meta.url);
console.log(__file_url);

const font_sans_url = new URL(
    './asset/font/Fira_Sans/FiraSans-Regular.ttf',
    __file_url
).toString();

css`
@font-face {
    font-family: sans;
    src: url(${font_sans_url});
}

html {
    font-family: 'Fira Sans';
    line-height: 1.7;
    ${fontFluid({
        fontSizeMax: 20,
        fontSizeMin: 14,
        vwMax: 1000,
        vwMin: 300
    })}
}

body {
    margin: 0;
}

hr {
    height: 1px;
    border: 0;
    background-color: black;
}

code {
    color: ${theme.eggShell};
    background-color: ${palette.dark};
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

.container {
    max-width: 1000px;
    margin: auto;
    width: 90%;
}

.row {
    width: 100%;
}

.flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.text {
    max-width: 40rem;
}

a {
    text-decoration: none;
}

p {
    max-width: 50rem;
    width: 100%;
}

pre > code.hljs {
    padding: 0.5rem 1rem 0.5rem 1rem;
    border-radius: 5px;
    max-width: 50rem;
    line-height: 1.5;
    font-size: 0.8em;
    border-top-left-radius: 0;
}

code {
    font-size: 0.8em;
}

.blue {
    color: ${palette.blue}
}
.green {
    color: ${palette.green}
}
.yellow {
    color: ${palette.yellow}
}
.orange {
    color: ${palette.orange}
}
.red {
    color: ${palette.red}
}
.purple {
    color: ${palette.purple}
}
.brown {
    color: ${palette.brown}
}
.light {
    color: ${palette.light}
}
.dark {
    color: ${palette.dark}
}
.bg-red {
    ${bgColor(palette.red)}
}
`;