import { addStyle } from 'gadjet/src/style/add-style';
import {define, StyledElement} from 'gadjet/src/ui/ui';
import {bgColor} from 'gadjet/src/style/bg-color';
import { theme } from './color';

class IconGrid extends StyledElement {
    constructor() {
        super();
    }

    render(icon) {
        this.innerHTML = `
            <el-icon set="adwaita" name="${icon}"></el-icon>
            <div class="name">${icon}</div>
        `
    }
}

class IconManager extends StyledElement {
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

define('el-icon-grid', IconGrid);
define('el-icon-manager', IconManager);

addStyle`
#hl1 {
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
        margin: 0;
        font-size: 3rem;
        width: 100%;
    }
    h2 {
        font-size: 2rem;
        width: 100%;
    }
}
`;