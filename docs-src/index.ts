import { addStyle } from 'gadjet/src/style/add-style';
import { define, StyledElement } from 'gadjet/src/ui/ui';
import { bgColor} from 'gadjet/src/style/bg-color';
import { Button } from 'gadjet/src/ui/button/button';
import { Badge } from 'gadjet/src/ui/badge/badge';
import { theme } from './color';

define('el-badge', Badge);

Button.initStyle();
Button.tagStyle({
    color: theme.blackCoffee
})

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
}
`;