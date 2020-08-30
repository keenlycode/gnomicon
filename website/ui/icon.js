class Icon extends HTMLElement {
    constructor() {
        super()
        this.theme = this.getAttribute('theme')
        this.name = this.getAttribute('name')
    };
    connectedCallback() {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let link = null;
        try {
            link = document.querySelector(
                `link[rel="icon-svg"][theme="${this.theme}"]`);
            link.getAttribute('href');
        } catch (err) {
            console.error(`<link rel="icon-svg"> ${err}`);
        };
        let use = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'use');
        use.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'xlink:href',
            `${link.getAttribute('href')}#${this.name}`);
        svg.style.width = '1em';
        svg.appendChild(use);
        this.appendChild(svg);
    };
};

export {Icon};