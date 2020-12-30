import Color from 'color';

export class Tag extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let shadow_color = window
            .getComputedStyle(this)
            .getPropertyValue('background-color');
        shadow_color = Color(shadow_color).darken(0.5);
        this.style.boxShadow = `0 0.17em 0 0 ${shadow_color}`;
    }
}
