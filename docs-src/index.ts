import { Adapter } from '@nitipit/adapter/src/adapter';
import { 
    Button,
    Badge,
    bgColor,
} from 'gadjet/src/gadjet';
import { theme } from './color';

import './_index.style.ts';


const css = String.raw;

Badge.define('el-badge');

Button.define('button');
Button.tagStyle({
    color: theme.blackCoffee
});

class Impress extends Adapter {};
Impress.define('el-impress');
Impress.tagStyle(css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    ${bgColor(theme.eggShell)}
    min-height: 100vh;
    > div {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    h1 {
        font-size: 3rem;
        width: 100%;
        margin: 0;
        el-badge {
            font-size: 0.4em;
        }
    }
    h2 {
        font-size: 1.5rem;
        width: 100%;
        margin: 0;
    }
    el-icon {
        margin: 0.5rem;
    }
    & div[el="buttons"] button {
        margin: auto 0.5rem;
    }
`)

class IconGrid extends Adapter {
    constructor() {
        super();
    }

    render(icon) {
        this.innerHTML = `
            <el-icon name="${icon}"></el-icon>
            <div class="name">${icon}</div>
        `
    }
}
IconGrid.define('el-icon-grid');

class IconManager extends Adapter {
    constructor() {
        super();
    }

    async connectedCallback() {
        let response: any = await fetch('./icons.json');
        response = await response.json();
        for (let icon of response.icons) {
            let iconGrid = document.createElement('el-icon-grid') as IconGrid;
            iconGrid.render(icon);
            this.appendChild(iconGrid);
        }
    }
}
IconManager.define('el-icon-manager');