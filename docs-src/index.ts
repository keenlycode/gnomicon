import { Adapter } from '@nitipit/adapter/src/adapter';
import { 
    Button,
    Badge
} from 'gadjet/src/gadjet';
import { theme } from './color';

import './index.style.ts';

Badge.define('el-badge');

Button.initStyle();
Button.tagStyle({
    color: theme.blackCoffee
});

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