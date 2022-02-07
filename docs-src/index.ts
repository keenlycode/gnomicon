import {define, StyledElement} from 'gadjet/src/ui/ui';

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

customElements.define('el-icon-grid', IconGrid);
customElements.define('el-icon-manager', IconManager);