import {html, render} from 'lit-html';
import Color from 'color';

export class TagX extends HTMLElement {
    constructor() {
        super()
        this.template = (text) => html`
            <span>${text}</span>
            <pkt-icon set="adwaita" name="window-close"
                @click=${( () => {this.remove()} )}>
            </pkt-icon>
        `
    }

    render() {
        render(this.template(this.innerText), this)
    }

    connectedCallback() {
        this.render();
        let shadow_color = window
            .getComputedStyle(this)
            .getPropertyValue('background-color');
        shadow_color = Color(shadow_color).darken(0.5);
        this.style.boxShadow = `0 0.17em 0 0 ${shadow_color}`;
    }

    remove() {
        this.dispatchEvent(new Event('remove'))
        this.parentNode.removeChild(this)
    }
}
