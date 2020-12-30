class Icon extends HTMLElement {
    constructor() {
        super();
    };
    connectedCallback() {
        // Must set element properties after it's been attached to DOM.
        this.set = this.getAttribute('set');
        this.name = this.getAttribute('name');

        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let link = null;
        try {
            link = document.querySelector(
                `link[icon][set="${this.set}"]`);
            link.getAttribute('href');
        } catch (err) {
            console.error(`<link icon set="${this.set}"> ${err}`);
        };
        let use = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'use');
        use.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'xlink:href',
            `${link.getAttribute('href')}#${this.name}`);
        svg.style.width = '1em';
        svg.style.height = '1em';
        svg.appendChild(use);
        this.appendChild(svg);
    };
};

export {Icon};